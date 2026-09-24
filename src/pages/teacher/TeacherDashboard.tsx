import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useActivity } from '../../context/ActivityContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { VerificationModal } from '../../components/modals/VerificationModal';
import { ActivitySubmission, SubmissionStatus } from '../../types';

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { submissions, stats, updateSubmissionStatus } = useActivity();

  const [selectedSubForReview, setSelectedSubForReview] = useState<ActivitySubmission | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string>('');

  // Pending activities
  const pendingSubmissions = submissions.filter(
    (s) => s.status === 'Pending' || s.status === 'Under Review'
  );

  const handleVerify = (
    id: string,
    status: SubmissionStatus,
    remarks?: string
  ) => {
    updateSubmissionStatus(id, status, remarks, 25, currentUser?.name || 'Dr. Neha Deshmukh');

    if (status === 'Approved') {
      setActionFeedback('Activity approved successfully.');
    } else if (status === 'Rejected') {
      setActionFeedback('Activity rejected.');
    }

    setTimeout(() => {
      setActionFeedback('');
    }, 4000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* FACULTY DASHBOARD HEADER */}
        <div className="bg-white rounded-[6px] border border-[#D9E0E7] px-5 py-4">
          <span className="text-[11px] font-bold text-[#65758B] uppercase tracking-wider">
            Faculty Portal
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0B2945] mt-0.5">
            Hello, {currentUser?.name?.split(' ')[1] || 'Dr. Deshmukh'}.
          </h1>
          <p className="text-xs sm:text-[13px] text-[#65758B] mt-0.5">
            Review student activity submissions, inspect uploaded proof documents, and record verification status.
          </p>
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

        {/* TEACHER SUMMARY CARDS (White background, thin border, values colored only) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Card 1: Pending Reviews */}
          <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-3.5">
            <span className="text-xs font-medium text-[#65758B]">Pending Reviews</span>
            <p className="text-2xl sm:text-3xl font-bold text-[#A66A00] font-mono mt-1">
              {stats.teacherStats.pendingReviews < 10
                ? `0${stats.teacherStats.pendingReviews}`
                : stats.teacherStats.pendingReviews}
            </p>
            <p className="text-[11px] text-[#A66A00] mt-1">Awaiting evaluation</p>
          </div>

          {/* Card 2: Approved */}
          <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-3.5">
            <span className="text-xs font-medium text-[#65758B]">Approved</span>
            <p className="text-2xl sm:text-3xl font-bold text-[#287A55] font-mono mt-1">
              {stats.teacherStats.approved < 10
                ? `0${stats.teacherStats.approved}`
                : stats.teacherStats.approved}
            </p>
            <p className="text-[11px] text-[#287A55] mt-1">Validated activities</p>
          </div>

          {/* Card 3: Rejected */}
          <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-3.5">
            <span className="text-xs font-medium text-[#65758B]">Rejected</span>
            <p className="text-2xl sm:text-3xl font-bold text-[#B33A3A] font-mono mt-1">
              {stats.teacherStats.rejected < 10
                ? `0${stats.teacherStats.rejected}`
                : stats.teacherStats.rejected}
            </p>
            <p className="text-[11px] text-[#B33A3A] mt-1">Returned with remarks</p>
          </div>

          {/* Card 4: Total Submissions */}
          <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-3.5">
            <span className="text-xs font-medium text-[#65758B]">Total Submissions</span>
            <p className="text-2xl sm:text-3xl font-bold text-[#0B2945] font-mono mt-1">
              {stats.teacherStats.totalSubmissions < 10
                ? `0${stats.teacherStats.totalSubmissions}`
                : stats.teacherStats.totalSubmissions}
            </p>
            <p className="text-[11px] text-[#65758B] mt-1">Student submissions</p>
          </div>
        </div>

        {/* PENDING SUBMISSIONS ADMINISTRATIVE TABLE */}
        <div className="bg-white rounded-[6px] border border-[#D9E0E7] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#D9E0E7] flex items-center justify-between bg-[#F5F7F9]">
            <div>
              <h2 className="text-sm font-bold text-[#0B2945]">Pending Submissions</h2>
              <p className="text-[11px] text-[#65758B]">Student submissions awaiting faculty verification and review</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-[#FEF7EB] text-[#A66A00] border border-[#F6DFC0] rounded-[4px]">
              {pendingSubmissions.length} Pending
            </span>
          </div>

          {pendingSubmissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-white border-b border-[#D9E0E7] text-[#65758B] font-semibold">
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
                  {pendingSubmissions.map((sub) => (
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
              <CheckCircle2 className="w-7 h-7 text-[#287A55] mx-auto mb-1.5" />
              <p className="font-semibold text-[#0B2945] text-sm">No pending submissions to review.</p>
              <p className="text-[#65758B] mt-0.5">All student activities have been evaluated.</p>
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
