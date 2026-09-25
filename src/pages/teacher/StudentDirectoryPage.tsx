import React, { useState } from 'react';
import { Users, Search } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useActivity } from '../../context/ActivityContext';
import { DEMO_STUDENTS_LIST } from '../../data/mockData';

export const StudentDirectoryPage: React.FC = () => {
  const { submissions } = useActivity();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  const filtered = DEMO_STUDENTS_LIST.filter((std) => {
    if (deptFilter !== 'all' && !std.branch.toLowerCase().includes(deptFilter.toLowerCase())) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return std.name.toLowerCase().includes(q) || std.roll.toLowerCase().includes(q) || std.branch.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <DashboardLayout onSearch={setSearch} searchPlaceholder="Search student records...">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D9E0E7]">
          <div>
            <h1 className="text-[28px] sm:text-[30px] font-bold text-[#0B2945] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#123B63]" />
              Student Records
            </h1>
            <p className="text-[14px] text-[#65758B] mt-0.5">
              Enrolled students directory and verified portfolio status across academic departments.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="p-1.5 bg-[#F5F7F9] border border-[#D9E0E7] rounded-[4px] text-[15px] sm:text-[16px] text-[#243447]"
            >
              <option value="all">All Departments</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Computer Technology">Computer Technology</option>
              <option value="Electronics & Communication">Electronics & Comm.</option>
              <option value="Mechanical Engineering">Mechanical Engg.</option>
              <option value="Civil Engineering">Civil Engg.</option>
            </select>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#65758B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or roll number..."
              className="w-full pl-8 pr-3 py-1.5 text-[15px] sm:text-[16px] bg-[#F5F7F9] border border-[#D9E0E7] rounded-[5px] text-[#243447] focus:outline-hidden focus:border-[#123B63]"
            />
          </div>
        </div>

        {/* Student Directory Table */}
        <div className="bg-white rounded-[6px] border border-[#D9E0E7] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[15px]">
              <thead>
                <tr className="bg-[#F5F7F9] border-b border-[#D9E0E7] text-[#65758B] font-semibold text-[14px]">
                  <th className="py-2.5 px-4">Student Name</th>
                  <th className="py-2.5 px-4">Roll Number</th>
                  <th className="py-2.5 px-4">Department</th>
                  <th className="py-2.5 px-4">Academic Year</th>
                  <th className="py-2.5 px-4">CGPA</th>
                  <th className="py-2.5 px-4 text-center">Submissions</th>
                  <th className="py-2.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E0E7]">
                {filtered.map((std) => {
                  const studentSubs = submissions.filter(s => s.studentId === std.id || s.studentName === std.name);
                  const approvedCount = studentSubs.filter(s => s.status === 'Approved' || s.status === 'Verified').length;
                  return (
                    <tr key={std.id} className="hover:bg-[#F5F7F9] transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-[4px] bg-[#EAF2F8] text-[#123B63] flex items-center justify-center font-bold text-[12px]">
                            {std.name.slice(0, 2)}
                          </div>
                          <span className="font-semibold text-[#0B2945] text-[15px]">{std.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#243447] text-[15px]">{std.roll}</td>
                      <td className="py-3 px-4 text-[#243447] text-[15px]">{std.branch}</td>
                      <td className="py-3 px-4 text-[#65758B] text-[14px] sm:text-[15px]">{std.year}</td>
                      <td className="py-3 px-4 font-mono font-medium text-[#0B2945] text-[15px]">{std.cgpa}</td>
                      <td className="py-3 px-4 text-center font-mono">
                        <span className="font-semibold text-[#0B2945] text-[15px]">{studentSubs.length}</span>
                        <span className="text-[#65758B] text-[14px]"> ({approvedCount} approved)</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-block px-2.5 py-0.5 rounded-[4px] bg-[#EAF5EE] text-[#287A55] border border-[#C6E7D5] font-semibold text-[13px] sm:text-[14px]">
                          Enrolled
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
