import React from 'react';
import { BookOpen, Download, FileText, CheckCircle2, Award, Landmark } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { COLLEGE_INFO } from '../../data/mockData';

export const ResourcesPage: React.FC = () => {
  const guidelines = [
    {
      title: 'AICTE Activity Point Program Guidelines',
      desc: 'Mandatory 100 activity points criteria for award of B.Tech Degree as per AICTE and RTMNU.',
      category: 'Academic Regulation',
      fileSize: '1.2 MB PDF'
    },
    {
      title: 'KITS Ramtek Student Portfolio Evaluation Rubric',
      desc: 'Detailed breakdown of credit points for technical workshops, hackathons, papers, and NSS camps.',
      category: 'Department Rubric',
      fileSize: '850 KB PDF'
    },
    {
      title: 'Certificate Format Verification Standard',
      desc: 'Acceptable formats for online MOOC certifications (Coursera, NPTEL, edX) and sports certificates.',
      category: 'Verification Standard',
      fileSize: '540 KB PDF'
    },
    {
      title: 'NSS Social Outreach Documentation Guide',
      desc: 'Templates for logging community outreach hours and obtaining supervisor signatures.',
      category: 'Social Service',
      fileSize: '620 KB PDF'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="pb-4 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Student Resources & Guidelines
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official guidelines, scoring rubrics, and activity point manuals for students at {COLLEGE_INFO.shortName}.
          </p>
        </div>

        {/* AICTE Criteria Summary Box */}
        <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
            <Award className="w-4 h-4 text-blue-600" />
            AICTE Mandatory Activity Point Rule (B.Tech Regular: 100 Points | Lateral Entry: 75 Points)
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every regular student is required to earn a minimum of 100 activity points through extracurricular, co-curricular,
            and social initiatives throughout the 4 years of engineering studies. These points are verified by department coordinators
            and submitted to the exam registrar for graduation eligibility.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {guidelines.map((item, idx) => (
            <div key={idx} className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
              <div>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {item.category}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-2">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">{item.fileSize}</span>
                <button
                  onClick={() => alert(`Downloading ${item.title}`)}
                  className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
