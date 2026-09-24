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
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_SUBMISSIONS;
  });

  useEffect(() => {
    localStorage.setItem('studentActivities', JSON.stringify(submissions));
  }, [submissions]);

  const addSubmission = (newSub: any) => {
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date());

    const created: ActivitySubmission = {
      id: `act-${Date.now()}`,
      studentId: newSub.studentId || 'std-101',
      studentName: newSub.studentName || 'Vansh Shende',
      studentRoll: newSub.studentRoll || 'ITXXXX',
      studentDept: newSub.studentDept || 'Information Technology',
      title: newSub.title,
      category: newSub.category,
      level: newSub.level || 'College',
      date: newSub.date,
      organizingInstitution: newSub.organizingInstitution,
      role: newSub.role || 'Participant',
      description: newSub.description || '',
      certificateName: newSub.certificateName || newSub.proofFileName || '',
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
    reviewerName: string = 'Dr. Neha Deshmukh'
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
            activityPoints: activityPoints !== undefined ? activityPoints : sub.activityPoints,
            reviewedBy: reviewerName,
            reviewedAt: formattedDate
          };
        }
        return sub;
      });
      localStorage.setItem('studentActivities', JSON.stringify(updated));
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

  // Student Vansh Shende (std-101) dynamic metrics calculated from localStorage
  const studentSubmissions = submissions.filter(sub => (sub.studentId === 'std-101' || !sub.studentId));
  const studentStats = {
    totalActivities: studentSubmissions.length,
    pending: studentSubmissions.filter(s => s.status === 'Pending' || s.status === 'Under Review').length,
    approved: studentSubmissions.filter(s => s.status === 'Approved' || s.status === 'Verified').length,
    rejected: studentSubmissions.filter(s => s.status === 'Rejected').length
  };

  // Teacher dynamic metrics calculated directly from studentActivities
  const teacherStats = {
    pendingReviews: submissions.filter(s => s.status === 'Pending' || s.status === 'Under Review').length,
    approved: submissions.filter(s => s.status === 'Approved' || s.status === 'Verified').length,
    rejected: submissions.filter(s => s.status === 'Rejected').length,
    totalSubmissions: submissions.length,
    // Keep backward-compatible keys
    verifiedRecords: submissions.filter(s => s.status === 'Approved' || s.status === 'Verified').length,
    pendingVerification: submissions.filter(s => s.status === 'Pending' || s.status === 'Under Review').length,
    totalStudents: 120
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
