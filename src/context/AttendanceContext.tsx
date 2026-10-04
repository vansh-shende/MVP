import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AttendanceSession,
  AttendanceGrievance,
  SubjectInfo,
  StudentAttendanceProfile,
  SubjectAttendanceSummary,
  AttendanceStatus,
  GrievanceStatus
} from '../types/attendance';
import { DEMO_STUDENTS_LIST } from '../data/mockData';

export const INITIAL_SUBJECTS: SubjectInfo[] = [
  {
    code: 'IT501',
    name: 'Database Management Systems',
    facultyName: 'Mrs. Harshita Jain',
    department: 'Information Technology',
    semester: '5th Semester',
    credits: 4
  },
  {
    code: 'IT502',
    name: 'Operating Systems & Architecture',
    facultyName: 'Prof. Rajesh Kulkarni',
    department: 'Information Technology',
    semester: '5th Semester',
    credits: 4
  },
  {
    code: 'IT503',
    name: 'Design & Analysis of Algorithms',
    facultyName: 'Dr. S. P. Sharma',
    department: 'Information Technology',
    semester: '5th Semester',
    credits: 4
  },
  {
    code: 'IT504',
    name: 'Computer Networks & Security',
    facultyName: 'Prof. Sneha Deshmukh',
    department: 'Information Technology',
    semester: '5th Semester',
    credits: 3
  },
  {
    code: 'IT505',
    name: 'Software Engineering & Agile',
    facultyName: 'Mrs. Harshita Jain',
    department: 'Information Technology',
    semester: '5th Semester',
    credits: 3
  },
  {
    code: 'IT506P',
    name: 'Web Technology & Cloud Lab',
    facultyName: 'Mrs. Harshita Jain',
    department: 'Information Technology',
    semester: '5th Semester',
    credits: 2
  }
];

// Helper to generate realistic initial sessions
const generateInitialSessions = (): AttendanceSession[] => {
  const sessions: AttendanceSession[] = [];
  const dateList = [
    '2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04', '2026-09-07',
    '2026-09-08', '2026-09-09', '2026-09-10', '2026-09-11', '2026-09-14',
    '2026-09-15', '2026-09-16', '2026-09-17', '2026-09-18', '2026-09-21',
    '2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25', '2026-09-28',
    '2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02'
  ];

  const timeSlots = [
    '10:00 AM - 11:00 AM',
    '11:15 AM - 12:15 PM',
    '01:00 PM - 02:00 PM',
    '02:15 PM - 03:15 PM'
  ];

  let sessionIdCounter = 1;

  dateList.forEach((dateStr, dIndex) => {
    // 2 to 3 sessions per day
    const daySubjects = [
      INITIAL_SUBJECTS[dIndex % INITIAL_SUBJECTS.length],
      INITIAL_SUBJECTS[(dIndex + 2) % INITIAL_SUBJECTS.length]
    ];

    if (dIndex % 2 === 0) {
      daySubjects.push(INITIAL_SUBJECTS[(dIndex + 4) % INITIAL_SUBJECTS.length]);
    }

    daySubjects.forEach((subj, sIndex) => {
      const records = DEMO_STUDENTS_LIST.map((student, studentIndex) => {
        let status: AttendanceStatus = 'Present';
        let remarks: string | undefined = undefined;

        // Vansh Shende (std-103): Overall good (~81%), but IT504 (Computer Networks) has low attendance (60%) to demonstrate unmet requirement
        if (student.id === 'std-103') {
          if (subj.code === 'IT504') {
            // Absent on several IT504 sessions to bring below 75% threshold
            if (dIndex % 2 === 0) {
              status = 'Absent';
              remarks = 'Absent (Lecture)';
            }
          } else if (dateStr === '2026-09-08' && sIndex === 0) {
            status = 'Absent';
            remarks = 'Unexcused';
          } else if (dateStr === '2026-09-18') {
            status = 'Excused';
            remarks = 'On Duty: Hackathon';
          } else if (dateStr === '2026-09-24' && sIndex === 1) {
            status = 'Late';
            remarks = '10 mins late';
          } else if (dateStr === '2026-09-29' && sIndex === 0) {
            status = 'Absent';
          }
        } else if (student.id === 'std-105') {
          // Badal Ramteke - Low overall attendance ~64% (Defaulter)
          if ((dIndex + studentIndex) % 2 === 0) {
            status = 'Absent';
          }
        } else if (student.id === 'std-109') {
          // Mohit Nandhanvar - ~70%
          if ((dIndex + studentIndex) % 3 === 0) {
            status = 'Absent';
          }
        } else {
          // Others high attendance ~85-92%
          if ((dIndex * 7 + studentIndex * 3) % 11 === 0) {
            status = 'Absent';
          } else if ((dIndex + studentIndex) % 13 === 0) {
            status = 'Late';
          }
        }

        return {
          studentId: student.id,
          studentRoll: student.roll,
          studentName: student.name,
          status,
          remarks
        };
      });

      sessions.push({
        id: `att-sess-${String(sessionIdCounter++).padStart(3, '0')}`,
        date: dateStr,
        timeSlot: timeSlots[sIndex % timeSlots.length],
        subjectCode: subj.code,
        subjectName: subj.name,
        branch: 'Information Technology',
        year: '3rd Year',
        facultyId: 'fac-202',
        facultyName: subj.facultyName,
        topic: `Unit ${((dIndex % 4) + 1)} - Key Concepts and Problem Solving Discussion`,
        records,
        createdAt: new Date().toISOString()
      });
    });
  });

  return sessions;
};

