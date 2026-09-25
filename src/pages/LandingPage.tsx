import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  GraduationCap,
  FileCheck2,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronRight,
  BookOpen,
  Calendar,
  Layers,
  FileText,
  AlertCircle,
  ExternalLink,
  X
} from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { PublicFooter } from '../components/layout/PublicFooter';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsStudent, loginAsTeacher } = useAuth();
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F9] flex flex-col text-[#243447]">
      <PublicNavbar />

      {/* 1. Institutional Hero Section with Real KITS Campus Aerial View */}
      <section className="bg-white border-b border-[#D9E0E7] py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAF2F8] border border-[#D9E0E7] rounded-[4px] text-xs font-semibold text-[#123B63]">
                <img
                  src="/kits/kits-emblem.png"
                  alt="KITS Emblem"
                  className="h-4 w-auto object-contain"
                />
                <span className="tracking-wide uppercase text-[11px] sm:text-xs">
                  KAVIKULGURU INSTITUTE OF TECHNOLOGY AND SCIENCE, RAMTEK
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-[#0B2945] tracking-tight leading-tight">
                Student Activity & Achievement Portal
              </h1>

              <p className="text-sm sm:text-base text-[#65758B] leading-relaxed max-w-2xl">
                Manage student activities, achievements and certificates in one place. Faculty can review and verify submitted records.
              </p>

              {/* Institutional Key Accreditation Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#65758B]">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F5F7F9] border border-[#D9E0E7] rounded-[4px] font-medium text-[#0B2945]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#287A55]" />
                  NAAC &apos;A&apos; Grade Accredited
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F5F7F9] border border-[#D9E0E7] rounded-[4px] font-medium text-[#0B2945]">
                  Approved by AICTE, New Delhi
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F5F7F9] border border-[#D9E0E7] rounded-[4px] font-medium text-[#0B2945]">
                  Affiliated to RTM Nagpur University
                </span>
              </div>

              {/* Action Buttons: Institutional rectangular styling (4-6px radius) */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={handleLoginClick}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#123B63] hover:bg-[#0B2945] rounded-[5px] transition-colors inline-flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  Login to Portal
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#123B63] bg-white hover:bg-[#F5F7F9] rounded-[5px] border border-[#D9E0E7] transition-colors cursor-pointer"
                >
                  How It Works
                </button>

                <button
                  onClick={() => setShowGuidelinesModal(true)}
                  className="px-4 py-2.5 text-xs sm:text-sm font-medium text-[#65758B] hover:text-[#0B2945] transition-colors cursor-pointer"
                >
                  Submission Guidelines →
                </button>
              </div>
            </div>

            {/* Right: REAL KITS RAMTEK CAMPUS IMAGE (Aerial / Infrastructure photograph) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-[6px] border border-[#D9E0E7] overflow-hidden shadow-xs">
                <div className="relative aspect-16/10 w-full bg-[#EAF2F8] overflow-hidden">
                  <img
                    src="/kits/kits-campus-aerial.png"
                    alt="Kavikulguru Institute of Technology & Science Campus Aerial View"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-[#0B2945]/90 text-white text-[11px] font-medium px-2 py-0.5 rounded-[4px] border border-white/20">
                    KITS Ramtek Campus
                  </div>
                </div>
                <div className="p-3 bg-[#F5F7F9] border-t border-[#D9E0E7]">
                  <p className="text-[11px] sm:text-xs text-[#243447] font-medium leading-snug">
                    Kavikulguru Institute of Technology & Science, Ramtek
                  </p>
                  <p className="text-[11px] text-[#65758B] mt-0.5">
                    50-acre campus with academic blocks, labs, and student facilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About the Portal Section (Two-column: Image on Left + Info on Right) */}
      <section id="about" className="py-12 bg-[#F5F7F9] border-b border-[#D9E0E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Real KITS Campus Main Building Photo */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-[6px] border border-[#D9E0E7] overflow-hidden shadow-xs">
                <div className="relative aspect-16/11 w-full bg-[#EAF2F8] overflow-hidden">
                  <img
                    src="/kits/kits-campus-main.jpg"
                    alt="KITS Ramtek Main Administrative and Academic Block"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 bg-white border-t border-[#D9E0E7]">
                  <p className="text-xs font-semibold text-[#0B2945]">
                    Administrative & Academic Block · KITS Ramtek
                  </p>
                  <p className="text-[11px] text-[#65758B] mt-0.5">
                    Established in 1985 by Vodithala Education Society
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Institutional About Copy */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-block text-xs font-bold uppercase tracking-wider text-[#123B63]">
                INSTITUTIONAL DIGITAL REPOSITORY
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold text-[#0B2945] tracking-tight">
                About the Portal
              </h2>

              <p className="text-sm sm:text-[15px] text-[#243447] leading-relaxed">
                Manage student activities, achievements and certificates in one place. Faculty can review and verify submitted records.
              </p>

              {/* Three Institutional Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white border border-[#D9E0E7] rounded-[5px] p-3.5 space-y-1">
                  <FileCheck2 className="w-4 h-4 text-[#123B63]" />
                  <h4 className="text-xs font-semibold text-[#0B2945]">Unified Record</h4>
                  <p className="text-[11px] text-[#65758B] leading-normal">
                    Central record for technical, sports, cultural, and academic events.
                  </p>
                </div>

                <div className="bg-white border border-[#D9E0E7] rounded-[5px] p-3.5 space-y-1">
                  <Clock className="w-4 h-4 text-[#A66A00]" />
                  <h4 className="text-xs font-semibold text-[#0B2945]">Faculty Review</h4>
                  <p className="text-[11px] text-[#65758B] leading-normal">
                    Department faculty verify uploaded documents and record remarks.
                  </p>
                </div>

                <div className="bg-white border border-[#D9E0E7] rounded-[5px] p-3.5 space-y-1">
                  <CheckCircle className="w-4 h-4 text-[#287A55]" />
                  <h4 className="text-xs font-semibold text-[#0B2945]">Verified Portfolio</h4>
                  <p className="text-[11px] text-[#65758B] leading-normal">
                    Official records for academic appraisals, NAAC data, and placements.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowGuidelinesModal(true)}
                  className="px-4 py-2 text-xs font-semibold text-[#123B63] bg-white hover:bg-[#F5F7F9] rounded-[5px] border border-[#D9E0E7] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  View Portal Guidelines
                </button>

                <button
                  onClick={handleLoginClick}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#123B63] hover:bg-[#0B2945] rounded-[5px] transition-colors cursor-pointer"
                >
                  Enter Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section (01 Submit, 02 Review, 03 Verify) */}
      <section id="how-it-works" className="py-12 bg-white border-b border-[#D9E0E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#123B63]">
              PROCEDURAL WORKFLOW
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#0B2945] mt-1">How It Works</h2>
            <p className="text-xs sm:text-sm text-[#65758B] mt-1">
              Three simple steps to submit and verify student records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 01: Submit */}
            <div className="bg-[#F5F7F9] border border-[#D9E0E7] rounded-[5px] p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#123B63] bg-[#EAF2F8] px-2.5 py-1 rounded-[4px] border border-[#D9E0E7]">
                  01 Submit
                </span>
                <span className="text-[11px] font-medium text-[#65758B]">Step 1 of 3</span>
              </div>
              <h3 className="text-sm font-semibold text-[#0B2945] pt-1">
                Add activity details
              </h3>
              <p className="text-xs text-[#65758B] leading-relaxed">
                Enter activity details and upload supporting certificates or documents.
              </p>
            </div>

            {/* Step 02: Review */}
            <div className="bg-[#F5F7F9] border border-[#D9E0E7] rounded-[5px] p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#A66A00] bg-[#FEF7EB] px-2.5 py-1 rounded-[4px] border border-[#F6DFC0]">
                  02 Review
                </span>
                <span className="text-[11px] font-medium text-[#65758B]">Step 2 of 3</span>
              </div>
              <h3 className="text-sm font-semibold text-[#0B2945] pt-1">
                Faculty verification
              </h3>
              <p className="text-xs text-[#65758B] leading-relaxed">
                Department faculty verify document authenticity and enter remarks.
              </p>
            </div>

            {/* Step 03: Verify */}
            <div className="bg-[#F5F7F9] border border-[#D9E0E7] rounded-[5px] p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#287A55] bg-[#EAF5EE] px-2.5 py-1 rounded-[4px] border border-[#C6E7D5]">
                  03 Verify
                </span>
                <span className="text-[11px] font-medium text-[#65758B]">Step 3 of 3</span>
              </div>
              <h3 className="text-sm font-semibold text-[#0B2945] pt-1">
                Verified portfolio
              </h3>
              <p className="text-xs text-[#65758B] leading-relaxed">
                Approved records are saved to the student profile for appraisals and reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Student Activities at KITS (Four Areas) */}
      <section id="activities" className="py-12 bg-[#F5F7F9] border-b border-[#D9E0E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#123B63]">
              CO-CURRICULAR & EXTRA-CURRICULAR
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#0B2945] mt-1">
              Student Activities at KITS
            </h2>
            <p className="text-xs sm:text-sm text-[#65758B] mt-1">
              Activity categories tracked in the portal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Area 1: Technical Activities */}
            <div className="bg-white border border-[#D9E0E7] rounded-[5px] p-5 space-y-2.5">
              <div className="w-8 h-8 rounded-[4px] bg-[#EAF2F8] text-[#123B63] flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#0B2945]">Technical Activities</h3>
              <p className="text-xs text-[#65758B] leading-relaxed">
                Workshops, hackathons, coding contests, project presentations, and seminars.
              </p>
              <div className="pt-1 text-[11px] text-[#123B63] font-medium border-t border-[#D9E0E7]">
                Competitions & Workshops
              </div>
            </div>

            {/* Area 2: Clubs & Forums */}
            <div className="bg-white border border-[#D9E0E7] rounded-[5px] p-5 space-y-2.5">
              <div className="w-8 h-8 rounded-[4px] bg-[#EAF2F8] text-[#123B63] flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#0B2945]">Clubs & Forums</h3>
              <p className="text-xs text-[#65758B] leading-relaxed">
                Department student forums, CSI, ISTE, IEEE, and campus technical clubs.
              </p>
              <div className="pt-1 text-[11px] text-[#123B63] font-medium border-t border-[#D9E0E7]">
                Student Chapters & Forums
              </div>
            </div>

            {/* Area 3: Sports & Cultural */}
            <div className="bg-white border border-[#D9E0E7] rounded-[5px] p-5 space-y-2.5">
              <div className="w-8 h-8 rounded-[4px] bg-[#EAF2F8] text-[#123B63] flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#0B2945]">Sports & Cultural</h3>
              <p className="text-xs text-[#65758B] leading-relaxed">
                Annual festivals, university sports tournaments, cultural events, and NSS.
              </p>
              <div className="pt-1 text-[11px] text-[#123B63] font-medium border-t border-[#D9E0E7]">
                Sports & Cultural Gatherings
              </div>
            </div>

            {/* Area 4: Research & Innovation */}
            <div className="bg-white border border-[#D9E0E7] rounded-[5px] p-5 space-y-2.5">
              <div className="w-8 h-8 rounded-[4px] bg-[#EAF2F8] text-[#123B63] flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#0B2945]">Research & Innovation</h3>
              <p className="text-xs text-[#65758B] leading-relaxed">
                Student publications, conference presentations, patents, and internships.
              </p>
              <div className="pt-1 text-[11px] text-[#123B63] font-medium border-t border-[#D9E0E7]">
                Publications & Patents
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Campus Activities & Events Gallery (Real Photos from KITS Ramtek) */}
      <section id="events" className="py-12 bg-white border-b border-[#D9E0E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#123B63]">
                CAMPUS HIGHLIGHTS
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#0B2945] mt-1">
                Campus Activities & Events
              </h2>
              <p className="text-xs sm:text-sm text-[#65758B] mt-1">
                Student events and co-curricular programs at KITS Ramtek.
              </p>
            </div>
            <a
              href="https://kits.edu"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-[#123B63] hover:text-[#0B2945] inline-flex items-center gap-1 shrink-0"
            >
              Visit kits.edu
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Event Photo 1: SOFFI Technical Fest */}
            <div className="bg-[#F5F7F9] border border-[#D9E0E7] rounded-[5px] overflow-hidden">
              <div className="aspect-16/10 w-full overflow-hidden bg-slate-200">
                <img
                  src="/kits/kits-event-soffi.jpg"
                  alt="SOFFI Technical Festival at KITS Ramtek"
                  className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#123B63] bg-[#EAF2F8] px-1.5 py-0.5 rounded-[3px]">
                  Technical Fest
                </span>
                <h4 className="text-xs font-semibold text-[#0B2945] mt-1">
                  SOFFI National Symposium
                </h4>
                <p className="text-[11px] text-[#65758B] mt-0.5">
                  Annual technical symposium with coding and robotics events.
                </p>
              </div>
            </div>

            {/* Event Photo 2: Annual Gathering & Cultural Day */}
            <div className="bg-[#F5F7F9] border border-[#D9E0E7] rounded-[5px] overflow-hidden">
              <div className="aspect-16/10 w-full overflow-hidden bg-slate-200">
                <img
                  src="/kits/kits-event-annual.jpg"
                  alt="Annual Day Function Celebrations at KITS Ramtek"
                  className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#287A55] bg-[#EAF5EE] px-1.5 py-0.5 rounded-[3px]">
                  Cultural
                </span>
                <h4 className="text-xs font-semibold text-[#0B2945] mt-1">
                  Annual Day Celebrations
                </h4>
                <p className="text-[11px] text-[#65758B] mt-0.5">
                  Annual college gathering featuring cultural and student events.
                </p>
              </div>
            </div>

            {/* Event Photo 3: Republic Day & Institutional Events */}
            <div className="bg-[#F5F7F9] border border-[#D9E0E7] rounded-[5px] overflow-hidden">
              <div className="aspect-16/10 w-full overflow-hidden bg-slate-200">
                <img
                  src="/kits/kits-event-republic.jpg"
                  alt="Republic Day Celebrations at KITS Ramtek"
                  className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A66A00] bg-[#FEF7EB] px-1.5 py-0.5 rounded-[3px]">
                  Institutional
                </span>
                <h4 className="text-xs font-semibold text-[#0B2945] mt-1">
                  Republic Day & NCC Parade
                </h4>
                <p className="text-[11px] text-[#65758B] mt-0.5">
                  National day celebrations and student parade.
                </p>
              </div>
            </div>

            {/* Event Photo 4: Alumni Meet & Industry Interaction */}
            <div className="bg-[#F5F7F9] border border-[#D9E0E7] rounded-[5px] overflow-hidden">
              <div className="aspect-16/10 w-full overflow-hidden bg-slate-200">
                <img
                  src="/kits/kits-event-alumni.jpg"
                  alt="Alumni Meet at KITS Ramtek"
                  className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#123B63] bg-[#EAF2F8] px-1.5 py-0.5 rounded-[3px]">
                  Alumni & Career
                </span>
                <h4 className="text-xs font-semibold text-[#0B2945] mt-1">
                  Alumni Meet & Mentorship
                </h4>
                <p className="text-[11px] text-[#65758B] mt-0.5">
                  Alumni interaction and student mentoring sessions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Portal Facilities / Modules Section */}
      <section id="features" className="py-12 bg-[#F5F7F9] border-b border-[#D9E0E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#123B63]">
              PORTAL MODULES
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#0B2945] mt-1">
              Stakeholder Portals
            </h2>
            <p className="text-xs sm:text-sm text-[#65758B] mt-1">
              Dedicated access for students and faculty.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Student Module */}
            <div className="bg-white border border-[#D9E0E7] rounded-[5px] p-6 space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-[4px] bg-[#EAF2F8] text-[#123B63] flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-[#0B2945]">Student Portal</h3>
              <p className="text-xs text-[#65758B] leading-relaxed">
                Submit activities, upload certificates, and track verification status.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    loginAsStudent();
                    navigate('/student/dashboard');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#123B63] hover:bg-[#0B2945] rounded-[4px] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  Access Student Portal
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Faculty Module */}
            <div className="bg-white border border-[#D9E0E7] rounded-[5px] p-6 space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-[4px] bg-[#EAF2F8] text-[#123B63] flex items-center justify-center font-bold">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-[#0B2945]">Faculty Verification Desk</h3>
              <p className="text-xs text-[#65758B] leading-relaxed">
                Review pending student submissions, inspect certificates, and approve records.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    loginAsTeacher();
                    navigate('/teacher/dashboard');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-[#123B63] bg-[#EAF2F8] hover:bg-[#D9E0E7] border border-[#D9E0E7] rounded-[4px] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  Access Faculty Portal
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Latest Portal Notices / Updates (Administrative List) */}
      <section id="updates" className="py-12 bg-white border-b border-[#D9E0E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#123B63]">
                ADMINISTRATIVE NOTICES
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#0B2945] mt-1">
                Latest Portal Updates
              </h2>
              <p className="text-xs sm:text-sm text-[#65758B] mt-1">
                Notices and submission schedules for Academic Year 2025–26.
              </p>
            </div>
            <span className="text-[11px] font-medium text-[#65758B] bg-[#F5F7F9] px-2.5 py-1 rounded-[4px] border border-[#D9E0E7] self-start sm:self-auto">
              Academic Year: 2025–2026
            </span>
          </div>

          <div className="border border-[#D9E0E7] rounded-[5px] overflow-hidden bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7F9] border-b border-[#D9E0E7] text-[#0B2945] font-semibold">
                <tr>
                  <th className="py-2.5 px-4 w-32">Date</th>
                  <th className="py-2.5 px-4">Subject / Notification</th>
                  <th className="py-2.5 px-4 w-28 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E0E7] text-[#243447]">
                <tr className="hover:bg-[#F5F7F9]/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-[#65758B]">25 Sept 2026</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#0B2945]">Student Activity Submission Open</span>
                    <p className="text-[#65758B] mt-0.5">
                      Submissions for the current academic session are now open.
                    </p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-block text-[11px] font-semibold text-[#287A55] bg-[#EAF5EE] border border-[#C6E7D5] px-2 py-0.5 rounded-[3px]">
                      Active
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-[#F5F7F9]/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-[#65758B]">20 Sept 2026</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#0B2945]">Faculty Verification Guidelines Issued</span>
                    <p className="text-[#65758B] mt-0.5">
                      Updated verification guidelines for technical and co-curricular credits.
                    </p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-block text-[11px] font-semibold text-[#123B63] bg-[#EAF2F8] border border-[#D9E0E7] px-2 py-0.5 rounded-[3px]">
                      Notice
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-[#F5F7F9]/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-[#65758B]">15 Sept 2026</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#0B2945]">Digital Certificate Verification Enabled</span>
                    <p className="text-[#65758B] mt-0.5">
                      Support for PDF and image document previews is active.
                    </p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-block text-[11px] font-semibold text-[#65758B] bg-[#F5F7F9] border border-[#D9E0E7] px-2 py-0.5 rounded-[3px]">
                      General
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 8. Important Institutional Links & Guidelines */}
      <section id="guidelines" className="py-12 bg-[#F5F7F9] border-b border-[#D9E0E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#123B63]">
                DOCUMENTATION
              </span>
              <h2 className="text-xl font-semibold text-[#0B2945]">Portal Guidelines</h2>
              <p className="text-xs text-[#65758B] leading-relaxed">
                Submission rules and accepted document formats for verification.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setShowGuidelinesModal(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#123B63] hover:bg-[#0B2945] rounded-[4px] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Read Full Guidelines
                </button>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-[#D9E0E7] rounded-[5px] p-4 space-y-1.5">
                  <h4 className="text-xs font-semibold text-[#0B2945] flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-[#123B63]" />
                    Acceptable Document Formats
                  </h4>
                  <p className="text-xs text-[#65758B] leading-relaxed">
                    Upload clear PDF, JPG, or PNG files under 5MB with visible name and date.
                  </p>
                </div>

                <div className="bg-white border border-[#D9E0E7] rounded-[5px] p-4 space-y-1.5">
                  <h4 className="text-xs font-semibold text-[#0B2945] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#A66A00]" />
                    Review Timeline
                  </h4>
                  <p className="text-xs text-[#65758B] leading-relaxed">
                    Faculty committees review submissions within 5 to 7 working days.
                  </p>
                </div>

                <div className="bg-white border border-[#D9E0E7] rounded-[5px] p-4 space-y-1.5">
                  <h4 className="text-xs font-semibold text-[#0B2945] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#287A55]" />
                    Integrity Standards
                  </h4>
                  <p className="text-xs text-[#65758B] leading-relaxed">
                    Submitted records must be genuine and verifiable by the institution.
                  </p>
                </div>

                <div className="bg-white border border-[#D9E0E7] rounded-[5px] p-4 space-y-1.5">
                  <h4 className="text-xs font-semibold text-[#0B2945] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#123B63]" />
                    Semester Appraisals
                  </h4>
                  <p className="text-xs text-[#65758B] leading-relaxed">
                    Verified entries count toward academic records, NAAC documentation, and placements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guidelines Modal */}
      {showGuidelinesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[6px] border border-[#D9E0E7] max-w-xl w-full max-h-[85vh] flex flex-col shadow-lg">
            <div className="p-4 border-b border-[#D9E0E7] flex items-center justify-between bg-[#F5F7F9]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#123B63]" />
                <h3 className="text-sm font-bold text-[#0B2945]">Student Activity Submission Guidelines</h3>
              </div>
              <button
                onClick={() => setShowGuidelinesModal(false)}
                className="text-[#65758B] hover:text-[#0B2945] p-1 rounded-[4px]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs text-[#243447] leading-relaxed">
              <div className="space-y-1">
                <h4 className="font-bold text-[#0B2945]">1. General Principles</h4>
                <p className="text-[#65758B]">
                  All activities submitted must correspond to recognized technical, co-curricular, or extra-curricular events participated during the active enrollment period at KITS Ramtek.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-[#0B2945]">2. Verification Proof Requirements</h4>
                <ul className="list-disc list-inside space-y-1 text-[#65758B]">
                  <li>Upload participation or merit certificates issued by organizing institutes.</li>
                  <li>Accepted file types: PDF, JPG, PNG under 5MB size limit.</li>
                  <li>Certificate must clearly indicate candidate name, event title, date, and organizer seal.</li>
                </ul>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-[#0B2945]">3. Categorization Guidance</h4>
                <ul className="list-disc list-inside space-y-1 text-[#65758B]">
                  <li><strong>Technical:</strong> Hackathons, coding contests, technical paper presentations, robotics.</li>
                  <li><strong>Sports:</strong> Inter-collegiate, university, state or national sports tournaments.</li>
                  <li><strong>Cultural:</strong> Music, drama, dance, fine arts, debate competitions.</li>
                  <li><strong>Social / Outreach:</strong> Blood donation, NSS camps, environmental sustainability drives.</li>
                </ul>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-[#0B2945]">4. Review Timeline & Remarks</h4>
                <p className="text-[#65758B]">
                  Faculty evaluators typically process submissions within 5–7 business days. In case of incomplete documentation, the record will be flagged with remarks requesting re-submission.
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-[#D9E0E7] bg-[#F5F7F9] flex justify-end">
              <button
                onClick={() => setShowGuidelinesModal(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#123B63] hover:bg-[#0B2945] rounded-[4px]"
              >
                Close Guidelines
              </button>
            </div>
          </div>
        </div>
      )}

      <PublicFooter />
    </div>
  );
};
