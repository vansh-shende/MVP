import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  FileCheck,
  PlusCircle,
  Download,
  Search,
  Filter,
  CalendarCheck,
  ShieldCheck,
  TrendingUp,
  FileText,
  Upload,
  X
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { AttendanceStatus, GrievanceType } from '../../types/attendance';

export const StudentAttendancePage: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    sessions,
    subjects,
    grievances,
    getStudentProfileAttendance,
    submitGrievance
  } = useAttendance();

  const studentId = currentUser?.id || 'std-103';
  const profile = getStudentProfileAttendance(studentId);

  // Filter state for session log
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'grievances'>('overview');

  // Grievance / Leave Modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [grievanceType, setGrievanceType] = useState<GrievanceType>('On Duty / Event');
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSubjectCodes, setSelectedSubjectCodes] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [proofFileName, setProofFileName] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Extract individual attendance session logs for this student
  const studentSessionLogs = sessions.map((sess) => {
    const studentRecord = sess.records.find((r) => r.studentId === studentId || r.studentRoll === profile.studentRoll);
    return {
      sessionId: sess.id,
      date: sess.date,
      timeSlot: sess.timeSlot,
      subjectCode: sess.subjectCode,
      subjectName: sess.subjectName,
      facultyName: sess.facultyName,
      topic: sess.topic,
      status: studentRecord ? studentRecord.status : ('Absent' as AttendanceStatus),
      remarks: studentRecord?.remarks
    };
  }).filter((log) => {
    if (selectedSubject !== 'All' && log.subjectCode !== selectedSubject) return false;
    if (selectedStatus !== 'All' && log.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchSub = log.subjectName.toLowerCase().includes(q) || log.subjectCode.toLowerCase().includes(q);
      const matchFac = log.facultyName.toLowerCase().includes(q);
      const matchDate = log.date.includes(q);
      const matchTopic = (log.topic || '').toLowerCase().includes(q);
      if (!matchSub && !matchFac && !matchDate && !matchTopic) return false;
    }
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Grievances for current student
  const myGrievances = grievances.filter(
    (g) => g.studentId === studentId || g.studentRoll === profile.studentRoll
  );

  const handleApplyLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    submitGrievance({
      studentId: profile.studentId,
      studentName: profile.studentName,
      studentRoll: profile.studentRoll,
      type: grievanceType,
      fromDate,
      toDate,
      subjectCodes: selectedSubjectCodes.length > 0 ? selectedSubjectCodes : subjects.map((s) => s.code),
      reason,
      proofFileName: proofFileName || (grievanceType === 'Medical Leave' ? 'Medical_Prescription.pdf' : 'Event_Duty_Letter.pdf')
    });

    setFormSuccess('Leave / Attendance regularisation request submitted successfully to Faculty In-charge!');
    setTimeout(() => {
      setFormSuccess('');
      setShowApplyModal(false);
      setReason('');
      setProofFileName('');
      setActiveTab('grievances');
    }, 1200);
  };

  const handleToggleSubjectCode = (code: string) => {
    if (selectedSubjectCodes.includes(code)) {
      setSelectedSubjectCodes(selectedSubjectCodes.filter((c) => c !== code));
    } else {
      setSelectedSubjectCodes([...selectedSubjectCodes, code]);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Date', 'Time Slot', 'Subject Code', 'Subject Name', 'Faculty', 'Topic', 'Status', 'Remarks'];
    const rows = studentSessionLogs.map((log) => [
      log.date,
      `"${log.timeSlot}"`,
      log.subjectCode,
      `"${log.subjectName}"`,
      `"${log.facultyName}"`,
      `"${log.topic || 'Class Lecture'}"`,
      log.status,
      `"${log.remarks || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_Report_${profile.studentRoll}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* HEADER */}
        <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-[#65758B] uppercase tracking-wider">
                STUDENT ATTENDANCE PORTAL
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF2F8] text-[#123B63]">
                Academic Year 2026–27
              </span>
            </div>
            <h1 className="text-[26px] sm:text-[28px] font-bold text-[#0B2945] mt-1">
              Attendance & Eligibility Status
            </h1>
            <p className="text-[14px] text-[#65758B] mt-0.5">
              Roll No: <span className="font-mono font-medium text-[#243447]">{profile.studentRoll}</span> • Department of {profile.branch} • {profile.year}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowApplyModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#123B63] text-white rounded-[5px] text-[14px] font-semibold hover:bg-[#0B2945] transition-colors shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Apply for Leave / Duty</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#D9E0E7] text-[#243447] rounded-[5px] text-[14px] font-medium hover:bg-[#F5F7F9] transition-colors cursor-pointer"
              title="Export attendance log as CSV"
            >
              <Download className="w-4 h-4 text-[#65758B]" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* TOP KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Overall Attendance */}
          <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-[#65758B]">Overall Attendance</span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  profile.status === 'Safe'
                    ? 'bg-[#EAF6EE] text-[#287A55]'
                    : profile.status === 'Caution'
                    ? 'bg-[#FEF7E6] text-[#A66A00]'
                    : 'bg-[#FDF2F2] text-[#B33A3A]'
                }`}
              >
                {profile.status === 'Safe' ? 'Eligible (≥75%)' : profile.status === 'Caution' ? 'Warning Zone' : 'Shortage Alert'}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <p
                className={`text-[32px] font-bold font-mono ${
                  profile.status === 'Safe'
                    ? 'text-[#287A55]'
                    : profile.status === 'Caution'
                    ? 'text-[#A66A00]'
                    : 'text-[#B33A3A]'
                }`}
              >
                {profile.percentage}%
              </p>
              <span className="text-[13px] text-[#65758B]">
                ({profile.attendedClasses}/{profile.totalClasses} classes)
              </span>
            </div>
            {/* Mini Progress Bar */}
            <div className="w-full bg-[#E5E9EE] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  profile.status === 'Safe' ? 'bg-[#287A55]' : profile.status === 'Caution' ? 'bg-[#A66A00]' : 'bg-[#B33A3A]'
                }`}
                style={{ width: `${Math.min(100, profile.percentage)}%` }}
              />
            </div>
          </div>

          {/* Classes Attended */}
          <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-4">
            <span className="text-[13px] font-medium text-[#65758B]">Lectures Attended</span>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-[32px] font-bold text-[#0B2945] font-mono">
                {profile.attendedClasses}
              </p>
              <span className="text-[13px] text-[#65758B]">of {profile.totalClasses} held</span>
            </div>
            <p className="text-[12px] text-[#287A55] mt-1.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Includes approved duty & labs
            </p>
          </div>

          {/* Shortage Risk */}
          <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-4">
            <span className="text-[13px] font-medium text-[#65758B]">Subjects At Risk (&lt;75%)</span>
            <div className="flex items-baseline gap-2 mt-2">
              <p
                className={`text-[32px] font-bold font-mono ${
                  profile.subjectSummaries.filter((s) => s.percentage < 75).length === 0
                    ? 'text-[#287A55]'
                    : 'text-[#B33A3A]'
                }`}
              >
                {profile.subjectSummaries.filter((s) => s.percentage < 75).length}
              </p>
              <span className="text-[13px] text-[#65758B]">of {profile.subjectSummaries.length} subjects</span>
            </div>
            <p className="text-[12px] text-[#65758B] mt-1.5">
              {profile.subjectSummaries.filter((s) => s.percentage < 75).length === 0
                ? 'All subjects meet university criteria'
                : 'Action required before exam cutoff'}
            </p>
          </div>

          {/* Leaves & Regularizations */}
          <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-4">
            <span className="text-[13px] font-medium text-[#65758B]">Grievances & Leaves</span>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-[32px] font-bold text-[#123B63] font-mono">
                {myGrievances.length}
              </p>
              <span className="text-[13px] text-[#65758B]">applications</span>
            </div>
            <p className="text-[12px] text-[#123B63] mt-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {myGrievances.filter((g) => g.status === 'Approved').length} approved by Faculty
            </p>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="bg-white rounded-[6px] border border-[#D9E0E7] px-3 pt-2">
          <div className="flex gap-2 border-b border-[#D9E0E7] overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 px-3 text-[14px] font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-[#123B63] text-[#123B63]'
                  : 'border-transparent text-[#65758B] hover:text-[#243447]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Subject-wise Breakdown ({profile.subjectSummaries.length})
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`pb-2.5 px-3 text-[14px] font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'sessions'
                  ? 'border-[#123B63] text-[#123B63]'
                  : 'border-transparent text-[#65758B] hover:text-[#243447]'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              Detailed Attendance Log ({studentSessionLogs.length})
            </button>
            <button
              onClick={() => setActiveTab('grievances')}
              className={`pb-2.5 px-3 text-[14px] font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'grievances'
                  ? 'border-[#123B63] text-[#123B63]'
                  : 'border-transparent text-[#65758B] hover:text-[#243447]'
              }`}
            >
              <FileText className="w-4 h-4" />
              My Leave & Grievance Requests ({myGrievances.length})
            </button>
          </div>
        </div>

        {/* TAB 1: SUBJECT-WISE OVERVIEW CARDS */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.subjectSummaries.map((subject) => {
                const isSafe = subject.percentage >= 75;
                const isCaution = subject.percentage >= 65 && subject.percentage < 75;

                return (
                  <div
                    key={subject.code}
                    className="bg-white rounded-[6px] border border-[#D9E0E7] p-4 flex flex-col justify-between hover:border-[#BAC7D5] transition-colors shadow-2xs"
                  >
                    <div>
                      {/* Top Code and Status */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[12px] font-bold px-2 py-0.5 rounded bg-[#F5F7F9] text-[#123B63] border border-[#D9E0E7]">
                          {subject.code}
                        </span>
                        <span
                          className={`text-[12px] font-bold px-2 py-0.5 rounded ${
                            isSafe
                              ? 'bg-[#EAF6EE] text-[#287A55]'
                              : isCaution
                              ? 'bg-[#FEF7E6] text-[#A66A00]'
                              : 'bg-[#FDF2F2] text-[#B33A3A]'
                          }`}
                        >
                          {subject.percentage}%
                        </span>
                      </div>

                      {/* Subject Name & Faculty */}
                      <h3 className="text-[16px] font-bold text-[#0B2945] mt-2.5 leading-snug line-clamp-2">
                        {subject.name}
                      </h3>
                      <p className="text-[13px] text-[#65758B] mt-1">
                        Instructor: <span className="font-medium text-[#243447]">{subject.facultyName}</span>
                      </p>

                      {/* Progress bar with 75% target mark */}
                      <div className="mt-4">
                        <div className="flex justify-between text-[12px] text-[#65758B] mb-1">
                          <span>Attended: <strong className="text-[#0B2945] font-mono">{subject.attendedClasses}</strong> / {subject.totalClasses}</span>
                          <span>Target: <strong className="text-[#0B2945]">75%</strong></span>
                        </div>
                        <div className="relative w-full bg-[#E5E9EE] h-2.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isSafe ? 'bg-[#287A55]' : isCaution ? 'bg-[#A66A00]' : 'bg-[#B33A3A]'
                            }`}
                            style={{ width: `${Math.min(100, subject.percentage)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer Insight Box */}
                    <div className="mt-4 pt-3 border-t border-[#F0F4F8] text-[12px]">
                      {isSafe ? (
                        <p className="text-[#287A55] font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Attendance requirement met (&ge; 75%)</span>
                        </p>
                      ) : (
                        <p className="text-[#B33A3A] font-medium flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>Must attend next <strong>{subject.classesNeededFor75}</strong> consecutive class(es) to reach 75%.</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: DETAILED SESSION LOG */}
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-3.5 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="relative min-w-[200px] w-full sm:w-auto">
                  <Search className="w-4 h-4 text-[#65758B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search lecture, topic, date..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-[#F5F7F9] border border-[#D9E0E7] rounded-[5px] focus:outline-none focus:border-[#123B63] focus:bg-white"
                  />
                </div>

                {/* Subject Filter */}
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-2.5 py-1.5 text-[13px] bg-[#F5F7F9] border border-[#D9E0E7] rounded-[5px] text-[#243447] focus:outline-none focus:border-[#123B63]"
                >
                  <option value="All">All Subjects</option>
                  {subjects.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-2.5 py-1.5 text-[13px] bg-[#F5F7F9] border border-[#D9E0E7] rounded-[5px] text-[#243447] focus:outline-none focus:border-[#123B63]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="Excused">Excused (Duty/Medical)</option>
                </select>
              </div>

              <div className="text-[13px] text-[#65758B] shrink-0">
                Showing <strong>{studentSessionLogs.length}</strong> recorded sessions
              </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-[6px] border border-[#D9E0E7] overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-[#F5F7F9] border-b border-[#D9E0E7] text-[#65758B] font-semibold uppercase text-[11px] tracking-wider">
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Subject & Code</th>
                      <th className="py-3 px-4">Faculty Instructor</th>
                      <th className="py-3 px-4">Topic / Session Details</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9EEF3]">
                    {studentSessionLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-[#65758B]">
                          No attendance sessions match the selected filter criteria.
                        </td>
                      </tr>
                    ) : (
                      studentSessionLogs.map((log) => (
                        <tr key={log.sessionId} className="hover:bg-[#F9FBFC] transition-colors">
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="font-semibold text-[#0B2945]">{log.date}</div>
                            <div className="text-[11px] text-[#65758B] font-mono">{log.timeSlot}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-[#0B2945]">{log.subjectName}</div>
                            <div className="text-[11px] font-mono text-[#123B63]">{log.subjectCode}</div>
                          </td>
                          <td className="py-3 px-4 text-[#243447] whitespace-nowrap">
                            {log.facultyName}
                          </td>
                          <td className="py-3 px-4 text-[#65758B] max-w-xs truncate">
                            {log.topic || 'Class Lecture & Problem Solving'}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {log.status === 'Present' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF6EE] text-[#287A55]">
                                <CheckCircle2 className="w-3 h-3" /> Present
                              </span>
                            )}
                            {log.status === 'Absent' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FDF2F2] text-[#B33A3A]">
                                <XCircle className="w-3 h-3" /> Absent
                              </span>
                            )}
                            {log.status === 'Late' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF7E6] text-[#A66A00]">
                                <Clock className="w-3 h-3" /> Late
                              </span>
                            )}
                            {log.status === 'Excused' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF2F8] text-[#123B63]">
                                <ShieldCheck className="w-3 h-3" /> Excused (Duty)
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-[12px] text-[#65758B]">
                            {log.remarks || '—'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LEAVE & GRIEVANCE APPLICATIONS */}
        {activeTab === 'grievances' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-[#0B2945]">My Leave & Regularization History</h2>
                <p className="text-[13px] text-[#65758B]">Track official reviews, On-Duty letters and medical leaves</p>
              </div>
              <button
                onClick={() => setShowApplyModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#123B63] text-white rounded-[5px] text-[13px] font-semibold hover:bg-[#0B2945] cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Submit New Request
              </button>
            </div>

            {myGrievances.length === 0 ? (
              <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-8 text-center text-[#65758B]">
                No leave or attendance regularisation requests submitted yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {myGrievances.map((item) => (
                  <div key={item.id} className="bg-white rounded-[6px] border border-[#D9E0E7] p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0F4F8]">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#0B2945] text-[15px]">{item.type}</span>
                        <span className="text-[12px] text-[#65758B]">
                          ({item.fromDate === item.toDate ? item.fromDate : `${item.fromDate} to ${item.toDate}`})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-[#65758B]">Submitted on {item.submittedAt}</span>
                        <span
                          className={`text-[12px] font-bold px-2.5 py-0.5 rounded-full ${
                            item.status === 'Approved'
                              ? 'bg-[#EAF6EE] text-[#287A55]'
                              : item.status === 'Rejected'
                              ? 'bg-[#FDF2F2] text-[#B33A3A]'
                              : 'bg-[#FEF7E6] text-[#A66A00]'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 text-[13px] space-y-2">
                      <p className="text-[#243447]">
                        <strong>Reason / Justification:</strong> {item.reason}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#65758B]">
                        <span>Applicable Subjects: <strong className="text-[#123B63]">{item.subjectCodes.join(', ')}</strong></span>
                        {item.proofFileName && (
                          <span className="inline-flex items-center gap-1 text-[#123B63] bg-[#EAF2F8] px-2 py-0.5 rounded font-mono">
                            <FileCheck className="w-3.5 h-3.5" />
                            {item.proofFileName}
                          </span>
                        )}
                      </div>

                      {item.facultyRemarks && (
                        <div className="mt-2.5 p-2.5 bg-[#F5F7F9] rounded-[4px] border-l-2 border-[#123B63] text-[12px]">
                          <strong className="text-[#0B2945]">Faculty Review ({item.reviewedBy || 'Reviewer'}):</strong>{' '}
                          <span className="text-[#243447]">{item.facultyRemarks}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* APPLY LEAVE / GRIEVANCE MODAL */}
        {showApplyModal && (
          <div className="fixed inset-0 bg-[#0B2945]/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[8px] border border-[#D9E0E7] shadow-xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="px-5 py-4 border-b border-[#D9E0E7] flex items-center justify-between bg-[#F5F7F9]">
                <div>
                  <h3 className="text-[17px] font-bold text-[#0B2945]">Apply for Leave / Attendance Regularization</h3>
                  <p className="text-[12px] text-[#65758B]">Submit formal application with supporting documentation</p>
                </div>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="p-1.5 text-[#65758B] hover:text-[#0B2945] rounded hover:bg-[#E9EEF3] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleApplyLeaveSubmit} className="p-5 overflow-y-auto space-y-4">
                {formSuccess && (
                  <div className="p-3 bg-[#EAF6EE] text-[#287A55] border border-[#BEDECB] rounded text-[13px] font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{formSuccess}</span>
                  </div>
                )}

                {/* Leave Type */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#243447] mb-1">
                    Application Type *
                  </label>
                  <select
                    value={grievanceType}
                    onChange={(e) => setGrievanceType(e.target.value as GrievanceType)}
                    className="w-full px-3 py-2 text-[13px] border border-[#D9E0E7] rounded-[5px] focus:outline-none focus:border-[#123B63]"
                    required
                  >
                    <option value="On Duty / Event">On Duty (Hackathon / Seminar / Sports / Cultural Representation)</option>
                    <option value="Medical Leave">Medical Leave (Illness / Hospitalization)</option>
                    <option value="Attendance Correction">Attendance Discrepancy / Correction</option>
                    <option value="Personal">Personal Leave / Family Emergency</option>
                  </select>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#243447] mb-1">From Date *</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full px-3 py-2 text-[13px] border border-[#D9E0E7] rounded-[5px] focus:outline-none focus:border-[#123B63]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#243447] mb-1">To Date *</label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full px-3 py-2 text-[13px] border border-[#D9E0E7] rounded-[5px] focus:outline-none focus:border-[#123B63]"
                      required
                    />
                  </div>
                </div>

                {/* Affected Subjects */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#243447] mb-1">
                    Affected Subjects (leave empty to apply to all)
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {subjects.map((subj) => (
                      <label
                        key={subj.code}
                        className={`flex items-center gap-2 p-2 rounded border text-[12px] cursor-pointer transition-colors ${
                          selectedSubjectCodes.includes(subj.code)
                            ? 'bg-[#EAF2F8] border-[#123B63] text-[#123B63] font-semibold'
                            : 'bg-[#F9FBFC] border-[#D9E0E7] text-[#243447]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSubjectCodes.includes(subj.code)}
                          onChange={() => handleToggleSubjectCode(subj.code)}
                          className="rounded text-[#123B63]"
                        />
                        <span className="truncate">{subj.code} - {subj.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#243447] mb-1">
                    Detailed Reason & Explanation *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide specific details of the event, illness or reason for absence..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] border border-[#D9E0E7] rounded-[5px] focus:outline-none focus:border-[#123B63]"
                    required
                  />
                </div>

                {/* Upload Proof */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#243447] mb-1">
                    Supporting Document / Certificate Proof
                  </label>
                  <div className="border border-dashed border-[#D9E0E7] rounded-[5px] p-3 text-center bg-[#F9FBFC]">
                    <Upload className="w-5 h-5 text-[#65758B] mx-auto mb-1" />
                    <input
                      type="file"
                      id="proof-upload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setProofFileName(file.name);
                      }}
                    />
                    <label
                      htmlFor="proof-upload"
                      className="text-[12px] text-[#123B63] font-semibold hover:underline cursor-pointer"
                    >
                      {proofFileName ? `Selected: ${proofFileName}` : 'Choose File (PDF, PNG, JPG)'}
                    </label>
                    <p className="text-[11px] text-[#65758B] mt-0.5">Medical prescription, event invite, or on-duty sign-off</p>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-[#D9E0E7] flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2 text-[13px] text-[#65758B] hover:text-[#243447] font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#123B63] text-white rounded-[5px] text-[13px] font-semibold hover:bg-[#0B2945] transition-colors cursor-pointer shadow-sm"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
