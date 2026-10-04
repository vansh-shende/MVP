export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface SubjectInfo {
  code: string;
  name: string;
  facultyName: string;
  department: string;
  semester: string;
  credits: number;
}

export interface AttendanceRecordItem {
  studentId: string;
  studentRoll: string;
  studentName: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface AttendanceSession {
  id: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM - 11:00 AM"
  subjectCode: string;
  subjectName: string;
  branch: string;
  year: string;
  facultyId: string;
  facultyName: string;
  topic?: string;
  records: AttendanceRecordItem[];
  createdAt: string;
}

export interface SubjectAttendanceSummary {
  code: string;
  name: string;
  facultyName: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  classesNeededFor75: number;
  canSafelyMiss: number;
  status: 'Safe' | 'Caution' | 'Critical';
}

export interface StudentAttendanceProfile {
  studentId: string;
  studentName: string;
  studentRoll: string;
  branch: string;
  year: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  status: 'Safe' | 'Caution' | 'Critical';
  subjectSummaries: SubjectAttendanceSummary[];
}

export type GrievanceType = 'Medical Leave' | 'On Duty / Event' | 'Personal' | 'Attendance Correction';
export type GrievanceStatus = 'Pending' | 'Approved' | 'Rejected';

export interface AttendanceGrievance {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  type: GrievanceType;
  fromDate: string;
  toDate: string;
  subjectCodes: string[];
  reason: string;
  proofFileName?: string;
  proofFileType?: string;
  proofData?: string;
  status: GrievanceStatus;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  facultyRemarks?: string;
}
