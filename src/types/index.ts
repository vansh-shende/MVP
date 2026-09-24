export type UserRole = 'student' | 'teacher' | 'admin';

export type ActivityType = 'Activity' | 'Achievement' | 'Certificate' | 'Volunteering' | 'Sports' | 'Cultural';

export type SubmissionStatus = 'Approved' | 'Pending' | 'Rejected' | 'Verified' | 'Under Review';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  // Student specific
  rollNumber?: string;
  department?: string;
  course?: string;
  year?: string;
  semester?: string;
  cgpa?: string;
  collegeTiming?: string;
  phone?: string;
  skills?: string[];
  bio?: string;
  // Faculty specific
  designation?: string;
  facultyId?: string;
}

export type ActivityCategory =
  | 'Hackathon'
  | 'Technical Workshop'
  | 'Coding Contest'
  | 'Green Campus'
  | 'Sports'
  | 'Cultural'
  | 'Other';

export type ActivityLevel = 'College' | 'State' | 'National' | 'International';

export type ActivityRole = 'Participant' | 'Winner' | 'Organizer';

export interface ActivitySubmission {
  id: string;
  studentId?: string;
  studentName: string;
  studentRoll?: string;
  studentDept?: string;
  title: string;
  category: ActivityCategory | string;
  level: ActivityLevel | string;
  date: string;
  organizingInstitution: string;
  role: ActivityRole | string;
  description?: string;
  certificateName?: string;
  status: SubmissionStatus;
  submittedAt?: string;
  teacherRemark?: string;
  // Backward compatibility helpers
  type?: string;
  eventOrOrg?: string;
  dateCompleted?: string;
  dateSubmitted?: string;
  proofFileName?: string;
  academicYear?: string;
  semester?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  facultyRemarks?: string;
  activityPoints?: number;
}
