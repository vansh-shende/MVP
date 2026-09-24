import React from 'react';
import { X, Award, FileText, Calendar, User, Building, CheckCircle2 } from 'lucide-react';
import { ActivitySubmission } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface ProofPreviewModalProps {
  submission: ActivitySubmission | null;
  onClose: () => void;
}

export const ProofPreviewModal: React.FC<ProofPreviewModalProps> = ({ submission, onClose }) => {
  if (!submission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2945]/40">
      <div className="bg-white rounded-[6px] shadow-md max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col border border-[#D9E0E7]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#D9E0E7] bg-[#F5F7F9]">
          <div>
            <span className="text-[11px] font-bold text-[#65758B] uppercase tracking-wider">
              {submission.category || submission.type} · Verification Record
            </span>
            <h3 className="text-base font-bold text-[#0B2945] mt-0.5">{submission.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[4px] text-[#65758B] hover:text-[#0B2945] hover:bg-[#D9E0E7]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-[#F5F7F9] rounded-[5px] border border-[#D9E0E7]">
            <div>
              <p className="text-[#65758B] font-medium">Student</p>
              <p className="font-semibold text-[#0B2945] mt-0.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#65758B]" />
                {submission.studentName || 'Student'}
              </p>
            </div>
            <div>
              <p className="text-[#65758B] font-medium">Organizer / Host</p>
              <p className="font-semibold text-[#0B2945] mt-0.5 flex items-center gap-1 truncate">
                <Building className="w-3.5 h-3.5 text-[#65758B] shrink-0" />
                {submission.organizingInstitution || submission.eventOrOrg || 'KITS Ramtek'}
              </p>
            </div>
            <div>
              <p className="text-[#65758B] font-medium">Date</p>
              <p className="font-semibold text-[#0B2945] mt-0.5 flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#65758B]" />
                {submission.date || submission.dateCompleted || submission.dateSubmitted}
              </p>
            </div>
            <div>
              <p className="text-[#65758B] font-medium">Status</p>
              <div className="mt-1">
                <StatusBadge status={submission.status} />
              </div>
            </div>
          </div>

          {/* Description */}
          {submission.description && (
            <div>
              <h4 className="text-[11px] font-bold text-[#65758B] uppercase tracking-wider mb-1.5">
                Activity Details
              </h4>
              <p className="text-xs text-[#243447] bg-[#F5F7F9] p-3 rounded-[4px] border border-[#D9E0E7] leading-relaxed">
                {submission.description}
              </p>
            </div>
          )}

          {/* Proof Certificate Preview Canvas */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-bold text-[#65758B] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#123B63]" />
                Proof Document ({submission.certificateName || submission.proofFileName || 'Certificate.pdf'})
              </h4>
              <span className="text-[11px] text-[#65758B] bg-[#F5F7F9] border border-[#D9E0E7] px-2 py-0.5 rounded-[3px]">
                Official Record
              </span>
            </div>

            {/* Institutional Certificate Preview Panel */}
            <div className="border border-[#D9E0E7] bg-white rounded-[5px] p-5 text-center">
              <div className="max-w-md mx-auto py-2 space-y-2.5">
                <div className="w-10 h-10 mx-auto rounded-[4px] bg-[#EAF2F8] text-[#123B63] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-[#0B2945] text-sm">Certificate of Participation & Completion</h5>
                <p className="text-xs text-[#65758B]">
                  This record certifies that <strong className="text-[#0B2945]">{submission.studentName || 'Student'}</strong> (Roll: {submission.studentRoll || 'ITXXXX'})
                  has completed
                </p>
                <p className="text-xs font-semibold text-[#123B63] bg-[#EAF2F8] py-1 px-2.5 rounded-[4px] border border-[#D9E0E7] inline-block">
                  {submission.title} — {submission.organizingInstitution || submission.eventOrOrg || 'KITS Ramtek'}
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-[#D9E0E7] text-[11px] text-[#65758B]">
                  <span>Date: {submission.date || submission.dateCompleted || submission.dateSubmitted}</span>
                  <span className="font-mono text-[10px]">ID: {submission.id.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Faculty Remarks if present */}
          {(submission.facultyRemarks || submission.teacherRemark) && (
            <div className={`p-3.5 rounded-[5px] border ${submission.status === 'Rejected' ? 'bg-[#FDF2F2] border-[#F7C8C8]' : 'bg-[#EAF5EE] border-[#C6E7D5]'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-semibold flex items-center gap-1.5 ${submission.status === 'Rejected' ? 'text-[#B33A3A]' : 'text-[#287A55]'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                  Faculty Evaluation Remarks
                </span>
                {submission.activityPoints && (
                  <span className="text-[11px] font-bold text-[#287A55] bg-white border border-[#C6E7D5] px-2 py-0.5 rounded-[3px]">
                    +{submission.activityPoints} Activity Points
                  </span>
                )}
              </div>
              <p className="text-xs text-[#243447] mt-1">{submission.teacherRemark || submission.facultyRemarks}</p>
              {submission.reviewedBy && (
                <p className="text-[11px] text-[#65758B] mt-1.5">
                  Reviewed by: <strong>{submission.reviewedBy}</strong> on {submission.reviewedAt || 'Recently'}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#D9E0E7] bg-[#F5F7F9] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-[#243447] bg-white border border-[#D9E0E7] hover:bg-[#F5F7F9] rounded-[5px] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
