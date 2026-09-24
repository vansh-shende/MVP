import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  PlusCircle,
  FileText,
  ShieldCheck,
  Users,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CollegeHeader } from '../common/CollegeHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onSearch?: (q: string) => void;
  searchPlaceholder?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  onSearch,
  searchPlaceholder
}) => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentSections = [
    {
      title: 'STUDENT PORTAL',
      items: [
        { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
        { label: 'My Profile', path: '/student/profile', icon: User },
        { label: 'Add Activity', path: '/student/add-activity', icon: PlusCircle },
        { label: 'My Submissions', path: '/student/submissions', icon: FileText },
      ]
    }
  ];

  const teacherSections = [
    {
      title: 'FACULTY PORTAL',
      items: [
        { label: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
        { label: 'Pending Submissions', path: '/teacher/verify', icon: ShieldCheck },
        { label: 'Student Records', path: '/teacher/students', icon: Users },
      ]
    }
  ];

  const sections = role === 'teacher' ? teacherSections : studentSections;

  return (
    <div className="min-h-screen bg-[#F5F7F9] text-[#243447] flex flex-col font-sans">
      {/* Top Header */}
      <CollegeHeader onSearch={onSearch} searchPlaceholder={searchPlaceholder} />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Mobile Sidebar Toggle Button */}
        <div className="lg:hidden fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2.5 bg-[#123B63] text-white rounded-[5px] shadow-sm hover:bg-[#0B2945] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar Desktop: White background, thin right border, 240px width */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-60 bg-white border-r border-[#D9E0E7]
          transform transition-transform duration-150 ease-in-out lg:transform-none flex flex-col
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          pt-4 pb-6 px-3 shrink-0
        `}>
          <div className="space-y-5">
            {sections.map((section) => (
              <div key={section.title}>
                {/* Small uppercase section label */}
                <h3 className="px-2.5 text-[11px] font-bold text-[#65758B] tracking-wider uppercase mb-1.5">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.label}
                        to={item.path}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={({ isActive }) => `
                          flex items-center gap-2.5 px-2.5 py-2 rounded-[5px] text-xs sm:text-[13px] font-medium transition-colors
                          ${isActive
                            ? 'bg-[#EAF2F8] text-[#123B63] font-semibold border-l-2 border-[#123B63]'
                            : 'text-[#243447] hover:bg-[#F5F7F9] hover:text-[#0B2945]'
                          }
                        `}
                      >
                        <Icon className="w-4 h-4 shrink-0 text-[#65758B]" />
                        <span className="whitespace-nowrap">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Account Section with Logout */}
          <div className="mt-auto pt-4 border-t border-[#D9E0E7]">
            <h3 className="px-2.5 text-[11px] font-bold text-[#65758B] tracking-wider uppercase mb-1.5">
              ACCOUNT
            </h3>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[5px] text-xs sm:text-[13px] font-medium text-[#243447] hover:text-[#B33A3A] hover:bg-[#FDF2F2] transition-colors text-left"
            >
              <LogOut className="w-4 h-4 shrink-0 text-[#65758B]" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-[#0B2945]/30 z-30 lg:hidden"
          />
        )}

        {/* Page Content Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-7">
          {children}
        </main>
      </div>
    </div>
  );
};
