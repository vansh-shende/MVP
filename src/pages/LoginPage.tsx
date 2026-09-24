import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  User,
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Landmark
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { COLLEGE_INFO, DEMO_STUDENT, DEMO_TEACHER } from '../data/mockData';
import { CollegeLogo } from '../components/common/CollegeLogo';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsStudent, loginAsTeacher } = useAuth();

  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const [emailOrId, setEmailOrId] = useState(DEMO_STUDENT.email);
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'teacher') {
      setEmailOrId(DEMO_TEACHER.email);
    } else {
      setEmailOrId(DEMO_STUDENT.email);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRole === 'teacher') {
      loginAsTeacher();
      navigate('/teacher/dashboard');
    } else {
      loginAsStudent();
      navigate('/student/dashboard');
    }
  };

  const handleQuickStudent = () => {
    loginAsStudent();
    navigate('/student/dashboard');
  };

  const handleQuickTeacher = () => {
    loginAsTeacher();
    navigate('/teacher/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F5F7F9] text-[#243447] flex flex-col justify-between">
      {/* Top minimal bar */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between border-b border-[#D9E0E7] bg-white">
        <Link to="/">
          <CollegeLogo size="sm" showSubtitle={true} />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#123B63] hover:text-[#0B2945] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Portal Home
        </Link>
      </div>

      {/* Center login card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full bg-white rounded-[6px] border border-[#D9E0E7] shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Login Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
            <div className="mb-5">
              <span className="text-[11px] font-bold text-[#65758B] uppercase tracking-wider">
                Institutional Access
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B2945] mt-0.5">
                Portal Login
              </h2>
              <p className="text-xs sm:text-[13px] text-[#65758B] mt-1">
                Enter your college credentials to access your student or faculty account.
              </p>
            </div>

            {/* Role Switcher Tabs */}
            <div className="flex items-center p-1 bg-[#F5F7F9] rounded-[5px] border border-[#D9E0E7] mb-5 gap-1">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-[4px] transition-all ${
                  activeRole === 'student'
                    ? 'bg-[#123B63] text-white shadow-xs'
                    : 'text-[#65758B] hover:text-[#0B2945]'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Student
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('teacher')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-[4px] transition-all ${
                  activeRole === 'teacher'
                    ? 'bg-[#123B63] text-white shadow-xs'
                    : 'text-[#65758B] hover:text-[#0B2945]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Faculty
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Email / ID */}
              <div>
                <label className="block text-[13px] font-medium text-[#243447] mb-1">
                  {activeRole === 'student' ? 'Student Email / Roll No' : 'Faculty Email / Employee ID'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#65758B]" />
                  <input
                    type="text"
                    required
                    value={emailOrId}
                    onChange={(e) => setEmailOrId(e.target.value)}
                    placeholder={activeRole === 'student' ? 'vshende719@gmail.com' : 'faculty@kits.edu'}
                    className="w-full h-[42px] pl-9 pr-3 text-xs sm:text-sm bg-white border border-[#D9E0E7] rounded-[5px] text-[#243447] placeholder-[#65758B] focus:outline-hidden focus:border-[#123B63]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[13px] font-medium text-[#243447] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#65758B]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-[42px] pl-9 pr-9 text-xs sm:text-sm bg-white border border-[#D9E0E7] rounded-[5px] text-[#243447] placeholder-[#65758B] focus:outline-hidden focus:border-[#123B63]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#65758B] hover:text-[#0B2945]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer text-[#65758B]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded-[3px] text-[#123B63] focus:ring-0 border-[#D9E0E7]"
                  />
                  <span>Remember session</span>
                </label>
                <span className="text-[#123B63] font-medium cursor-pointer">
                  Forgot Password?
                </span>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full h-[42px] bg-[#123B63] hover:bg-[#0B2945] text-white font-semibold text-xs sm:text-sm rounded-[5px] transition-colors flex items-center justify-center gap-1.5 mt-2"
              >
                Login to Portal
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Logins Helper */}
            <div className="mt-5 pt-4 border-t border-[#D9E0E7] space-y-2">
              <p className="text-[11px] text-[#65758B] text-center font-medium">
                Quick Demonstration Access:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleQuickStudent}
                  className="px-2.5 py-1.5 text-xs font-semibold text-[#123B63] bg-[#EAF2F8] hover:bg-[#D9E0E7] border border-[#D9E0E7] rounded-[5px] transition-colors text-center"
                >
                  Student (Vansh Shende)
                </button>
                <button
                  type="button"
                  onClick={handleQuickTeacher}
                  className="px-2.5 py-1.5 text-xs font-semibold text-[#287A55] bg-[#EAF5EE] hover:bg-[#C6E7D5] border border-[#C6E7D5] rounded-[5px] transition-colors text-center"
                >
                  Faculty (Dr. Neha)
                </button>
              </div>
            </div>
          </div>

          {/* Right: Institutional Information Panel */}
          <div className="lg:col-span-5 bg-[#F5F7F9] p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-[#D9E0E7] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-11 w-auto max-w-[56px] shrink-0">
                <img
                  src="/kits/kits-emblem.png"
                  alt="KITS Ramtek Emblem"
                  className="h-full w-auto object-contain"
                />
              </div>
              <h3 className="text-base font-bold text-[#0B2945] leading-snug">
                {COLLEGE_INFO.name}
              </h3>
              <p className="text-xs text-[#65758B] leading-relaxed">
                Department of Information Technology · Centralized student activity recording and evaluation portal.
              </p>
            </div>

            <div className="my-6 bg-white p-4 rounded-[5px] border border-[#D9E0E7] space-y-2 text-xs">
              <p className="font-semibold text-[#0B2945]">System Guidelines</p>
              <ul className="text-[#65758B] space-y-1 text-[11px] list-disc list-inside">
                <li>Submit authentic certificates for review</li>
                <li>Track verification status in real time</li>
                <li>Review faculty feedback remarks</li>
              </ul>
            </div>

            <div className="text-[11px] text-[#65758B] border-t border-[#D9E0E7] pt-3">
              KITS Ramtek · Ramtek, Nagpur 441106
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
