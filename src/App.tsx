import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ActivityProvider } from './context/ActivityContext';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';

// Student Views
import { StudentDashboard } from './pages/student/StudentDashboard';
import { AddActivityPage } from './pages/student/AddActivityPage';
import { MySubmissionsPage } from './pages/student/MySubmissionsPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { ResourcesPage } from './pages/student/ResourcesPage';

// Teacher Views
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { VerificationPage } from './pages/teacher/VerificationPage';
import { StudentDirectoryPage } from './pages/teacher/StudentDirectoryPage';
import { ReportsPage } from './pages/teacher/ReportsPage';
import { TeacherProfilePage } from './pages/teacher/TeacherProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <ActivityProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/add-activity" element={<AddActivityPage />} />
            <Route path="/student/submissions" element={<MySubmissionsPage />} />
            <Route path="/student/profile" element={<StudentProfilePage />} />
            <Route path="/student/resources" element={<ResourcesPage />} />

            {/* Teacher Routes */}
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/verify" element={<VerificationPage />} />
            <Route path="/teacher/students" element={<StudentDirectoryPage />} />
            <Route path="/teacher/reports" element={<ReportsPage />} />
            <Route path="/teacher/profile" element={<TeacherProfilePage />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ActivityProvider>
    </AuthProvider>
  );
}
