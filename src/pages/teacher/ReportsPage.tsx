import React, { useState } from 'react';
import { BarChart3, Download, FileSpreadsheet, CheckCircle2, ShieldCheck } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { COLLEGE_INFO } from '../../data/mockData';
import { useActivity } from '../../context/ActivityContext';

export const ReportsPage: React.FC = () => {
  const { stats, submissions } = useActivity();

  const [exportNotice, setExportNotice] = useState(false);

  const handleExportCSV = () => {
    const headers = ['Student Name', 'Roll Number', 'Branch', 'Year', 'Activity Title', 'Category', 'Level', 'Date', 'Status', 'Points'];
    const rows = submissions.map(s => [
      `"${s.studentName || ''}"`,
      `"${s.studentRoll || ''}"`,
      `"${s.branch || s.studentDept || ''}"`,
      `"${s.studentYear || ''}"`,
      `"${(s.title || '').replace(/"/g, '""')}"`,
      `"${s.category || ''}"`,
      `"${s.level || ''}"`,
      `"${s.date || ''}"`,
      `"${s.status || ''}"`,
      `"${s.activityPoints || (s.status === 'Approved' ? 25 : 0)}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KITS_Ramtek_Activity_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              Activity & Accreditation Reports
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Consolidated NAAC / NBA student activity records for {COLLEGE_INFO.shortName}.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export NAAC Data (CSV)
          </button>
        </div>

        {exportNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>NAAC Activity Report CSV exported successfully.</span>
          </div>
        )}

        {/* Overview Metric Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <p className="text-xs font-semibold text-slate-400">Total Submissions Processed</p>
            <p className="text-3xl font-bold text-slate-900 font-mono mt-1">{stats.teacherStats.totalSubmissions}</p>
            <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Digital compliance
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <p className="text-xs font-semibold text-slate-400">Faculty Verified Certificates</p>
            <p className="text-3xl font-bold text-blue-600 font-mono mt-1">{stats.teacherStats.verifiedRecords}</p>
            <p className="text-xs text-slate-500 mt-2">Authenticated with digital seal</p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <p className="text-xs font-semibold text-slate-400">Average Points Earned / Student</p>
            <p className="text-3xl font-bold text-purple-600 font-mono mt-1">42.5</p>
            <p className="text-xs text-slate-500 mt-2">On track for 100-point AICTE goal</p>
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Department Activity Distribution</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Information Technology</span>
                <span>28 verified activities (85%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Computer Technology</span>
                <span>24 verified activities (78%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Electronics & Communication</span>
                <span>18 verified activities (65%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Mechanical Engineering</span>
                <span>15 verified activities (58%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-600 rounded-full" style={{ width: '58%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
