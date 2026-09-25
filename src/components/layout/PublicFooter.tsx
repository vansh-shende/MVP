import React from 'react';
import { Link } from 'react-router-dom';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-[#0B2945] text-slate-300 border-t border-[#123B63]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Column 1: Institution Info with Emblem */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-[4px] shrink-0 flex items-center justify-center shadow-xs">
                <img
                  src="/kits/kits-emblem.png"
                  alt="KITS Ramtek Emblem"
                  className="h-9 w-auto object-contain"
                />
              </div>
              <div>
                <span className="text-sm font-bold text-white tracking-tight">KITS RAMTEK</span>
                <p className="text-slate-300 text-xs">Student Activity & Achievement Portal</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              <strong className="text-white font-medium">Kavikulguru Institute of Technology and Science</strong><br />
              Ramtek, Dist. Nagpur, Maharashtra – 441106, India<br />
              Accredited by NAAC with &apos;A&apos; Grade · Approved by AICTE, New Delhi · Affiliated to RTM Nagpur University
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Portal Navigation</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li><Link to="/home" className="hover:text-white transition-colors">Portal Home</Link></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Portal</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">Verification Procedure</a></li>
              <li><a href="#activities" className="hover:text-white transition-colors">Student Activities</a></li>
              <li><a href="#guidelines" className="hover:text-white transition-colors">Upload Guidelines</a></li>
              <li><Link to="/login" className="hover:text-white transition-colors font-semibold text-[#8EB7DC]">Student & Faculty Login</Link></li>
            </ul>
          </div>

          {/* Column 3: Academic Departments */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Departments</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Computer Technology · CSE (AI & ML) · Information Technology · Electronics & Comm. · Electrical · Mechanical · Civil · Architecture
            </p>
            <div className="pt-2">
              <a
                href="https://kits.edu"
                target="_blank"
                rel="noreferrer"
                className="inline-block text-[11px] font-semibold text-[#8EB7DC] hover:text-white underline underline-offset-2"
              >
                Official Website: kits.edu ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};


