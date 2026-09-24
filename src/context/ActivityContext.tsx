import React, { createContext, useContext, useState, useEffect } from 'react';
import { ActivitySubmission, SubmissionStatus } from '../types';
import { INITIAL_SUBMISSIONS } from '../data/mockData';

interface ActivityContextType {
  submissions: ActivitySubmission[];
  addSubmission: (submission: Omit<ActivitySubmission, 'id' | 'dateSubmitted' | 'status'>) => ActivitySubmission;
  updateSubmissionStatus: (
    id: string,
    status: SubmissionStatus,
    facultyRemarks?: string,
    activityPoints?: number,
    reviewerName?: string
  ) => void;
  deleteSubmission: (id: string) => void;
  resetDemoData: () => void;
  getStudentSubmissions: (studentId: string) => ActivitySubmission[];
  getPendingSubmissions: () => ActivitySubmission[];
  stats: {
    studentStats: {
      totalActivities: number;
      pending: number;
      approved: number;
      rejected: number;
    };
    teacherStats: {
      totalSubmissions: number;
      pendingReviews: number;
      approved: number;
      rejected: number;
      verifiedRecords: number;
      pendingVerification: number;
      totalStudents: number;
    };
  };
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [submissions, setSubmissions] = useState<ActivitySubmission[]>(() => {
    try {
      const saved = localStorage.getItem('studentActivities');
      if (saved) {
        const parsed = JSON.parse(saved) as ActivitySubmission[];
        // Check if saved data contains the new mock data or old mock data
        const hasNewFormat = parsed.some(s => s.id === 'sub-vs-01' || s.id === 'sub-pm-01');
        if (hasNewFormat) {
          return parsed;
        } else {
          // Keep user-created submissions (IDs starting with act-), but update demo data to the exact 10 students
          const userCreated = parsed.filter(s => s.id.startsWith('act-'));
          return [...userCreated, ...INITIAL_SUBMISSIONS];
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_SUBMISSIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('studentActivities', JSON.stringify(submissions));
    } catch (e) {
      console.warn('LocalStorage save failed, using memory state:', e);
    }
  }, [submissions]);

  const addSubmission = (newSub: any) => {
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date());

    const created: ActivitySubmission = {
      id: `act-${Date.now()}`,
      studentId: newSub.studentId || 'std-103',
      studentName: newSub.studentName || 'Vansh Shende',
      studentRoll: newSub.studentRoll || 'IT202208',
      studentDept: newSub.studentDept || newSub.branch || 'Information Technology (IT)',
      studentYear: newSub.studentYear || '3rd Year',
      branch: newSub.branch || newSub.studentDept || 'Information Technology (IT)',
      title: newSub.title,
      category: newSub.category,
      level: newSub.level || 'College',
      date: newSub.date,
      organizingInstitution: newSub.organizingInstitution,
      role: newSub.role || 'Participant',
      description: newSub.description || '',
      certificateName: newSub.certificateFileName || newSub.certificateName || newSub.proofFileName || 'Certificate.pdf',
      certificateFileName: newSub.certificateFileName || newSub.certificateName || 'Certificate.pdf',
      certificateFileType: newSub.certificateFileType || (newSub.certificateName?.endsWith('.pdf') ? 'application/pdf' : 'image/png'),
      certificateData: newSub.certificateData || '',
      status: 'Pending',
      submittedAt: formattedDate,
      dateSubmitted: formattedDate,
      type: newSub.category
    };

    setSubmissions(prev => [created, ...prev]);
    return created;
  };

  const updateSubmissionStatus = (
    id: string,
    status: SubmissionStatus,
    facultyRemarks?: string,
    activityPoints?: number,
    reviewerName: string = 'Mrs. Harshita Jain'
  ) => {
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date());

    setSubmissions(prev => {
      const updated = prev.map(sub => {
        if (sub.id === id) {
          return {
            ...sub,
            status,
            teacherRemark: facultyRemarks !== undefined ? facultyRemarks : sub.teacherRemark,
            facultyRemarks: facultyRemarks !== undefined ? facultyRemarks : sub.facultyRemarks,
            rejectionReason: status === 'Rejected' ? (facultyRemarks || sub.rejectionReason) : undefined,
            activityPoints: status === 'Approved' ? (activityPoints !== undefined ? activityPoints : (sub.activityPoints || 25)) : sub.activityPoints,
            reviewedBy: reviewerName,
            reviewedAt: formattedDate
          };
        }
        return sub;
      });
      try {
        localStorage.setItem('studentActivities', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }
      return updated;
    });
  };

  const deleteSubmission = (id: string) => {
    setSubmissions(prev => prev.filter(s => s.id !== id));
  };

  const resetDemoData = () => {
    setSubmissions(INITIAL_SUBMISSIONS);
    localStorage.setItem('studentActivities', JSON.stringify(INITIAL_SUBMISSIONS));
  };

  const getStudentSubmissions = (studentId: string) => {
    return submissions.filter(sub => sub.studentId === studentId);
  };

  const getPendingSubmissions = () => {
    return submissions.filter(sub => sub.status === 'Pending' || sub.status === 'Under Review');
  };

  // Student Vansh Shende (std-103 or std-101 or matching name) dynamic metrics
  const studentSubmissions = submissions.filter(sub => (
    sub.studentId === 'std-103' || sub.studentId === 'std-101' || sub.studentName === 'Vansh Shende' || !sub.studentId
  ));
  const studentStats = {
    totalActivities: studentSubmissions.length,
    pending: studentSubmissions.filter(s => s.status === 'Pending' || s.status === 'Under Review').length,
    approved: studentSubmissions.filter(s => s.status === 'Approved' || s.status === 'Verified').length,
    rejected: studentSubmissions.filter(s => s.status === 'Rejected').length
  };

  // Teacher dynamic metrics calculated directly from submissions
  const teacherStats = {
    pendingReviews: submissions.filter(s => s.status === 'Pending' || s.status === 'Under Review').length,
    approved: submissions.filter(s => s.status === 'Approved' || s.status === 'Verified').length,
    rejected: submissions.filter(s => s.status === 'Rejected').length,
    totalSubmissions: submissions.length,
    verifiedRecords: submissions.filter(s => s.status === 'Approved' || s.status === 'Verified').length,
    pendingVerification: submissions.filter(s => s.status === 'Pending' || s.status === 'Under Review').length,
    totalStudents: 10
  };

  const value: ActivityContextType = {
    submissions,
    addSubmission,
    updateSubmissionStatus,
    deleteSubmission,
    resetDemoData,
    getStudentSubmissions,
    getPendingSubmissions,
    stats: {
      studentStats,
      teacherStats
    }
  };

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};
