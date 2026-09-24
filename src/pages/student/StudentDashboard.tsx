import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  ListFilter,
  User,
  ChevronRight
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useActivity } from '../../context/ActivityContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProofPreviewModal } from '../../components/modals/ProofPreviewModal';
import { ActivitySubmission } from '../../types';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { submissions, stats } = useActivity();

  const [selectedSubmission, setSelectedSubmission] = useState<ActivitySubmission | null>(null);

  // Student submissions for Vansh Shende
  const studentSubs = submissions.filter(
    (s) => s.studentId === currentUser?.id || s.studentId === 'std-103' || s.studentId === 'std-101' || s.studentName === 'Vansh Shende' || !s.studentId
  );

  // Dynamic recent 5 activities
  const recentSubmissions = studentSubs.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* DASHBOARD HEADER: Compact institutional header */}
        <div className="bg-white rounded-[6px] border border-[#D9E0E7] px-5 py-3.5">
          <span className="text-[11px] font-bold text-[#65758B] uppercase tracking-wider">
            Student Dashboard
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0B2945] mt-0.5">
            Hello, Vansh! 👋
          </h1>
          <p className="text-xs sm:text-[13px] text-[#65758B] mt-0.5">
            Manage your activities and achievements from one place.
          </p>
        </div>

        {/* STATISTICS: Simple institutional information boxes (White background, thin border, colored values only) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Total Activities */}
          <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-3.5">
            <span className="text-xs font-medium text-[#65758B]">Total Activities</span>
            <p className="text-2xl sm:text-3xl font-bold text-[#0B2945] font-mono mt-1">
              {stats.studentStats.totalActivities < 10
                ? `0${stats.studentStats.totalActivities}`
                : stats.studentStats.totalActivities}
            </p>
            <p className="text-[11px] text-[#65758B] mt-1">Submitted records</p>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-3.5">
            <span className="text-xs font-medium text-[#65758B]">Pending</span>
            <p className="text-2xl sm:text-3xl font-bold text-[#A66A00] font-mono mt-1">
              {stats.studentStats.pending < 10
                ? `0${stats.studentStats.pending}`
                : stats.studentStats.pending}
            </p>
            <p className="text-[11px] text-[#A66A00] mt-1">Awaiting faculty review</p>
          </div>

          {/* Approved */}
          <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-3.5">
            <span className="text-xs font-medium text-[#65758B]">Approved</span>
            <p className="text-2xl sm:text-3xl font-bold text-[#287A55] font-mono mt-1">
              {stats.studentStats.approved < 10
                ? `0${stats.studentStats.approved}`
                : stats.studentStats.approved}
            </p>
            <p className="text-[11px] text-[#287A55] mt-1">Verified records</p>
          </div>

          {/* Rejected */}
          <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-3.5">
            <span className="text-xs font-medium text-[#65758B]">Rejected</span>
            <p className="text-2xl sm:text-3xl font-bold text-[#B33A3A] font-mono mt-1">
              {stats.studentStats.rejected < 10
                ? `0${stats.studentStats.rejected}`
                : stats.studentStats.rejected}
            </p>
            <p className="text-[11px] text-[#B33A3A] mt-1">Requires correction</p>
          </div>
        </div>

        {/* RECENT SUBMISSIONS TABLE & PROFILE INFORMATION PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Main Area: Recent Submissions Administrative Table */}
          <div className="lg:col-span-8 bg-white rounded-[6px] border border-[#D9E0E7] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#D9E0E7] flex items-center justify-between bg-[#F5F7F9]">
              <div>
                <h2 className="text-sm font-bold text-[#0B2945]">Recent Submissions</h2>
                <p className="text-[11px] text-[#65758B]">Latest submissions</p>
              </div>
              <button
                onClick={() => navigate('/student/submissions')}
                className="text-xs font-semibold text-[#123B63] hover:text-[#0B2945] transition-colors inline-flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Administrative Table (Columns: Type, Activity, Date, Status) */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-white border-b border-[#D9E0E7] text-[#65758B] font-semibold">
                    <th className="py-2.5 px-4">Type</th>
                    <th className="py-2.5 px-4">Activity</th>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9E0E7]">
                  {recentSubmissions.map((sub) => (
                    <tr
                      key={sub.id}
                      onClick={() => setSelectedSubmission(sub)}
                      className="hover:bg-[#F5F7F9] cursor-pointer transition-colors"
                      title="Click to view details"
                    >
                      {/* Type */}
                      <td className="py-3 px-4 font-medium text-[#243447] whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-[4px] bg-[#F5F7F9] border border-[#D9E0E7] text-[#243447] text-[11px]">
                          {sub.category || sub.type || 'Activity'}
                        </span>
                      </td>

                      {/* Activity */}
                      <td className="py-3 px-4">
                        <p className="font-semibold text-[#0B2945] hover:text-[#123B63] transition-colors">
                          {sub.title}
                        </p>
                        {(sub.organizingInstitution || sub.eventOrOrg) && (
                          <p className="text-[11px] text-[#65758B] mt-0.5">
                            {sub.organizingInstitution || sub.eventOrOrg}
                          </p>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-[#65758B] whitespace-nowrap font-mono text-[11px]">
                        {sub.submittedAt || sub.dateSubmitted || sub.date}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <StatusBadge status={sub.status} />
                      </td>
                    </tr>
                  ))}

                  {recentSubmissions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-[#65758B]">
                        No submissions recorded. Click "Add Activity" to submit your first entry.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Student Profile & Quick Actions */}
          <div className="lg:col-span-4 space-y-4">
            {/* Student Profile: Administrative information panel */}
            <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-4">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#D9E0E7] mb-3">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-[#65758B]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#65758B]">
                    Student Profile
                  </h3>
                </div>
                <button
                  onClick={() => navigate('/student/profile')}
                  className="text-xs font-semibold text-[#123B63] hover:text-[#0B2945]"
                >
                  View Details
                </button>
              </div>

              <div>
                <h4 className="font-bold text-[#0B2945] text-sm">
                  {currentUser?.name || 'Vansh Shende'}
                </h4>
                <p className="text-xs text-[#65758B]">
                  {currentUser?.department || 'Information Technology'}
                </p>
              </div>

              <div className="space-y-1.5 text-xs border-t border-[#D9E0E7] mt-3 pt-2.5">
                <div className="flex justify-between py-0.5">
                  <span className="text-[#65758B]">Roll Number</span>
                  <span className="font-mono font-medium text-[#0B2945]">
                    {currentUser?.rollNumber || 'ITXXXX'}
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-[#65758B]">Semester</span>
                  <span className="font-medium text-[#0B2945]">
                    {currentUser?.semester || '5th Semester'}
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-[#65758B]">Department</span>
                  <span className="font-medium text-[#0B2945]">
                    {currentUser?.department || 'Information Technology'}
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-[#65758B]">Institution</span>
                  <span className="font-medium text-[#0B2945]">KITS Ramtek</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#65758B] mb-2.5">
                Quick Actions
              </h3>

              <div className="space-y-2">
                <button
                  onClick={() => navigate('/student/add-activity')}
                  className="w-full flex items-center justify-between p-2.5 rounded-[5px] bg-[#123B63] hover:bg-[#0B2945] text-white text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-white" />
                    <span className="text-xs font-semibold">Add New Activity</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/70" />
                </button>

                <button
                  onClick={() => navigate('/student/submissions')}
                  className="w-full flex items-center justify-between p-2.5 rounded-[5px] bg-white hover:bg-[#F5F7F9] border border-[#D9E0E7] text-[#243447] text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ListFilter className="w-4 h-4 text-[#65758B]" />
                    <span className="text-xs font-semibold text-[#0B2945]">My Submissions</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#65758B]" />
                </button>
              </div>
            </div>
          </div>
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