export const INITIAL_GRIEVANCES: AttendanceGrievance[] = [
  {
    id: 'grv-001',
    studentId: 'std-103',
    studentName: 'Vansh Shende',
    studentRoll: 'IT202208',
    type: 'On Duty / Event',
    fromDate: '2026-09-18',
    toDate: '2026-09-18',
    subjectCodes: ['IT501', 'IT502', 'IT505'],
    reason: 'Represented KITS Ramtek at the Inter-College TechSprint Hackathon finals.',
    proofFileName: 'TechSprint_Participation_Endorsement.pdf',
    status: 'Approved',
    submittedAt: '2026-09-19',
    reviewedBy: 'Mrs. Harshita Jain',
    reviewedAt: '2026-09-20',
    facultyRemarks: 'Verified official participation letter. On-Duty attendance granted.'
  },
  {
    id: 'grv-002',
    studentId: 'std-105',
    studentName: 'Badal Ramteke',
    studentRoll: 'EN202219',
    type: 'Medical Leave',
    fromDate: '2026-09-14',
    toDate: '2026-09-15',
    subjectCodes: ['IT501', 'IT503', 'IT504'],
    reason: 'Suffering from severe viral fever with medical prescription attached.',
    proofFileName: 'Medical_Certificate_Hospital.pdf',
    status: 'Approved',
    submittedAt: '2026-09-16',
    reviewedBy: 'Mrs. Harshita Jain',
    reviewedAt: '2026-09-17',
    facultyRemarks: 'Medical prescription verified.'
  },
  {
    id: 'grv-003',
    studentId: 'std-102',
    studentName: 'Nishikant Chandankhede',
    studentRoll: 'CT202115',
    type: 'Attendance Correction',
    fromDate: '2026-09-28',
    toDate: '2026-09-28',
    subjectCodes: ['IT506P'],
    reason: 'Was present in the laboratory for practical evaluation but mistakenly marked absent on the roster.',
    proofFileName: 'Lab_Sign_In_Sheet.png',
    status: 'Pending',
    submittedAt: '2026-09-29'
  }
];

