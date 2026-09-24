import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  Award,
  AlertCircle
} from 'lucide-react';
import { ActivitySubmission, SubmissionStatus } from '../../types';

interface VerificationModalProps {
  submission: ActivitySubmission | null;
  onClose: () => void;
  onVerify: (id: string, status: SubmissionStatus, remarks?: string, points?: number, reviewerName?: string) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  submission,
  onClose,
  onVerify
}) => {
  const [remark, setRemark] = useState(submission?.teacherRemark || '');
  const [remarkError, setRemarkError] = useState('');
  const [showFilePreview, setShowFilePreview] = useState(false);

  if (!submission) return null;

  const handleApprove = () => {
    onVerify(submission.id, 'Approved', remark.trim());
    onClose();
  };

  const handleReject = () => {
    if (!remark.trim()) {
      setRemarkError('Please add a remark before rejecting.');
      return;
    }
    setRemarkError('');
    onVerify(submission.id, 'Rejected', remark.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2945]/40">
      <div className="bg-white rounded-[6px] shadow-md max-w-2xl w-full max-h-[92vh] overflow-y-auto flex flex-col border border-[#D9E0E7]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#D9E0E7] bg-[#F5F7F9]">
          <div>
            <span className="text-[11px] font-bold text-[#65758B] uppercase tracking-wider">
              Faculty Verification Panel
            </span>
            <h3 className="text-base font-bold text-[#0B2945] mt-0.5">
              Review Activity: {submission.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[4px] text-[#65758B] hover:text-[#0B2945] hover:bg-[#D9E0E7]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Section 1: Student Information */}
          <div className="p-3.5 bg-[#F5F7F9] rounded-[5px] border border-[#D9E0E7]">
            <h4 className="font-bold text-[#0B2945] uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#123B63]" />
              Student Information
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <p className="text-[#65758B] font-medium">Name</p>
                <p className="font-semibold text-[#0B2945] mt-0.5 text-xs sm:text-[13px]">
                  {submission.studentName || 'Vansh Shende'}
                </p>
              </div>
              <div>
                <p className="text-[#65758B] font-medium">Department</p>
                <p className="font-semibold text-[#0B2945] mt-0.5">
                  {submission.studentDept || 'Information Technology'}
                </p>
              </div>
              <div>
                <p className="text-[#65758B] font-medium">Semester</p>
                <p className="font-semibold text-[#0B2945] mt-0.5">5th Semester</p>
              </div>
              <div>
                <p className="text-[#65758B] font-medium">Roll Number</p>
                <p className="font-semibold text-[#0B2945] mt-0.5 font-mono">
                  {submission.studentRoll || 'ITXXXX'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Activity Information */}
          <div className="p-3.5 bg-white rounded-[5px] border border-[#D9E0E7] space-y-3">
            <h4 className="font-bold text-[#0B2945] uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#123B63]" />
              Activity Information
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <p className="text-[#65758B] font-medium">Activity Title</p>
                <p className="font-bold text-[#0B2945] text-xs sm:text-[13px] mt-0.5">{submission.title}</p>
              </div>
              <div>
                <p className="text-[#65758B] font-medium">Category</p>
                <p className="font-semibold text-[#0B2945] mt-0.5">
                  <span className="inline-block px-2 py-0.5 rounded-[4px] bg-[#EAF2F8] border border-[#D9E0E7] text-[#123B63] text-[11px]">
                    {submission.category || submission.type || 'Activity'}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-[#65758B] font-medium">Level</p>
                <p className="font-semibold text-[#0B2945] mt-0.5">
                  {submission.level || 'College'}
                </p>
              </div>
              <div>
                <p className="text-[#65758B] font-medium">Date Completed</p>
                <p className="font-semibold text-[#0B2945] mt-0.5 font-mono">
                  {submission.date || submission.dateSubmitted || '12 Aug 2026'}
                </p>
              </div>
              <div>
                <p className="text-[#65758B] font-medium">Organizing Institution</p>
                <p className="font-semibold text-[#0B2945] mt-0.5">
                  {submission.organizingInstitution || submission.eventOrOrg || 'KITS Ramtek'}
                </p>
              </div>
              <div>
                <p className="text-[#65758B] font-medium">Role</p>
                <p className="font-semibold text-[#0B2945] mt-0.5">
                  {submission.role || 'Participant'}
                </p>
              </div>
            </div>

            {submission.description && (
              <div className="pt-2 border-t border-[#D9E0E7]">
                <p className="text-[#65758B] font-medium mb-1">Description</p>
                <p className="p-2.5 bg-[#F5F7F9] rounded-[4px] text-[#243447] leading-relaxed border border-[#D9E0E7]">
                  {submission.description}
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Certificate / Proof */}
          <div className="p-3.5 bg-[#F5F7F9] rounded-[5px] border border-[#D9E0E7]">
            <h4 className="font-bold text-[#0B2945] uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#123B63]" />
              Attached Proof Document
            </h4>

            {submission.certificateName || submission.proofFileName ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 bg-white rounded-[4px] border border-[#D9E0E7]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-[4px] bg-[#EAF2F8] text-[#123B63] flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B2945]">
                      {submission.certificateName || submission.proofFileName}
                    </p>
                    <p className="text-[10px] text-[#65758B]">Uploaded student certificate document</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFilePreview(!showFilePreview)}
                  className="px-2.5 py-1 bg-[#F5F7F9] hover:bg-[#EAF2F8] text-[#123B63] font-semibold rounded-[4px] border border-[#D9E0E7] text-[11px] transition-colors self-start sm:self-auto"
                >
                  {showFilePreview ? 'Hide Preview' : 'Inspect Document'}
                </button>
              </div>
            ) : (
              <p className="text-[#65758B] italic">No certificate uploaded with this submission.</p>
            )}

            {showFilePreview && (
              <div className="mt-2.5 p-3.5 bg-white rounded-[4px] border border-[#D9E0E7] text-center space-y-1.5 animate-in fade-in">
                <FileText className="w-7 h-7 text-[#123B63] mx-auto" />
                <p className="font-bold text-[#0B2945] text-xs">
                  {submission.certificateName || submission.proofFileName}
                </p>
                <p className="text-[11px] text-[#65758B]">
                  Submitted by {submission.studentName || 'Student'} on {submission.submittedAt || submission.dateSubmitted || 'Recent'}.
                </p>
                <span className="inline-block text-[10px] text-[#287A55] bg-[#EAF5EE] px-2 py-0.5 rounded-[3px] border border-[#C6E7D5] font-medium">
                  Document Verified For Evaluation
                </span>
              </div>
            )}
          </div>

          {/* Section 4: Faculty Remark Input */}
          <div className="space-y-1.5 pt-1">
            <label className="block font-medium text-[13px] text-[#243447]">
              Faculty Remark <span className="text-[#65758B] text-xs">(Required if rejecting)</span>
            </label>
            <textarea
              rows={3}
              value={remark}
              onChange={(e) => {
                setRemark(e.target.value);
                if (remarkError) setRemarkError('');
              }}
              placeholder="Add feedback, reasons for approval, or explain corrections needed..."
              className={`w-full p-2.5 bg-white border rounded-[5px] text-[#243447] placeholder-[#65758B] focus:outline-hidden transition-colors ${
                remarkError
                  ? 'border-[#B33A3A] focus:border-[#B33A3A]'
                  : 'border-[#D9E0E7] focus:border-[#123B63]'
              }`}
            />
            {remarkError && (
              <p className="text-[11px] text-[#B33A3A] font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {remarkError}
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer Actions: Approve (green), Reject (red outline), Cancel (secondary) */}
        <div className="px-5 py-3 border-t border-[#D9E0E7] bg-[#F5F7F9] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#243447] bg-white border border-[#D9E0E7] rounded-[5px] hover:bg-[#F5F7F9] transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2.5">
            {/* Reject: Red outlined button */}
            <button
              type="button"
              onClick={handleReject}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#B33A3A] bg-white hover:bg-[#FDF2F2] border border-[#B33A3A] rounded-[5px] transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              Reject
            </button>

            {/* Approve: Dark/medium green button (#287A55) */}
            <button
              type="button"
              onClick={handleApprove}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#287A55] hover:bg-[#1E5C40] rounded-[5px] transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
