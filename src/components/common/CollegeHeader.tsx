import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CollegeLogo } from './CollegeLogo';

interface CollegeHeaderProps {
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
}

export const CollegeHeader: React.FC<CollegeHeaderProps> = ({
  onSearch,
  searchPlaceholder = 'Search activities, achievements, etc...'
}) => {
  const { currentUser, role, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#D9E0E7]">
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5">
        {/* Left: Branding */}
        <div className="flex items-center gap-6">
          <div
            className="cursor-pointer"
            onClick={() => navigate(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard')}
          >
            <CollegeLogo size="sm" showSubtitle={true} />
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#65758B]" />
            <input
              type="text"
              value={searchVal}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3.5 py-1.5 bg-[#F5F7F9] border border-[#D9E0E7] rounded-[5px] text-xs sm:text-sm text-[#243447] placeholder-[#65758B] focus:outline-hidden focus:border-[#123B63] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right: Notifications & Profile Pill */}
        <div className="flex items-center gap-3">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 text-[#243447] hover:bg-[#F5F7F9] rounded-[4px] border border-transparent hover:border-[#D9E0E7] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-[#243447]" />
              <span className="absolute top-1 right-1 w-3.5 h-3.5 text-[9px] font-bold text-white bg-[#B33A3A] rounded-full flex items-center justify-center">
                2
              </span>
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-[#D9E0E7] rounded-[6px] shadow-sm py-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-[#D9E0E7] flex items-center justify-between">
                  <span className="font-semibold text-[#0B2945]">Notifications</span>
                  <span className="text-[#65758B] text-[11px]">2 New</span>
                </div>
                <div className="divide-y divide-[#D9E0E7]/60">
                  <div className="px-3 py-2.5 hover:bg-[#F5F7F9] transition-colors cursor-pointer">
                    <p className="font-medium text-[#0B2945]">Workshop Record Approved</p>
                    <p className="text-[#65758B] text-[11px] mt-0.5">Faculty Mrs. Harshita Jain approved your activity</p>
                    <span className="text-[10px] text-[#65758B] mt-1 inline-block">2 hours ago</span>
                  </div>
                  <div className="px-3 py-2.5 hover:bg-[#F5F7F9] transition-colors cursor-pointer">
                    <p className="font-medium text-[#0B2945]">Submission Under Review</p>
                    <p className="text-[#65758B] text-[11px] mt-0.5">Code Rush Hackathon submission received</p>
                    <span className="text-[10px] text-[#65758B] mt-1 inline-block">1 day ago</span>
                  </div>
                </div>
                <div className="px-3 pt-2 text-center border-t border-[#D9E0E7]">
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[#123B63] hover:text-[#0B2945] font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-[5px] bg-[#F5F7F9] border border-[#D9E0E7] hover:border-[#BCC8D4] transition-colors text-left"
            >
              <div className="w-6 h-6 rounded-[3px] bg-[#123B63] text-white flex items-center justify-center font-bold text-[11px]">
                {currentUser?.name
                  ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                  : 'US'}
              </div>
              <div className="hidden sm:block leading-tight">
                <p className="text-xs font-semibold text-[#0B2945]">
                  {currentUser?.name || 'Vansh Shende'}
                </p>
                <p className="text-[10px] text-[#65758B] uppercase font-medium">
                  {role === 'teacher' ? 'Faculty' : 'Student'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#65758B] hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[#D9E0E7] rounded-[6px] shadow-sm py-1 z-50 text-xs">
                <div className="px-3 py-2 border-b border-[#D9E0E7]">
                  <p className="font-semibold text-[#0B2945]">{currentUser?.name}</p>
                  <p className="text-[11px] text-[#65758B] truncate">{currentUser?.email}</p>
                  <p className="text-[11px] text-[#123B63] font-medium mt-0.5">
                    {role === 'teacher' ? 'KITS Faculty' : `Roll No: ${currentUser?.rollNumber || 'ITXXXX'}`}
                  </p>
                </div>

                {role === 'student' && (
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/student/profile');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[#243447] hover:bg-[#F5F7F9] text-left font-medium"
                  >
                    <User className="w-3.5 h-3.5 text-[#65758B]" />
                    My Profile
                  </button>
                )}

                <div className="border-t border-[#D9E0E7] my-1"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[#B33A3A] hover:bg-[#FDF2F2] text-left font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
