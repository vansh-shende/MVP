import React from 'react';
import { User, Mail, Phone, Building, ShieldCheck, Award } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { COLLEGE_INFO } from '../../data/mockData';

export const TeacherProfilePage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="pb-4 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" />
            Faculty Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Faculty coordinator credentials and departmental verification authority at {COLLEGE_INFO.shortName}.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100">
            <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-2xl border-4 border-slate-50 shadow-sm">
              {currentUser?.name?.slice(0, 2) || 'HJ'}
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-xl font-bold text-slate-900">{currentUser?.name || 'Mrs. Harshita Jain'}</h2>
              <p className="text-sm font-semibold text-blue-600">
                {currentUser?.designation || 'Faculty Reviewer'}
              </p>
              <p className="text-xs text-slate-500">{COLLEGE_INFO.name}</p>
              <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded border border-emerald-200">
                  Authorized Verifier
                </span>
                <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  Faculty ID: {currentUser?.facultyId || 'FAC-REV-108'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Department</p>
              <p className="font-semibold text-slate-900 text-sm mt-0.5 flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-400" />
                {currentUser?.department || 'Information Technology'}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Official Email</p>
              <p className="font-semibold text-slate-900 text-sm mt-0.5 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                {currentUser?.email || 'harshita.jain@kits.edu'}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Office Phone</p>
              <p className="font-semibold text-slate-900 text-sm mt-0.5 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                {currentUser?.phone || '+91 94221 87654'}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Assigned Portfolios</p>
              <p className="font-semibold text-slate-900 text-sm mt-0.5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                AICTE Activity Cell · NAAC Criterion 5
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
