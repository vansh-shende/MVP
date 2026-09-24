import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  Eye,
  Filter,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useActivity } from '../../context/ActivityContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProofPreviewModal } from '../../components/modals/ProofPreviewModal';
import { ActivitySubmission } from '../../types';

export const MySubmissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { submissions } = useActivity();

  const [selectedSubmission, setSelectedSubmission] = useState<ActivitySubmission | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter student submissions
  const studentSubs = submissions.filter(
    (s) => s.studentId === currentUser?.id || s.studentId === 'std-103' || s.studentId === 'std-101' || s.studentName === 'Vansh Shende' || !s.studentId
  );

  const filteredSubs = studentSubs.filter((sub) => {
    if (filterCategory !== 'All' && sub.category !== filterCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (sub.title || '').toLowerCase().includes(q);
      const matchInst = (sub.organizingInstitution || sub.eventOrOrg || '').toLowerCase().includes(q);
      const matchCat = (sub.category || '').toLowerCase().includes(q);
      return matchTitle || matchInst || matchCat;
    }
    return true;
  });

  return (
    <DashboardLayout onSearch={setSearchQuery} searchPlaceholder="Search submissions by title or organization...">
      <div className="space-y-5">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D9E0E7]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0B2945]">
              My Submissions
            </h1>
            <p className="text-xs sm:text-[13px] text-[#65758B] mt-0.5">
              Review your recorded college activities and current verification status.
            </p>
          </div>

          <button
            onClick={() => navigate('/student/add-activity')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#123B63] hover:bg-[#0B2945] text-white font-semibold text-xs rounded-[5px] transition-colors self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Add Activity
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#65758B]" />
            <span className="text-xs font-semibold text-[#243447]">Filter Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-1.5 text-xs bg-[#F5F7F9] border border-[#D9E0E7] rounded-[4px] text-[#243447] focus:outline-hidden focus:border-[#123B63]"
            >
              <option value="All">All Categories ({studentSubs.length})</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Technical Workshop">Technical Workshop</option>
              <option value="Coding Contest">Coding Contest</option>
              <option value="Green Campus">Green Campus</option>
              <option value="Sports">Sports</option>
              <option value="Cultural">Cultural</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="text-xs text-[#65758B]">
            Showing <strong className="text-[#0B2945]">{filteredSubs.length}</strong> of{' '}
            <strong className="text-[#0B2945]">{studentSubs.length}</strong> activities
          </div>
        </div>

        {/* Submissions Table / Empty State */}
        <div className="bg-white rounded-[6px] border border-[#D9E0E7] overflow-hidden">
          {filteredSubs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F5F7F9] border-b border-[#D9E0E7] text-[#65758B] font-semibold">
                    <th className="py-2.5 px-4">Activity Title</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4">Level</th>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                    <th className="py-2.5 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9E0E7]">
                  {filteredSubs.map((sub) => {
                    const isRejected = sub.status === 'Rejected';
                    const remarkText = sub.teacherRemark || sub.facultyRemarks;

                    return (
                      <React.Fragment key={sub.id}>
                        <tr
                          className="hover:bg-[#F5F7F9] transition-colors cursor-pointer"
                          onClick={() => setSelectedSubmission(sub)}
                        >
                          {/* Activity Title */}
                          <td className="py-3 px-4">
                            <p className="font-semibold text-[#0B2945] hover:text-[#123B63] transition-colors">
                              {sub.title}
                            </p>
                            <p className="text-[11px] text-[#65758B] mt-0.5 truncate max-w-xs">
                              {sub.organizingInstitution || sub.eventOrOrg || 'KITS Ramtek'}
                              {sub.role ? ` · Role: ${sub.role}` : ''}
                            </p>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="inline-block px-2 py-0.5 rounded-[4px] bg-[#F5F7F9] border border-[#D9E0E7] text-[#243447] text-[11px] font-medium">
                              {sub.category}
                            </span>
                          </td>

                          {/* Level */}
                          <td className="py-3 px-4 whitespace-nowrap text-[#243447] font-medium">
                            {sub.level || 'College'}
                          </td>

                          {/* Date */}
                          <td className="py-3 px-4 whitespace-nowrap text-[#65758B] font-mono text-[11px]">
                            {sub.date || sub.dateSubmitted}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <StatusBadge status={sub.status} />
                          </td>

                          {/* Action View */}
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSubmission(sub);
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#123B63] hover:text-[#0B2945] bg-[#EAF2F8] px-2.5 py-1 rounded-[4px] border border-[#D9E0E7] transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </button>
                          </td>
                        </tr>

                        {/* Teacher Remark Banner if present */}
                        {remarkText && (
                          <tr className={isRejected ? "bg-[#FDF2F2]" : "bg-[#EAF2F8]/60"}>
                            <td colSpan={6} className={`px-4 py-2 text-xs border-b ${isRejected ? "text-[#B33A3A] border-[#F7C8C8]" : "text-[#123B63] border-[#D9E0E7]"}`}>
                              <div className="flex items-start gap-2">
                                {isRejected ? (
                                  <AlertTriangle className="w-3.5 h-3.5 text-[#B33A3A] shrink-0 mt-0.5" />
                                ) : (
                                  <MessageSquare className="w-3.5 h-3.5 text-[#123B63] shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <span className="font-bold">Faculty Remark: </span>
                                  <span className="italic">{remarkText}</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty State */
            <div className="py-12 px-4 text-center">
              <div className="w-10 h-10 rounded-[4px] bg-[#F5F7F9] text-[#65758B] flex items-center justify-center mx-auto mb-2 border border-[#D9E0E7]">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0B2945]">
                No activities submitted yet.
              </h3>
              <p className="text-xs text-[#65758B] mt-0.5 max-w-sm mx-auto">
                Record your workshops, hackathons, sports and certifications to accumulate verified portfolio credits.
              </p>
              <div className="mt-3.5">
                <button
                  type="button"
                  onClick={() => navigate('/student/add-activity')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#123B63] hover:bg-[#0B2945] text-white font-semibold text-xs rounded-[5px] transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Activity
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Proof Preview Modal */}
      {selectedSubmission && (
        <ProofPreviewModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </DashboardLayout>
  );
};
