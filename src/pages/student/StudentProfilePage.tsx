import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Code,
  Edit2,
  Check,
  Award,
  KeyRound,
  Settings,
  FileText
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useActivity } from '../../context/ActivityContext';

export const StudentProfilePage: React.FC = () => {
  const { currentUser, updateStudentProfile } = useAuth();
  const { submissions } = useActivity();

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [name, setName] = useState(currentUser?.name || 'Vansh Shende');
  const [email, setEmail] = useState(currentUser?.email || 'vshende719@gmail.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [department, setDepartment] = useState(currentUser?.department || 'Information Technology');

  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState<string[]>(
    currentUser?.skills || [
      'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'SQL', 'Python', 'C++'
    ]
  );

  const verifiedSubmissions = submissions
    .filter(s => s.studentId === (currentUser?.id || 'std-101'))
    .slice(0, 3);

  const handleSavePersonal = () => {
    updateStudentProfile({
      name,
      email,
      phone,
      department
    });
    setIsEditingPersonal(false);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updated = [...skills, newSkill.trim()];
      setSkills(updated);
      updateStudentProfile({ skills: updated });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = skills.filter(s => s !== skillToRemove);
    setSkills(updated);
    updateStudentProfile({ skills: updated });
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Profile Header: Clean institutional header */}
        <div className="bg-white rounded-[6px] border border-[#D9E0E7] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[13px] sm:text-[14px] font-bold text-[#65758B] uppercase tracking-wider">
              Student Record
            </span>
            <h1 className="text-[28px] sm:text-[30px] font-bold text-[#0B2945] mt-0.5">
              My Profile
            </h1>
            <p className="text-[14px] text-[#65758B] mt-0.5">
              Personal and academic details registered under KITS Ramtek Student Management System.
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[14px] font-semibold text-[#123B63] bg-[#EAF2F8] px-2.5 py-1 rounded-[4px] border border-[#D9E0E7]">
              Enrolled: 2023–2027
            </span>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Personal, Academic, Skills */}
          <div className="lg:col-span-8 space-y-5">
            {/* 1. Personal Information */}
            <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#D9E0E7] mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#123B63]" />
                  <h3 className="font-bold text-[#0B2945] text-[21px] sm:text-[22px]">Personal Information</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[14px] sm:text-[15px] font-semibold text-[#123B63] hover:text-[#0B2945] bg-[#EAF2F8] border border-[#D9E0E7] rounded-[4px] transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  {isEditingPersonal ? 'Cancel' : 'Edit Details'}
                </button>
              </div>

              {isEditingPersonal ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[15px]">
                    <div>
                      <label className="block text-[15px] font-medium text-[#243447] mb-1">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-[40px] px-3 bg-white border border-[#D9E0E7] rounded-[5px] text-[16px] text-[#243447] focus:outline-hidden focus:border-[#123B63]"
                      />
                    </div>
                    <div>
                      <label className="block text-[15px] font-medium text-[#243447] mb-1">Email ID</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-[40px] px-3 bg-white border border-[#D9E0E7] rounded-[5px] text-[16px] text-[#243447] focus:outline-hidden focus:border-[#123B63]"
                      />
                    </div>
                    <div>
                      <label className="block text-[15px] font-medium text-[#243447] mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-[40px] px-3 bg-white border border-[#D9E0E7] rounded-[5px] text-[16px] text-[#243447] focus:outline-hidden focus:border-[#123B63]"
                      />
                    </div>
                    <div>
                      <label className="block text-[15px] font-medium text-[#243447] mb-1">Department</label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full h-[40px] px-3 bg-white border border-[#D9E0E7] rounded-[5px] text-[16px] text-[#243447] focus:outline-hidden focus:border-[#123B63]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleSavePersonal}
                      className="px-4 py-1.5 bg-[#123B63] text-white rounded-[5px] text-[15px] font-semibold hover:bg-[#0B2945] flex items-center gap-1.5 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-[5px] bg-[#123B63] text-white flex items-center justify-center font-bold text-xl shrink-0">
                    {currentUser?.name?.slice(0, 2) || 'VS'}
                  </div>

                  {/* Info Details */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[14px] sm:text-[15px] flex-1">
                    <div>
                      <p className="text-[#65758B] text-[14px]">Full Name</p>
                      <p className="font-semibold text-[#0B2945] mt-0.5 text-[15px] sm:text-[16px]">{currentUser?.name || 'Vansh Shende'}</p>
                    </div>
                    <div>
                      <p className="text-[#65758B] text-[14px]">Roll Number</p>
                      <p className="font-semibold text-[#0B2945] font-mono mt-0.5 text-[15px] sm:text-[16px]">{currentUser?.rollNumber || 'ITXXXX'}</p>
                    </div>
                    <div>
                      <p className="text-[#65758B] text-[14px]">Email Address</p>
                      <p className="font-semibold text-[#0B2945] mt-0.5 truncate text-[15px] sm:text-[16px]">{currentUser?.email || 'vshende719@gmail.com'}</p>
                    </div>
                    <div>
                      <p className="text-[#65758B] text-[14px]">Department</p>
                      <p className="font-semibold text-[#0B2945] mt-0.5 text-[15px] sm:text-[16px]">{currentUser?.department || 'Information Technology'}</p>
                    </div>
                    <div>
                      <p className="text-[#65758B] text-[14px]">Contact Phone</p>
                      <p className="font-semibold text-[#0B2945] mt-0.5 text-[15px] sm:text-[16px]">{currentUser?.phone || '+91 98765 43210'}</p>
                    </div>
                    <div>
                      <p className="text-[#65758B] text-[14px]">Year / Semester</p>
                      <p className="font-semibold text-[#0B2945] mt-0.5 text-[15px] sm:text-[16px]">3rd Year / 5th Semester</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Academic Information */}
            <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#D9E0E7] mb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#123B63]" />
                  <h3 className="font-bold text-[#0B2945] text-[21px] sm:text-[22px]">Academic Information</h3>
                </div>
                <span className="text-[14px] text-[#65758B]">Synced with Registrar</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-[14px] sm:text-[15px]">
                <div>
                  <p className="text-[#65758B] text-[14px]">Degree Program</p>
                  <p className="font-semibold text-[#0B2945] mt-0.5 text-[15px] sm:text-[16px]">B.Tech (Information Technology)</p>
                </div>
                <div>
                  <p className="text-[#65758B] text-[14px]">Academic Year</p>
                  <p className="font-semibold text-[#0B2945] mt-0.5 text-[15px] sm:text-[16px]">3rd Year (Semester V)</p>
                </div>
                <div>
                  <p className="text-[#65758B] text-[14px]">CGPA (Cumulative)</p>
                  <p className="font-bold text-[#0B2945] font-mono mt-0.5 text-[15px] sm:text-[16px]">8.12 / 10.0</p>
                </div>
                <div>
                  <p className="text-[#65758B] text-[14px]">College Code</p>
                  <p className="font-semibold text-[#0B2945] font-mono mt-0.5 text-[15px] sm:text-[16px]">KITS-4116</p>
                </div>
                <div>
                  <p className="text-[#65758B] text-[14px]">Affiliating University</p>
                  <p className="font-semibold text-[#0B2945] mt-0.5 text-[15px] sm:text-[16px]">RTMNU Nagpur</p>
                </div>
                <div>
                  <p className="text-[#65758B] text-[14px]">College Timing</p>
                  <p className="font-semibold text-[#0B2945] mt-0.5 text-[15px] sm:text-[16px]">10:00 AM – 5:00 PM</p>
                </div>
              </div>
            </div>

            {/* 3. Skills & Technologies */}
            <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#D9E0E7] mb-4">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#123B63]" />
                  <h3 className="font-bold text-[#0B2945] text-[21px] sm:text-[22px]">Technical Skills</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingSkills(!isEditingSkills)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[14px] sm:text-[15px] font-semibold text-[#123B63] hover:text-[#0B2945] bg-[#EAF2F8] border border-[#D9E0E7] rounded-[4px] transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                  {isEditingSkills ? 'Done' : 'Manage'}
                </button>
              </div>

              {isEditingSkills && (
                <form onSubmit={handleAddSkill} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Enter skill (e.g. Docker, TypeScript)..."
                    className="flex-1 h-[38px] px-3 text-[14px] bg-white border border-[#D9E0E7] rounded-[5px] text-[#243447] focus:outline-hidden focus:border-[#123B63]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 h-[38px] text-[14px] font-semibold bg-[#123B63] text-white rounded-[5px] hover:bg-[#0B2945] transition-colors"
                  >
                    Add
                  </button>
                </form>
              )}

              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[13px] sm:text-[14px] font-medium text-[#243447] bg-[#F5F7F9] border border-[#D9E0E7] rounded-[4px]"
                  >
                    {skill}
                    {isEditingSkills && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-[#65758B] hover:text-[#B33A3A] font-bold ml-1"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Actions & Verified Highlights */}
          <div className="lg:col-span-4 space-y-5">
            {/* Quick Administrative Actions */}
            <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-4">
              <h4 className="text-[13px] sm:text-[14px] font-bold uppercase tracking-wider text-[#65758B] mb-3">
                Account Actions
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => setIsEditingPersonal(true)}
                  className="w-full flex items-center justify-between p-2.5 bg-[#F5F7F9] hover:bg-[#EAF2F8] rounded-[5px] border border-[#D9E0E7] text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Edit2 className="w-3.5 h-3.5 text-[#123B63]" />
                    <span className="text-[14px] sm:text-[15px] font-semibold text-[#0B2945]">Update Contact Info</span>
                  </div>
                </button>
                <button
                  onClick={() => alert('Password update security verification.')}
                  className="w-full flex items-center justify-between p-2.5 bg-[#F5F7F9] hover:bg-[#EAF2F8] rounded-[5px] border border-[#D9E0E7] text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5 text-[#123B63]" />
                    <span className="text-[14px] sm:text-[15px] font-semibold text-[#0B2945]">Change Password</span>
                  </div>
                </button>
                <button
                  onClick={() => alert('Accessing college archive documents.')}
                  className="w-full flex items-center justify-between p-2.5 bg-[#F5F7F9] hover:bg-[#EAF2F8] rounded-[5px] border border-[#D9E0E7] text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#123B63]" />
                    <span className="text-[14px] sm:text-[15px] font-semibold text-[#0B2945]">Official Documents</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Department Dossier Note */}
            <div className="bg-white rounded-[6px] border border-[#D9E0E7] p-4 text-[14px] space-y-2">
              <h4 className="font-bold text-[#0B2945] text-[15px]">Institutional Verification Note</h4>
              <p className="text-[#65758B] leading-relaxed text-[14px]">
                Student achievements recorded on this portal are verified under departmental faculty coordinators for internal accreditation and official college records.
              </p>
              <div className="pt-2 border-t border-[#D9E0E7] text-[14px] text-[#123B63] font-medium">
                Head of Department · Information Technology
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
