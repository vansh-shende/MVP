import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_STUDENT, DEMO_TEACHER } from '../data/mockData';

interface AuthContextType {
  currentUser: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  loginAsStudent: () => void;
  loginAsTeacher: () => void;
  loginCustom: (email: string, role: UserRole) => void;
  updateStudentProfile: (updated: Partial<UserProfile>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem('kits_portfolio_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {
      // fallback
    }
    // Default to student for seamless presentation
    return DEMO_STUDENT;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('kits_portfolio_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('kits_portfolio_user');
    }
  }, [currentUser]);

  const loginAsStudent = () => {
    setCurrentUser(DEMO_STUDENT);
  };

  const loginAsTeacher = () => {
    setCurrentUser(DEMO_TEACHER);
  };

  const loginCustom = (email: string, role: UserRole) => {
    if (role === 'teacher') {
      setCurrentUser({
        ...DEMO_TEACHER,
        email: email || DEMO_TEACHER.email
      });
    } else {
      setCurrentUser({
        ...DEMO_STUDENT,
        email: email || DEMO_STUDENT.email
      });
    }
  };

  const updateStudentProfile = (updated: Partial<UserProfile>) => {
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, ...updated } : null);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value: AuthContextType = {
    currentUser,
    role: currentUser ? currentUser.role : null,
    isAuthenticated: !!currentUser,
    loginAsStudent,
    loginAsTeacher,
    loginCustom,
    updateStudentProfile,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
