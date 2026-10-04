import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Users,
  Search,
  Download,
  Filter,
  Save,
  PlusCircle,
  FileText,
  Eye,
  Check,
  X,
  Mail,
  Edit,
  Trash2,
  FileSpreadsheet,
  ArrowUpDown
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { DEMO_STUDENTS_LIST } from '../../data/mockData';
import { AttendanceStatus, GrievanceStatus, StudentAttendanceProfile } from '../../types/attendance';

export const TeacherAttendancePage: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    sessions,
    subjects,
    grievances,
    markSessionAttendance,
    updateSessionAttendance,
    deleteSession,
    reviewGrievance,
    getAllStudentsAttendanceSummary,
    getStudentProfileAttendance
  } = useAttendance();

  const [activeTab, setActiveTab] = useState<'mark' | 'roster' | 'grievances' | 'history'>('mark');

  // Mark Attendance Form State
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>(subjects[0]?.code || 'IT501');
  const [selectedBranch, setSelectedBranch] = useState<string>('Information Technology');
  const [selectedYear, setSelectedYear] = useState<string>('3rd Year');
  const [sessionDate, setSessionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [sessionTimeSlot, setSessionTimeSlot] = useState<string>('10:00 AM - 11:00 AM');
  const [sessionTopic, setSessionTopic] = useState<string>('');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string>('');

  // Per-student attendance marking state in the "Mark Attendance" tab
  const [attendanceSheet, setAttendanceSheet] = useState<
    Record<string, { status: AttendanceStatus; remarks: string }>
  >(() => {
    const initial: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    DEMO_STUDENTS_LIST.forEach((student) => {
      initial[student.id] = { status: 'Present', remarks: '' };
    });
    return initial;
  });

  // Selected student for detailed drilldown modal in Roster tab
  const [selectedStudentDrilldown, setSelectedStudentDrilldown] = useState<StudentAttendanceProfile | null>(null);

  // Filter & Search states for Roster tab
  const [rosterSearch, setRosterSearch] = useState('');
  const [rosterStatusFilter, setRosterStatusFilter] = useState<'All' | 'Safe' | 'Caution' | 'Critical'>('All');

  // Grievance review modal / state
  const [reviewRemarks, setReviewRemarks] = useState<Record<string, string>>({});
  const [noticeSentMessage, setNoticeSentMessage] = useState<string>('');

  // Roster summary for all students
  const allStudentsAttendance = getAllStudentsAttendanceSummary();

  // Metrics
  const totalConductedSessions = sessions.length;
  const defaulterStudents = allStudentsAttendance.filter((s) => s.percentage < 75);
  const pendingGrievances = grievances.filter((g) => g.status === 'Pending');

  const averageAttendancePercentage =
    allStudentsAttendance.length > 0
      ? Math.round(
          (allStudentsAttendance.reduce((sum, s) => sum + s.percentage, 0) / allStudentsAttendance.length) * 10
        ) / 10
      : 0;

  // Selected Subject Details
  const currentSubjectObj = subjects.find((s) => s.code === selectedSubjectCode) || subjects[0];

  // Quick Action: Mark All Present
  const handleMarkAllPresent = () => {
    const updated: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    DEMO_STUDENTS_LIST.forEach((student) => {
      updated[student.id] = { status: 'Present', remarks: '' };
    });
    setAttendanceSheet(updated);
  };

  // Quick Action: Mark All Absent
  const handleMarkAllAbsent = () => {
    const updated: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    DEMO_STUDENTS_LIST.forEach((student) => {
      updated[student.id] = { status: 'Absent', remarks: '' };
    });
    setAttendanceSheet(updated);
  };

  // Change individual student attendance status
  const handleStudentStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceSheet((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  // Change individual student remarks
  const handleStudentRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceSheet((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { status: 'Present', remarks: '' }),
        remarks
      }
    }));
  };

  // Submit and Save attendance session
  const handleSubmitAttendance = (e: React.FormEvent) => {
    e.preventDefault();

    const records = DEMO_STUDENTS_LIST.map((student) => ({
      studentId: student.id,
      studentRoll: student.roll,
      studentName: student.name,
      status: attendanceSheet[student.id]?.status || 'Present',
      remarks: attendanceSheet[student.id]?.remarks || undefined
    }));

    markSessionAttendance({
      date: sessionDate,
      timeSlot: sessionTimeSlot,
      subjectCode: currentSubjectObj.code,
      subjectName: currentSubjectObj.name,
      branch: selectedBranch,
      year: selectedYear,
      facultyId: currentUser?.id || 'fac-202',
      facultyName: currentUser?.name || 'Mrs. Harshita Jain',
      topic: sessionTopic || `Lecture on ${currentSubjectObj.name}`,
      records
    });

    setSaveSuccessMessage(
      `Attendance successfully recorded for ${currentSubjectObj.code} (${sessionDate}, ${sessionTimeSlot})!`
    );

    setTimeout(() => {
      setSaveSuccessMessage('');
      setActiveTab('history');
    }, 1500);
  };

  // Send Notice to Defaulters Simulation
  const handleSendDefaulterNotice = (studentName: string) => {
    setNoticeSentMessage(`Official attendance shortage warning notice emailed to ${studentName} & Department HOD.`);
    setTimeout(() => {
      setNoticeSentMessage('');
    }, 3000);
  };

  // Export Roster CSV
  const handleExportRosterCSV = () => {
    const headers = ['Roll No', 'Student Name', 'Branch', 'Year', 'Overall Attendance %', 'Status', 'Classes Attended', 'Total Held'];
    const rows = allStudentsAttendance.map((s) => [
      s.studentRoll,
      `"${s.studentName}"`,
      `"${s.branch}"`,
      `"${s.year}"`,
      `${s.percentage}%`,
      s.status,
      s.attendedClasses,
      s.totalClasses
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Department_Attendance_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Roster List
  const filteredRoster = allStudentsAttendance.filter((s) => {
    if (rosterStatusFilter !== 'All' && s.status !== rosterStatusFilter) return false;
    if (rosterSearch) {
      const q = rosterSearch.toLowerCase();
      return s.studentName.toLowerCase().includes(q) || s.studentRoll.toLowerCase().includes(q) || s.branch.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* FACULTY ATTENDANCE HEADER */}
        <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-[#65758B] uppercase tracking-wider">
                FACULTY ATTENDANCE PORTAL
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF6EE] text-[#287A55]">
                Academic Year 2026–27
              </span>
            </div>
            <h1 className="text-[26px] sm:text-[28px] font-bold text-[#0B2945] mt-1">
              Attendance Management & Verification
            </h1>
            <p className="text-[14px] text-[#65758B] mt-0.5">
              Faculty: <span className="font-semibold text-[#243447]">{currentUser?.name || 'Mrs. Harshita Jain'}</span> • Department of Information Technology
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('mark')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#123B63] text-white rounded-[5px] text-[14px] font-semibold hover:bg-[#0B2945] transition-colors shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record New Session</span>
            </button>
            <button
              onClick={handleExportRosterCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#D9E0E7] text-[#243447] rounded-[5px] text-[14px] font-medium hover:bg-[#F5F7F9] transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#65758B]" />
              <span className="hidden sm:inline">Export Roster</span>
            </button>
          </div>
        </div>

        {/* TOP METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Average Class Attendance */}
          <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-4">
            <span className="text-[13px] font-medium text-[#65758B]">Average Dept. Attendance</span>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-[32px] font-bold text-[#0B2945] font-mono">
                {averageAttendancePercentage}%
              </p>
              <span className="text-[13px] text-[#287A55] font-medium">Aggregate</span>
            </div>
            <p className="text-[12px] text-[#65758B] mt-1.5">Across 10 enrolled students</p>
          </div>

          {/* Sessions Conducted */}
          <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-4">
            <span className="text-[13px] font-medium text-[#65758B]">Total Sessions Conducted</span>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-[32px] font-bold text-[#123B63] font-mono">
                {totalConductedSessions}
              </p>
              <span className="text-[13px] text-[#65758B]">lectures recorded</span>
            </div>
            <p className="text-[12px] text-[#65758B] mt-1.5">Includes theory & lab practicals</p>
          </div>

          {/* Defaulter / Shortage Alert */}
          <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-4">
            <span className="text-[13px] font-medium text-[#65758B]">Shortage / Defaulters (&lt;75%)</span>
            <div className="flex items-baseline gap-2 mt-2">
              <p
                className={`text-[32px] font-bold font-mono ${
                  defaulterStudents.length > 0 ? 'text-[#B33A3A]' : 'text-[#287A55]'
                }`}
              >
                {defaulterStudents.length}
              </p>
              <span className="text-[13px] text-[#65758B]">students flagged</span>
            </div>
            <p className="text-[12px] text-[#B33A3A] mt-1.5 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Requires parents notification
            </p>
          </div>

          {/* Pending Grievances */}
          <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-4">
            <span className="text-[13px] font-medium text-[#65758B]">Leave & Duty Requests</span>
            <div className="flex items-baseline gap-2 mt-2">
              <p
                className={`text-[32px] font-bold font-mono ${
                  pendingGrievances.length > 0 ? 'text-[#A66A00]' : 'text-[#287A55]'
                }`}
              >
                {pendingGrievances.length}
              </p>
              <span className="text-[13px] text-[#65758B]">pending review</span>
            </div>
            <p className="text-[12px] text-[#A66A00] mt-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {grievances.length} total applications
            </p>
          </div>
        </div>

        {/* NOTIFICATION BANNER IF ACTION TAKEN */}
        {noticeSentMessage && (
          <div className="bg-[#EAF6EE] border border-[#BEDECB] text-[#287A55] p-3 rounded-[6px] text-[13px] font-medium flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{noticeSentMessage}</span>
          </div>
        )}

        {/* NAVIGATION TABS */}
        <div className="bg-white rounded-[6px] border border-[#D9E0E7] px-3 pt-2">
          <div className="flex gap-2 border-b border-[#D9E0E7] overflow-x-auto">
            <button
              onClick={() => setActiveTab('mark')}
              className={`pb-2.5 px-3 text-[14px] font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'mark'
                  ? 'border-[#123B63] text-[#123B63]'
                  : 'border-transparent text-[#65758B] hover:text-[#243447]'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Take / Mark Attendance
            </button>
            <button
              onClick={() => setActiveTab('roster')}
              className={`pb-2.5 px-3 text-[14px] font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'roster'
                  ? 'border-[#123B63] text-[#123B63]'
                  : 'border-transparent text-[#65758B] hover:text-[#243447]'
              }`}
            >
              <Users className="w-4 h-4" />
              Student Attendance Roster ({allStudentsAttendance.length})
            </button>
            <button
              onClick={() => setActiveTab('grievances')}
              className={`pb-2.5 px-3 text-[14px] font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'grievances'
                  ? 'border-[#123B63] text-[#123B63]'
                  : 'border-transparent text-[#65758B] hover:text-[#243447]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Leave & Grievance Approvals {pendingGrievances.length > 0 && (
                <span className="bg-[#A66A00] text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                  {pendingGrievances.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-2.5 px-3 text-[14px] font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'history'
                  ? 'border-[#123B63] text-[#123B63]'
                  : 'border-transparent text-[#65758B] hover:text-[#243447]'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Sessions History Log ({sessions.length})
            </button>
          </div>
        </div>

        {/* TAB 1: TAKE / MARK ATTENDANCE */}
        {activeTab === 'mark' && (
          <form onSubmit={handleSubmitAttendance} className="space-y-4">
            {/* Session Parameters Configuration Bar */}
            <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-4 space-y-4">
              <h2 className="text-[16px] font-bold text-[#0B2945] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#123B63]" />
                Session Details & Parameters
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Subject Selector */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#243447] mb-1">
                    Subject / Course *
                  </label>
                  <select
                    value={selectedSubjectCode}
                    onChange={(e) => setSelectedSubjectCode(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] border border-[#D9E0E7] rounded-[5px] focus:outline-none focus:border-[#123B63] bg-[#F5F7F9]"
                  >
                    {subjects.map((subj) => (
                      <option key={subj.code} value={subj.code}>
                        {subj.code} - {subj.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#243447] mb-1">
                    Lecture Date *
                  </label>
                  <input
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] border border-[#D9E0E7] rounded-[5px] focus:outline-none focus:border-[#123B63] bg-[#F5F7F9]"
                    required
                  />
                </div>

                {/* Time Slot */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#243447] mb-1">
                    Time Slot / Hour *
                  </label>
                  <select
                    value={sessionTimeSlot}
                    onChange={(e) => setSessionTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] border border-[#D9E0E7] rounded-[5px] focus:outline-none focus:border-[#123B63] bg-[#F5F7F9]"
                  >
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM (Hour 1)</option>
                    <option value="11:15 AM - 12:15 PM">11:15 AM - 12:15 PM (Hour 2)</option>
                    <option value="01:00 PM - 02:00 PM">01:00 PM - 02:00 PM (Hour 3)</option>
                    <option value="02:15 PM - 03:15 PM">02:15 PM - 03:15 PM (Hour 4)</option>
                    <option value="03:30 PM - 05:00 PM">03:30 PM - 05:00 PM (Lab Session)</option>
                  </select>
                </div>

                {/* Topic */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#243447] mb-1">
                    Topic / Lecture Unit
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Unit 3: Indexing & B-Trees"
                    value={sessionTopic}
                    onChange={(e) => setSessionTopic(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] border border-[#D9E0E7] rounded-[5px] focus:outline-none focus:border-[#123B63] bg-[#F5F7F9]"
                  />
                </div>
              </div>
            </div>

            {/* Attendance Marking Student List */}
            <div className="bg-white rounded-[6px] border border-[#D9E0E7] overflow-hidden shadow-2xs">
              {/* Table Action Bar */}
              <div className="px-4 py-3 bg-[#F5F7F9] border-b border-[#D9E0E7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-bold text-[#0B2945]">Student Roster (10 Students)</h3>
                  <span className="text-[12px] text-[#65758B]">
                    Present:{' '}
                    <strong className="text-[#287A55]">
                      {Object.values(attendanceSheet).filter((s) => s.status === 'Present').length}
                    </strong>{' '}
                    | Absent:{' '}
                    <strong className="text-[#B33A3A]">
                      {Object.values(attendanceSheet).filter((s) => s.status === 'Absent').length}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleMarkAllPresent}
                    className="px-2.5 py-1 text-[12px] font-semibold bg-[#EAF6EE] text-[#287A55] border border-[#BEDECB] rounded hover:bg-[#D4EDDA] cursor-pointer"
                  >
                    Mark All Present
                  </button>
                  <button
                    type="button"
                    onClick={handleMarkAllAbsent}
                    className="px-2.5 py-1 text-[12px] font-semibold bg-[#FDF2F2] text-[#B33A3A] border border-[#F5C2C7] rounded hover:bg-[#F8D7DA] cursor-pointer"
                  >
                    Mark All Absent
                  </button>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="border-b border-[#D9E0E7] text-[#65758B] font-semibold uppercase text-[11px] tracking-wider bg-white">
                      <th className="py-3 px-4">Roll No</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Branch & Year</th>
                      <th className="py-3 px-4">Current %</th>
                      <th className="py-3 px-4">Status Selection</th>
                      <th className="py-3 px-4">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9EEF3]">
                    {DEMO_STUDENTS_LIST.map((student) => {
                      const studentProf = getStudentProfileAttendance(student.id);
                      const currentStatus = attendanceSheet[student.id]?.status || 'Present';
                      const currentRemarks = attendanceSheet[student.id]?.remarks || '';

                      return (
                        <tr key={student.id} className="hover:bg-[#F9FBFC] transition-colors">
                          <td className="py-3 px-4 font-mono font-semibold text-[#123B63]">
                            {student.roll}
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#0B2945]">
                            {student.name}
                          </td>
                          <td className="py-3 px-4 text-[#65758B] text-[12px]">
                            {student.branch} ({student.year})
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`text-[12px] font-bold px-2 py-0.5 rounded font-mono ${
                                studentProf.percentage >= 75
                                  ? 'bg-[#EAF6EE] text-[#287A55]'
                                  : studentProf.percentage >= 65
                                  ? 'bg-[#FEF7E6] text-[#A66A00]'
                                  : 'bg-[#FDF2F2] text-[#B33A3A]'
                              }`}
                            >
                              {studentProf.percentage}%
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="inline-flex items-center p-0.5 bg-[#F0F4F8] rounded-[5px] border border-[#D9E0E7]">
                              {/* Present */}
                              <button
                                type="button"
                                onClick={() => handleStudentStatusChange(student.id, 'Present')}
                                className={`px-2.5 py-1 text-[11px] font-bold rounded-[3px] transition-colors cursor-pointer ${
                                  currentStatus === 'Present'
                                    ? 'bg-[#287A55] text-white shadow-2xs'
                                    : 'text-[#65758B] hover:text-[#0B2945]'
                                }`}
                              >
                                Present
                              </button>
                              {/* Absent */}
                              <button
                                type="button"
                                onClick={() => handleStudentStatusChange(student.id, 'Absent')}
                                className={`px-2.5 py-1 text-[11px] font-bold rounded-[3px] transition-colors cursor-pointer ${
                                  currentStatus === 'Absent'
                                    ? 'bg-[#B33A3A] text-white shadow-2xs'
                                    : 'text-[#65758B] hover:text-[#0B2945]'
                                }`}
                              >
                                Absent
                              </button>
                              {/* Late */}
                              <button
                                type="button"
                                onClick={() => handleStudentStatusChange(student.id, 'Late')}
                                className={`px-2.5 py-1 text-[11px] font-bold rounded-[3px] transition-colors cursor-pointer ${
                                  currentStatus === 'Late'
                                    ? 'bg-[#A66A00] text-white shadow-2xs'
                                    : 'text-[#65758B] hover:text-[#0B2945]'
                                }`}
                              >
                                Late
                              </button>
                              {/* Excused */}
                              <button
                                type="button"
                                onClick={() => handleStudentStatusChange(student.id, 'Excused')}
                                className={`px-2.5 py-1 text-[11px] font-bold rounded-[3px] transition-colors cursor-pointer ${
                                  currentStatus === 'Excused'
                                    ? 'bg-[#123B63] text-white shadow-2xs'
                                    : 'text-[#65758B] hover:text-[#0B2945]'
                                }`}
                              >
                                Excused
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              placeholder="Optional remarks"
                              value={currentRemarks}
                              onChange={(e) => handleStudentRemarksChange(student.id, e.target.value)}
                              className="w-full px-2 py-1 text-[12px] bg-[#F5F7F9] border border-[#D9E0E7] rounded focus:outline-none focus:border-[#123B63] focus:bg-white"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Bottom Submit Bar */}
              <div className="p-4 bg-[#F5F7F9] border-t border-[#D9E0E7] flex flex-col sm:flex-row items-center justify-between gap-3">
                {saveSuccessMessage ? (
                  <div className="text-[13px] font-semibold text-[#287A55] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{saveSuccessMessage}</span>
                  </div>
                ) : (
                  <p className="text-[12px] text-[#65758B]">
                    Clicking save will record this session and instantly recalculate all student analytics.
                  </p>
                )}

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#123B63] text-white rounded-[5px] text-[14px] font-semibold hover:bg-[#0B2945] transition-colors shadow-sm cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Submit Attendance</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: STUDENT ATTENDANCE ROSTER & DEFAULTERS */}
        {activeTab === 'roster' && (
          <div className="space-y-4">
            {/* Filter & Search Controls */}
            <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-3.5 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="relative min-w-[220px] w-full sm:w-auto">
                  <Search className="w-4 h-4 text-[#65758B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search student name, roll..."
                    value={rosterSearch}
                    onChange={(e) => setRosterSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-[#F5F7F9] border border-[#D9E0E7] rounded-[5px] focus:outline-none focus:border-[#123B63] focus:bg-white"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={rosterStatusFilter}
                  onChange={(e) => setRosterStatusFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 text-[13px] bg-[#F5F7F9] border border-[#D9E0E7] rounded-[5px] text-[#243447] focus:outline-none focus:border-[#123B63]"
                >
                  <option value="All">All Eligibility Statuses</option>
                  <option value="Safe">Safe (&ge; 75%)</option>
                  <option value="Caution">Warning (65% - 74%)</option>
                  <option value="Critical">Defaulter (&lt; 65%)</option>
                </select>
              </div>

              <div className="text-[13px] text-[#65758B] shrink-0">
                Showing <strong>{filteredRoster.length}</strong> students
              </div>
            </div>

            {/* Roster Table */}
            <div className="bg-white rounded-[6px] border border-[#D9E0E7] overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-[#F5F7F9] border-b border-[#D9E0E7] text-[#65758B] font-semibold uppercase text-[11px] tracking-wider">
                      <th className="py-3 px-4">Roll No</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Branch & Year</th>
                      <th className="py-3 px-4">Classes (Attended / Held)</th>
                      <th className="py-3 px-4">Overall %</th>
                      <th className="py-3 px-4">Eligibility Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9EEF3]">
                    {filteredRoster.map((student) => {
                      const isDefaulter = student.percentage < 75;

                      return (
                        <tr key={student.studentId} className="hover:bg-[#F9FBFC] transition-colors">
                          <td className="py-3 px-4 font-mono font-semibold text-[#123B63]">
                            {student.studentRoll}
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#0B2945]">
                            {student.studentName}
                          </td>
                          <td className="py-3 px-4 text-[#65758B] text-[12px]">
                            {student.branch} ({student.year})
                          </td>
                          <td className="py-3 px-4 font-mono text-[#243447]">
                            {student.attendedClasses} / {student.totalClasses}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`text-[13px] font-bold px-2 py-0.5 rounded font-mono ${
                                student.percentage >= 75
                                  ? 'bg-[#EAF6EE] text-[#287A55]'
                                  : student.percentage >= 65
                                  ? 'bg-[#FEF7E6] text-[#A66A00]'
                                  : 'bg-[#FDF2F2] text-[#B33A3A]'
                              }`}
                            >
                              {student.percentage}%
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {student.status === 'Safe' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#287A55] bg-[#EAF6EE] px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" /> Eligible for Exams
                              </span>
                            )}
                            {student.status === 'Caution' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#A66A00] bg-[#FEF7E6] px-2 py-0.5 rounded-full">
                                <AlertTriangle className="w-3 h-3" /> Caution Zone
                              </span>
                            )}
                            {student.status === 'Critical' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B33A3A] bg-[#FDF2F2] px-2 py-0.5 rounded-full">
                                <XCircle className="w-3 h-3" /> Shortage Notice
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                            <button
                              onClick={() => setSelectedStudentDrilldown(student)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[12px] font-semibold text-[#123B63] bg-[#EAF2F8] rounded hover:bg-[#D4E4F2] cursor-pointer"
                              title="View Subject Breakdown"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Details</span>
                            </button>
                            {isDefaulter && (
                              <button
                                onClick={() => handleSendDefaulterNotice(student.studentName)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[12px] font-semibold text-[#B33A3A] bg-[#FDF2F2] border border-[#F5C2C7] rounded hover:bg-[#F8D7DA] cursor-pointer"
                                title="Send Shortage Notice"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span>Notice</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LEAVE & GRIEVANCE APPROVALS */}
        {activeTab === 'grievances' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-[18px] font-bold text-[#0B2945]">Student Leave & Regularization Review</h2>
              <p className="text-[13px] text-[#65758B]">Review and authenticate medical certificates, sports, and on-duty participation letters</p>
            </div>

            {grievances.length === 0 ? (
              <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-8 text-center text-[#65758B]">
                No pending or past leave requests found.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {grievances.map((item) => {
                  const currentRemarkText = reviewRemarks[item.id] !== undefined ? reviewRemarks[item.id] : (item.facultyRemarks || '');

                  return (
                    <div key={item.id} className="bg-white rounded-[6px] border border-[#D9E0E7] p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0F4F8]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#0B2945] text-[15px]">{item.studentName}</span>
                            <span className="font-mono text-[12px] text-[#123B63] px-2 py-0.5 bg-[#EAF2F8] rounded font-semibold">
                              {item.studentRoll}
                            </span>
                            <span className="text-[12px] font-semibold px-2 py-0.5 bg-[#F5F7F9] text-[#243447] rounded border border-[#D9E0E7]">
                              {item.type}
                            </span>
                          </div>
                          <p className="text-[12px] text-[#65758B] mt-0.5">
                            Period: <strong className="text-[#243447]">{item.fromDate === item.toDate ? item.fromDate : `${item.fromDate} to ${item.toDate}`}</strong> • Submitted on {item.submittedAt}
                          </p>
                        </div>

                        <span
                          className={`text-[12px] font-bold px-2.5 py-0.5 rounded-full self-start sm:self-auto ${
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

                      {/* Reason & Details */}
                      <div className="text-[13px] space-y-2">
                        <p className="text-[#243447]">
                          <strong>Student Justification:</strong> {item.reason}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-[12px]">
                          <span className="text-[#65758B]">
                            Applicable Subjects: <strong className="text-[#123B63]">{item.subjectCodes.join(', ')}</strong>
                          </span>
                          {item.proofFileName && (
                            <span className="inline-flex items-center gap-1 text-[#123B63] bg-[#EAF2F8] px-2 py-0.5 rounded font-mono font-medium">
                              <FileText className="w-3.5 h-3.5" />
                              {item.proofFileName}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Review Actions Bar */}
                      <div className="pt-3 border-t border-[#F0F4F8] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        <input
                          type="text"
                          placeholder="Faculty endorsement / review remark..."
                          value={currentRemarkText}
                          onChange={(e) => setReviewRemarks({ ...reviewRemarks, [item.id]: e.target.value })}
                          className="flex-1 px-3 py-1.5 text-[12px] bg-[#F5F7F9] border border-[#D9E0E7] rounded focus:outline-none focus:border-[#123B63]"
                        />

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              reviewGrievance(
                                item.id,
                                'Approved',
                                currentRemarkText || 'Request verified and on-duty attendance regularized.',
                                currentUser?.name || 'Mrs. Harshita Jain'
                              )
                            }
                            className={`px-3 py-1.5 text-[12px] font-semibold rounded flex items-center gap-1 cursor-pointer transition-colors ${
                              item.status === 'Approved'
                                ? 'bg-[#287A55] text-white'
                                : 'bg-[#EAF6EE] text-[#287A55] hover:bg-[#D4EDDA] border border-[#BEDECB]'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{item.status === 'Approved' ? 'Approved' : 'Approve & Excuse'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              reviewGrievance(
                                item.id,
                                'Rejected',
                                currentRemarkText || 'Insufficient documentary justification.',
                                currentUser?.name || 'Mrs. Harshita Jain'
                              )
                            }
                            className={`px-3 py-1.5 text-[12px] font-semibold rounded flex items-center gap-1 cursor-pointer transition-colors ${
                              item.status === 'Rejected'
                                ? 'bg-[#B33A3A] text-white'
                                : 'bg-[#FDF2F2] text-[#B33A3A] hover:bg-[#F8D7DA] border border-[#F5C2C7]'
                            }`}
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>{item.status === 'Rejected' ? 'Rejected' : 'Reject'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CONDUCTED SESSIONS HISTORY LOG */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-[#0B2945]">Conducted Lectures & Labs History</h2>
                <p className="text-[13px] text-[#65758B]">Complete log of sessions recorded in the system</p>
              </div>
              <button
                onClick={() => setActiveTab('mark')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#123B63] text-white rounded-[5px] text-[13px] font-semibold hover:bg-[#0B2945] cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Take Attendance</span>
              </button>
            </div>

            <div className="bg-white rounded-[6px] border border-[#D9E0E7] overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-[#F5F7F9] border-b border-[#D9E0E7] text-[#65758B] font-semibold uppercase text-[11px] tracking-wider">
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Subject & Code</th>
                      <th className="py-3 px-4">Instructor</th>
                      <th className="py-3 px-4">Topic Covered</th>
                      <th className="py-3 px-4">Attendance Ratio</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9EEF3]">
                    {sessions
                      .slice()
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((sess) => {
                        const presentCount = sess.records.filter(
                          (r) => r.status === 'Present' || r.status === 'Excused' || r.status === 'Late'
                        ).length;
                        const total = sess.records.length;
                        const pct = total > 0 ? Math.round((presentCount / total) * 100) : 0;

                        return (
                          <tr key={sess.id} className="hover:bg-[#F9FBFC] transition-colors">
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="font-semibold text-[#0B2945]">{sess.date}</div>
                              <div className="text-[11px] text-[#65758B] font-mono">{sess.timeSlot}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-[#0B2945]">{sess.subjectName}</div>
                              <div className="text-[11px] font-mono text-[#123B63]">{sess.subjectCode}</div>
                            </td>
                            <td className="py-3 px-4 text-[#243447] whitespace-nowrap">
                              {sess.facultyName}
                            </td>
                            <td className="py-3 px-4 text-[#65758B] max-w-xs truncate">
                              {sess.topic || 'Class Lecture'}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span
                                className={`text-[12px] font-bold px-2 py-0.5 rounded font-mono ${
                                  pct >= 75
                                    ? 'bg-[#EAF6EE] text-[#287A55]'
                                    : 'bg-[#FEF7E6] text-[#A66A00]'
                                }`}
                              >
                                {presentCount}/{total} ({pct}%)
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <button
                                onClick={() => deleteSession(sess.id)}
                                className="p-1.5 text-[#B33A3A] hover:bg-[#FDF2F2] rounded cursor-pointer transition-colors"
                                title="Delete Session"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* STUDENT DRILLDOWN MODAL */}
        {selectedStudentDrilldown && (
          <div className="fixed inset-0 bg-[#0B2945]/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[8px] border border-[#D9E0E7] shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-5 py-4 border-b border-[#D9E0E7] flex items-center justify-between bg-[#F5F7F9]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[17px] font-bold text-[#0B2945]">{selectedStudentDrilldown.studentName}</h3>
                    <span className="font-mono text-[12px] font-semibold text-[#123B63] bg-[#EAF2F8] px-2 py-0.5 rounded">
                      {selectedStudentDrilldown.studentRoll}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#65758B]">
                    {selectedStudentDrilldown.branch} • {selectedStudentDrilldown.year}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStudentDrilldown(null)}
                  className="p-1.5 text-[#65758B] hover:text-[#0B2945] rounded hover:bg-[#E9EEF3] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4">
                {/* Aggregate Banner */}
                <div className="p-3 bg-[#F5F7F9] border border-[#D9E0E7] rounded flex items-center justify-between">
                  <div>
                    <span className="text-[12px] text-[#65758B] font-medium">Aggregate Attendance</span>
                    <p className="text-[20px] font-bold text-[#0B2945] font-mono">
                      {selectedStudentDrilldown.percentage}%
                    </p>
                  </div>
                  <div>
                    <span className="text-[12px] text-[#65758B] font-medium">Classes Attended</span>
                    <p className="text-[20px] font-bold text-[#123B63] font-mono">
                      {selectedStudentDrilldown.attendedClasses} / {selectedStudentDrilldown.totalClasses}
                    </p>
                  </div>
                  <div>
                    <span className="text-[12px] text-[#65758B] font-medium">Status</span>
                    <span
                      className={`block text-[12px] font-bold px-2 py-0.5 rounded text-center mt-0.5 ${
                        selectedStudentDrilldown.status === 'Safe'
                          ? 'bg-[#EAF6EE] text-[#287A55]'
                          : selectedStudentDrilldown.status === 'Caution'
                          ? 'bg-[#FEF7E6] text-[#A66A00]'
                          : 'bg-[#FDF2F2] text-[#B33A3A]'
                      }`}
                    >
                      {selectedStudentDrilldown.status}
                    </span>
                  </div>
                </div>

                {/* Subject Wise Grid */}
                <h4 className="text-[14px] font-bold text-[#0B2945]">Subject-wise Breakdown</h4>
                <div className="space-y-2.5">
                  {selectedStudentDrilldown.subjectSummaries.map((subj) => (
                    <div
                      key={subj.code}
                      className="p-3 border border-[#D9E0E7] rounded-[5px] flex items-center justify-between bg-[#F9FBFC]"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] font-bold text-[#123B63] bg-white px-1.5 py-0.2 border border-[#D9E0E7] rounded">
                            {subj.code}
                          </span>
                          <span className="font-semibold text-[#0B2945] text-[13px]">{subj.name}</span>
                        </div>
                        <p className="text-[11px] text-[#65758B] mt-0.5">Faculty: {subj.facultyName}</p>
                      </div>

                      <div className="text-right">
                        <span
                          className={`font-mono text-[13px] font-bold px-2 py-0.5 rounded ${
                            subj.percentage >= 75
                              ? 'bg-[#EAF6EE] text-[#287A55]'
                              : 'bg-[#FDF2F2] text-[#B33A3A]'
                          }`}
                        >
                          {subj.percentage}%
                        </span>
                        <div className="text-[11px] text-[#65758B] mt-0.5 font-mono">
                          {subj.attendedClasses}/{subj.totalClasses} classes
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-5 py-3 border-t border-[#D9E0E7] bg-[#F5F7F9] flex justify-end">
                <button
                  onClick={() => setSelectedStudentDrilldown(null)}
                  className="px-4 py-1.5 bg-[#123B63] text-white text-[13px] font-semibold rounded hover:bg-[#0B2945] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