interface AttendanceContextType {
  sessions: AttendanceSession[];
  subjects: SubjectInfo[];
  grievances: AttendanceGrievance[];
  markSessionAttendance: (sessionData: Omit<AttendanceSession, 'id' | 'createdAt'>) => string;
  updateSessionAttendance: (sessionId: string, records: AttendanceSession['records'], topic?: string) => void;
  deleteSession: (sessionId: string) => void;
  submitGrievance: (data: Omit<AttendanceGrievance, 'id' | 'status' | 'submittedAt'>) => void;
  reviewGrievance: (id: string, status: GrievanceStatus, remarks?: string, reviewerName?: string) => void;
  getStudentProfileAttendance: (studentId: string) => StudentAttendanceProfile;
  getAllStudentsAttendanceSummary: (filterBranch?: string, filterYear?: string) => StudentAttendanceProfile[];
  getSubjectStats: (subjectCode: string) => { totalSessions: number; avgAttendancePercentage: number; totalStudents: number };
  resetAttendanceData: () => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjects] = useState<SubjectInfo[]>(INITIAL_SUBJECTS);

  const [sessions, setSessions] = useState<AttendanceSession[]>(() => {
    const saved = localStorage.getItem('kits_attendance_sessions_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse attendance sessions from localStorage', e);
      }
    }
    return generateInitialSessions();
  });

  const [grievances, setGrievances] = useState<AttendanceGrievance[]>(() => {
    const saved = localStorage.getItem('kits_attendance_grievances_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse attendance grievances from localStorage', e);
      }
    }
    return INITIAL_GRIEVANCES;
  });

  useEffect(() => {
    localStorage.setItem('kits_attendance_sessions_v3', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('kits_attendance_grievances_v3', JSON.stringify(grievances));
  }, [grievances]);

  // Mark/Add new attendance session
  const markSessionAttendance = (sessionData: Omit<AttendanceSession, 'id' | 'createdAt'>): string => {
    const newId = `att-sess-${Date.now()}`;
    const newSession: AttendanceSession = {
      ...sessionData,
      id: newId,
      createdAt: new Date().toISOString()
    };

    setSessions((prev) => [newSession, ...prev]);
    return newId;
  };

  // Update existing session
  const updateSessionAttendance = (sessionId: string, records: AttendanceSession['records'], topic?: string) => {
    setSessions((prev) =>
      prev.map((sess) =>
        sess.id === sessionId
          ? { ...sess, records, ...(topic !== undefined ? { topic } : {}) }
          : sess
      )
    );
  };

  // Delete a session
  const deleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((sess) => sess.id !== sessionId));
  };

  // Submit student grievance / leave application
  const submitGrievance = (data: Omit<AttendanceGrievance, 'id' | 'status' | 'submittedAt'>) => {
    const newGrievance: AttendanceGrievance = {
      ...data,
      id: `grv-${Date.now()}`,
      status: 'Pending',
      submittedAt: new Date().toISOString().split('T')[0]
    };
    setGrievances((prev) => [newGrievance, ...prev]);
  };

  // Faculty review grievance
  const reviewGrievance = (id: string, status: GrievanceStatus, remarks?: string, reviewerName: string = 'Mrs. Harshita Jain') => {
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        return {
          ...g,
          status,
          reviewedBy: reviewerName,
          reviewedAt: new Date().toISOString().split('T')[0],
          facultyRemarks: remarks || (status === 'Approved' ? 'Request verified and approved.' : 'Request rejected after verification.')
        };
      })
    );

    // If approved, update sessions within the date range and subjects to Excused
    if (status === 'Approved') {
      const targetGrievance = grievances.find((g) => g.id === id);
      if (targetGrievance) {
        setSessions((prev) =>
          prev.map((sess) => {
            const sessDate = sess.date;
            const inRange = sessDate >= targetGrievance.fromDate && sessDate <= targetGrievance.toDate;
            const matchSubject = targetGrievance.subjectCodes.length === 0 || targetGrievance.subjectCodes.includes(sess.subjectCode);

            if (inRange && matchSubject) {
              const updatedRecords = sess.records.map((rec) => {
                if (rec.studentId === targetGrievance.studentId && rec.status === 'Absent') {
                  return {
                    ...rec,
                    status: 'Excused' as AttendanceStatus,
                    remarks: `Excused: ${targetGrievance.type}`
                  };
                }
                return rec;
              });
              return { ...sess, records: updatedRecords };
            }
            return sess;
          })
        );
      }
    }
  };

  // Calculate student attendance profile
  const getStudentProfileAttendance = (studentId: string): StudentAttendanceProfile => {
    // Find student in DEMO_STUDENTS_LIST or default to Vansh
    const student = DEMO_STUDENTS_LIST.find((s) => s.id === studentId) || DEMO_STUDENTS_LIST[2];

    const studentRecords: { session: AttendanceSession; record: AttendanceSession['records'][0] }[] = [];

    sessions.forEach((session) => {
      const matchRec = session.records.find((r) => r.studentId === student.id || r.studentRoll === student.roll);
      if (matchRec) {
        studentRecords.push({ session, record: matchRec });
      }
    });

    let totalClasses = 0;
    let attendedClasses = 0; // Present + Late + Excused count towards eligibility or attended

    const subjectMap: Record<string, { total: number; attended: number; subject: SubjectInfo }> = {};

    subjects.forEach((subj) => {
      subjectMap[subj.code] = { total: 0, attended: 0, subject: subj };
    });

    studentRecords.forEach(({ session, record }) => {
      const subjCode = session.subjectCode;
      if (!subjectMap[subjCode]) {
        subjectMap[subjCode] = {
          total: 0,
          attended: 0,
          subject: {
            code: subjCode,
            name: session.subjectName,
            facultyName: session.facultyName,
            department: 'Information Technology',
            semester: '5th Semester',
            credits: 3
          }
        };
      }

      subjectMap[subjCode].total += 1;
      totalClasses += 1;

      if (record.status === 'Present' || record.status === 'Excused') {
        subjectMap[subjCode].attended += 1;
        attendedClasses += 1;
      } else if (record.status === 'Late') {
        // Late counts as 1.0 or full attendance
        subjectMap[subjCode].attended += 1;
        attendedClasses += 1;
      }
    });

    const overallPercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 1000) / 10 : 0;
    const overallStatus: 'Safe' | 'Caution' | 'Critical' =
      overallPercentage >= 75 ? 'Safe' : overallPercentage >= 65 ? 'Caution' : 'Critical';

    const subjectSummaries: SubjectAttendanceSummary[] = Object.values(subjectMap).map(({ total, attended, subject }) => {
      const pct = total > 0 ? Math.round((attended / total) * 1000) / 10 : 100;
      let status: 'Safe' | 'Caution' | 'Critical' = 'Safe';
      if (pct < 65) status = 'Critical';
      else if (pct < 75) status = 'Caution';

      // classesNeededFor75: (attended + x) / (total + x) >= 0.75 => attended + x >= 0.75*total + 0.75*x => 0.25*x >= 0.75*total - attended => x >= 3*total - 4*attended
      let classesNeededFor75 = 0;
      let canSafelyMiss = 0;

      if (pct < 75) {
        classesNeededFor75 = Math.max(0, Math.ceil(3 * total - 4 * attended));
      } else {
        // canSafelyMiss: attended / (total + y) >= 0.75 => attended >= 0.75*total + 0.75*y => 0.75*y <= attended - 0.75*total => y <= (attended - 0.75*total)/0.75
        canSafelyMiss = Math.max(0, Math.floor((attended - 0.75 * total) / 0.75));
      }

      return {
        code: subject.code,
        name: subject.name,
        facultyName: subject.facultyName,
        totalClasses: total,
        attendedClasses: attended,
        percentage: pct,
        classesNeededFor75,
        canSafelyMiss,
        status
      };
    });

    return {
      studentId: student.id,
      studentName: student.name,
      studentRoll: student.roll,
      branch: student.branch,
      year: student.year,
      totalClasses,
      attendedClasses,
      percentage: overallPercentage,
      status: overallStatus,
      subjectSummaries
    };
  };

  // Get all students summary
  const getAllStudentsAttendanceSummary = (filterBranch?: string, filterYear?: string): StudentAttendanceProfile[] => {
    return DEMO_STUDENTS_LIST.filter((student) => {
      if (filterBranch && filterBranch !== 'All' && !student.branch.toLowerCase().includes(filterBranch.toLowerCase())) {
        return false;
      }
      if (filterYear && filterYear !== 'All' && student.year !== filterYear) {
        return false;
      }
      return true;
    }).map((student) => getStudentProfileAttendance(student.id));
  };

  // Subject stats for faculty
  const getSubjectStats = (subjectCode: string) => {
    const subjectSessions = sessions.filter((s) => s.subjectCode === subjectCode);
    if (subjectSessions.length === 0) {
      return { totalSessions: 0, avgAttendancePercentage: 0, totalStudents: DEMO_STUDENTS_LIST.length };
    }

    let totalAttendanceEntries = 0;
    let presentEntries = 0;

    subjectSessions.forEach((sess) => {
      sess.records.forEach((rec) => {
        totalAttendanceEntries++;
        if (rec.status === 'Present' || rec.status === 'Late' || rec.status === 'Excused') {
          presentEntries++;
        }
      });
    });

    const avgPct = totalAttendanceEntries > 0 ? Math.round((presentEntries / totalAttendanceEntries) * 1000) / 10 : 0;
    return {
      totalSessions: subjectSessions.length,
      avgAttendancePercentage: avgPct,
      totalStudents: DEMO_STUDENTS_LIST.length
    };
  };

  const resetAttendanceData = () => {
    const defaultSessions = generateInitialSessions();
    setSessions(defaultSessions);
    setGrievances(INITIAL_GRIEVANCES);
    localStorage.setItem('kits_attendance_sessions_v2', JSON.stringify(defaultSessions));
    localStorage.setItem('kits_attendance_grievances_v2', JSON.stringify(INITIAL_GRIEVANCES));
  };

  return (
    <AttendanceContext.Provider
      value={{
        sessions,
        subjects,
        grievances,
        markSessionAttendance,
        updateSessionAttendance,
        deleteSession,
        submitGrievance,
        reviewGrievance,
        getStudentProfileAttendance,
        getAllStudentsAttendanceSummary,
        getSubjectStats,
        resetAttendanceData
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
