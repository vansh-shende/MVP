import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useActivity } from '../../context/ActivityContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { VerificationModal } from '../../components/modals/VerificationModal';
import { ActivitySubmission, SubmissionStatus } from '../../types';

export const VerificationPage: React.FC = () => {
  const { submissions, stats, updateSubmissionStatus } = useActivity();
  const { currentUser } = useAuth();

  const [filterStatus, setFilterStatus] = useState<'pending' | 'all' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubForReview, setSelectedSubForReview] = useState<ActivitySubmission | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string>('');

  const handleVerify = (
    id: string,
    status: SubmissionStatus,
    remarks?: string
  ) => {
    updateSubmissionStatus(id, status, remarks, 25, currentUser?.name || 'Mrs. Harshita Jain');

    if (status === 'Approved') {
      setActionFeedback('Activity approved successfully.');
    } else if (status === 'Rejected') {
      setActionFeedback('Activity rejected.');
    }

    setTimeout(() => {
      setActionFeedback('');
    }, 4000);
  };

  const filtered = submissions.filter((sub) => {
    if (filterStatus === 'pending') {
      if (sub.status !== 'Pending' && sub.status !== 'Under Review') return false;
    } else if (filterStatus === 'approved') {
      if (sub.status !== 'Approved' && sub.status !== 'Verified') return false;
    } else if (filterStatus === 'rejected') {
      if (sub.status !== 'Rejected') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchStudent = (sub.studentName || '').toLowerCase().includes(q);
      const matchRoll = (sub.studentRoll || '').toLowerCase().includes(q);
      const matchTitle = (sub.title || '').toLowerCase().includes(q);
      const matchCat = (sub.category || sub.type || '').toLowerCase().includes(q);
      return matchStudent || matchRoll || matchTitle || matchCat;
    }

    return true;
  });

  return (
    <DashboardLayout onSearch={setSearchQuery} searchPlaceholder="Search submissions by student, title, or category...">
      <div className="space-y-5">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D9E0E7]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B2945] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#123B63]" />
              Pending Submissions
            </h1>
            <p className="text-xs sm:text-[13px] text-[#65758B] mt-0.5">
              Verify student activities, inspect proof documentation, and record approval or feedback remarks.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-[#FEF7EB] text-[#A66A00] border border-[#F6DFC0] rounded-[4px] self-start sm:self-auto">
            {stats.teacherStats.pendingReviews} Awaiting Review
          </span>
        </div>

        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div className="p-3 bg-[#EAF5EE] border border-[#C6E7D5] rounded-[5px] flex items-center justify-between text-[#287A55] text-xs sm:text-sm font-medium">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#287A55]" />
              {actionFeedback}
            </span>
            <span className="text-[11px] text-[#287A55]/80">Updated successfully</span>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-[#F5F7F9] rounded-[4px] border border-[#D9E0E7] text-xs overflow-x-auto">
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1 font-medium rounded-[3px] whitespace-nowrap transition-all ${
                filterStatus === 'pending'
                  ? 'bg-white text-[#0B2945] shadow-xs font-semibold border border-[#D9E0E7]'
                  : 'text-[#65758B] hover:text-[#0B2945]'
              }`}
            >
              Pending ({stats.teacherStats.pendingReviews})
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-3 py-1 font-medium rounded-[3px] whitespace-nowrap transition-all ${
                filterStatus === 'approved'
                  ? 'bg-white text-[#287A55] shadow-xs font-semibold border border-[#D9E0E7]'
                  : 'text-[#65758B] hover:text-[#0B2945]'
              }`}
            >
              Approved ({stats.teacherStats.approved})
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-3 py-1 font-medium rounded-[3px] whitespace-nowrap transition-all ${
                filterStatus === 'rejected'
                  ? 'bg-white text-[#B33A3A] shadow-xs font-semibold border border-[#D9E0E7]'
                  : 'text-[#65758B] hover:text-[#0B2945]'
              }`}
            >
              Rejected ({stats.teacherStats.rejected})
            </button>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 font-medium rounded-[3px] whitespace-nowrap transition-all ${
                filterStatus === 'all'
                  ? 'bg-white text-[#0B2945] shadow-xs font-semibold border border-[#D9E0E7]'
                  : 'text-[#65758B] hover:text-[#0B2945]'
              }`}
            >
              All Records ({submissions.length})
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#65758B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student or activity..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F5F7F9] border border-[#D9E0E7] rounded-[5px] text-[#243447] placeholder-[#65758B] focus:outline-hidden focus:border-[#123B63]"
            />
          </div>
        </div>

        {/* Administrative Table */}
        <div className="bg-white rounded-[6px] border border-[#D9E0E7] overflow-hidden">
          {filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F5F7F9] border-b border-[#D9E0E7] text-[#65758B] font-semibold">
                    <th className="py-2.5 px-4">Student Name</th>
                    <th className="py-2.5 px-4">Activity Title</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4">Level</th>
                    <th className="py-2.5 px-4">Date Submitted</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9E0E7]">
                  {filtered.map((sub) => (
                    <tr key={sub.id} className="hover:bg-[#F5F7F9] transition-colors">
                      {/* Student Name */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <p className="font-semibold text-[#0B2945] text-xs sm:text-[13px]">{sub.studentName}</p>
                        <p className="text-[11px] text-[#65758B] font-mono">
                          {sub.studentRoll ? `Roll: ${sub.studentRoll}` : 'Roll: ITXXXX'}
                        </p>
                      </td>

                      {/* Activity Title */}
                      <td className="py-3 px-4">
                        <p className="font-semibold text-[#0B2945]">{sub.title}</p>
                        {(sub.organizingInstitution || sub.eventOrOrg) && (
                          <p className="text-[11px] text-[#65758B]">
                            {sub.organizingInstitution || sub.eventOrOrg}
                          </p>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-[4px] bg-[#F5F7F9] border border-[#D9E0E7] text-[#243447] text-[11px]">
                          {sub.category || sub.type || 'Activity'}
                        </span>
                      </td>

                      {/* Level */}
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-[#243447]">
                        {sub.level || 'College'}
                      </td>

                      {/* Date Submitted */}
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[#65758B] text-[11px]">
                        {sub.submittedAt || sub.dateSubmitted || sub.date}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <StatusBadge status={sub.status} />
                      </td>

                      {/* Action [Review] */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedSubForReview(sub)}
                          className="px-3 py-1.5 bg-[#123B63] hover:bg-[#0B2945] text-white font-semibold rounded-[5px] text-xs transition-colors"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-[#65758B] text-xs">
              <Clock className="w-7 h-7 text-[#65758B] mx-auto mb-1.5" />
              <p className="font-semibold text-[#0B2945] text-sm">No pending submissions to review.</p>
              <p className="text-[#65758B] mt-0.5">
                {filterStatus === 'pending'
                  ? 'All student submissions have been evaluated.'
                  : 'No submissions match your selected filter.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Review Activity Modal */}
      {selectedSubForReview && (
        <VerificationModal
          submission={selectedSubForReview}
          onClose={() => setSelectedSubForReview(null)}
          onVerify={handleVerify}
        />
      )}
    </DashboardLayout>
  );
};
