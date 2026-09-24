import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  Award,
  AlertCircle,
  ExternalLink,
  Download,
  Calendar,
  Building,
  GraduationCap
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
  const [remark, setRemark] = useState(
    submission?.facultyRemarks || submission?.teacherRemark || submission?.rejectionReason || ''
  );
  const [remarkError, setRemarkError] = useState('');

  if (!submission) return null;

  // Resolve certificate document URL and determine whether it's PDF or image
  const getCertificateInfo = () => {
    let url = submission.certificateData || '';
    const fileName = submission.certificateFileName || submission.certificateName || submission.proofFileName || 'Certificate.pdf';
    let fileType = submission.certificateFileType || '';

    // If no direct data is present, match with demo certificates
    if (!url) {
      if (fileName.toLowerCase().endsWith('.pdf')) {
        url = '/certificates/sample-certificate.pdf';
        fileType = 'application/pdf';
      } else if (submission.category === 'Hackathon' || submission.title?.toLowerCase().includes('hackathon') || submission.title?.toLowerCase().includes('code')) {
        url = '/certificates/demo-certificate-hackathon.png';
        fileType = 'image/png';
      } else if (submission.title?.toLowerCase().includes('ai') || submission.title?.toLowerCase().includes('machine learning')) {
        url = '/certificates/demo-certificate-aiml.png';
        fileType = 'image/png';
      } else if (submission.title?.toLowerCase().includes('embedded') || submission.title?.toLowerCase().includes('iot')) {
        url = '/certificates/demo-certificate-embedded.png';
        fileType = 'image/png';
      } else if (submission.title?.toLowerCase().includes('quiz')) {
        url = '/certificates/demo-certificate-quiz.png';
        fileType = 'image/png';
      } else {
        url = '/certificates/demo-certificate-workshop.png';
        fileType = 'image/png';
      }
    }

    const isPdf = fileType === 'application/pdf' ||
      url.startsWith('data:application/pdf') ||
      url.toLowerCase().endsWith('.pdf') ||
      fileName.toLowerCase().endsWith('.pdf');

    return { url, fileName, isPdf };
  };

  const { url: certificateUrl, fileName: certFileName, isPdf } = getCertificateInfo();

  const handleApprove = () => {
    const finalRemark = remark.trim() || 'Verified and approved by Faculty Reviewer Mrs. Harshita Jain.';
    onVerify(submission.id, 'Approved', finalRemark, 25, 'Mrs. Harshita Jain');
    onClose();
  };

  const handleReject = () => {
    if (!remark.trim()) {
      setRemarkError('Please enter a rejection reason (e.g. "Certificate details could not be verified.") before rejecting.');
      return;
    }
    setRemarkError('');
    onVerify(submission.id, 'Rejected', remark.trim(), 0, 'Mrs. Harshita Jain');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0B2945]/50 overflow-y-auto">
      <div className="bg-white rounded-[8px] shadow-xl max-w-3xl w-full max-h-[94vh] flex flex-col border border-[#D9E0E7] my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#D9E0E7] bg-[#F5F7F9] shrink-0">
          <div>
            <span className="text-[11px] font-bold text-[#123B63] uppercase tracking-wider">
              Faculty Reviewer: Mrs. Harshita Jain
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#0B2945] mt-0.5">
              Submission Review: {submission.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-[4px] text-[#65758B] hover:text-[#0B2945] hover:bg-[#D9E0E7]/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Section 1: Student Information */}
          <div className="p-4 bg-[#F5F7F9] rounded-[6px] border border-[#D9E0E7]">
            <h4 className="font-bold text-[#0B2945] uppercase tracking-wider text-[11px] mb-2.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#123B63]" />
              Student Profile
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div>
                <p className="text-[#65758B] font-medium">Student Name</p>
                <p className="font-bold text-[#0B2945] mt-0.5 text-xs sm:text-[13px]">
                  {submission.studentName}
                </p>
              </div>
              <div>
                <p className="text-[#65758B] font-medium">Year</p>
                <p className="font-semibold text-[#0B2945] mt-0.5 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-[#65758B]" />
                  {submission.studentYear || '3rd Year'}
                </p>
              </div>
              <div>
                <p className="text-[#65758B] font-medium">Branch</p>
                <p className="font-semibold text-[#0B2945] mt-0.5">
                  {submission.branch || submission.studentDept || 'Information Technology (IT)'}
                </p>
              </div>
              <div>
                <p className="text-[#65758B] font-medium">Roll Number</p>
                <p className="font-semibold text-[#0B2945] mt-0.5 font-mono">
                  {submission.studentRoll || 'ITXXXX'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Activity Details */}
          <div className="p-4 bg-white rounded-[6px] border border-[#D9E0E7] space-y-3">
            <h4 className="font-bold text-[#0B2945] uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#123B63]" />
              Activity Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <p className="text-[#65758B] font-medium">Activity Title</p>
                <p className="font-bold text-[#0B2945] text-xs sm:text-[13px] mt-0.5">
                  {submission.title}
                </p>
              </div>
              <div>
                <p className="text-[#65758B] font-medium">Category</p>
                <p className="mt-0.5">
                  <span className="inline-block px-2 py-0.5 rounded-[4px] bg-[#EAF2F8] border border-[#D9E0E7] text-[#123B63] font-semibold text-[11px]">
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#D9E0E7]">
              <div>
                <p className="text-[#65758B] font-medium">Organization / Host</p>
                <p className="font-semibold text-[#0B2945] mt-0.5 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-[#65758B] shrink-0" />
                  {submission.organizingInstitution || submission.eventOrOrg || 'KITS Ramtek'}
                </p>
              </div>
              <div>
                <p className="text-[#65758B] font-medium">Event Date</p>
                <p className="font-semibold text-[#0B2945] mt-0.5 font-mono flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#65758B]" />
                  {submission.date || submission.dateSubmitted || '12 Aug 2026'}
                </p>
              </div>
              <div>
                <p className="text-[#65758B] font-medium">Submission Date</p>
                <p className="font-semibold text-[#0B2945] mt-0.5 font-mono">
                  {submission.submittedAt || submission.dateSubmitted || submission.date}
                </p>
              </div>
            </div>

            {submission.description && (
              <div className="pt-2 border-t border-[#D9E0E7]">
                <p className="text-[#65758B] font-medium mb-1">Description</p>
                <p className="p-3 bg-[#F5F7F9] rounded-[4px] text-[#243447] leading-relaxed border border-[#D9E0E7]">
                  {submission.description}
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Certificate / Supporting Document (VISUAL PREVIEW) */}
          <div className="p-4 bg-[#F5F7F9] rounded-[6px] border border-[#D9E0E7] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#D9E0E7]">
              <div>
                <h4 className="font-bold text-[#0B2945] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#123B63]" />
                  Certificate / Supporting Document
                </h4>
                <p className="text-[11px] text-[#65758B] mt-0.5">
                  Attached file: <span className="font-semibold text-[#0B2945]">{certFileName}</span>
                  <span className="ml-2 px-1.5 py-0.5 bg-white border border-[#D9E0E7] rounded text-[10px] font-mono">
                    {isPdf ? 'PDF Document' : 'Image Document'}
                  </span>
                </p>
              </div>

              {/* Action Buttons: [ View / Open Document ] and [ Download ] */}
              <div className="flex items-center gap-2">
                <a
                  href={certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#EAF2F8] text-[#123B63] border border-[#D9E0E7] rounded-[5px] font-semibold text-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Document
                </a>
                <a
                  href={certificateUrl}
                  download={certFileName}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#EAF2F8] text-[#123B63] border border-[#D9E0E7] rounded-[5px] font-semibold text-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
              </div>
            </div>

            {/* FULL SIZE VISIBLE CERTIFICATE PREVIEW CONTAINER */}
            <div className="bg-white rounded-[5px] border border-[#D9E0E7] overflow-hidden">
              {isPdf ? (
                /* PDF Embedded Viewer */
                <div className="w-full flex flex-col items-center">
                  <iframe
                    src={certificateUrl}
                    title="Certificate PDF Document Preview"
                    className="w-full h-[460px] sm:h-[520px] border-0 bg-slate-50"
                  />
                  <div className="w-full py-2 px-3 bg-[#F5F7F9] border-t border-[#D9E0E7] flex items-center justify-between text-[11px] text-[#65758B]">
                    <span>PDF Certificate Document: {certFileName}</span>
                    <a
                      href={certificateUrl}
                      download={certFileName}
                      className="text-[#123B63] font-semibold hover:underline"
                    >
                      Download PDF
                    </a>
                  </div>
                </div>
              ) : (
                /* High-Res Image Preview */
                <div className="p-3 text-center bg-[#F8FAFC]">
                  <img
                    src={certificateUrl}
                    alt={`Certificate for ${submission.title}`}
                    className="max-w-full max-h-[500px] object-contain mx-auto rounded border border-[#D9E0E7] shadow-sm bg-white p-2"
                  />
                  <div className="mt-2 text-[11px] text-[#65758B] flex items-center justify-between px-2">
                    <span>Certificate Image: {certFileName}</span>
                    <a
                      href={certificateUrl}
                      download={certFileName}
                      className="text-[#123B63] font-semibold hover:underline"
                    >
                      Download Image
                    </a>
                  </div>
                </div>
              )}
            </div>
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
              placeholder="e.g. Verified and approved. Or explain rejection reasons (e.g. 'Certificate details could not be verified.')..."
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

        {/* Modal Footer Actions: Approve (green), Reject (red outline), Close */}
        <div className="px-5 py-3 border-t border-[#D9E0E7] bg-[#F5F7F9] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#243447] bg-white border border-[#D9E0E7] rounded-[5px] hover:bg-[#F5F7F9] transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2.5">
            {/* Reject Button */}
            <button
              type="button"
              onClick={handleReject}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#B33A3A] bg-white hover:bg-[#FDF2F2] border border-[#B33A3A] rounded-[5px] transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              Reject
            </button>

            {/* Approve Button */}
            <button
              type="button"
              onClick={handleApprove}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#287A55] hover:bg-[#1E5C40] rounded-[5px] transition-colors shadow-xs"
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
