import React from 'react';
import {
  X,
  FileText,
  Calendar,
  User,
  Building,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Download,
  GraduationCap
} from 'lucide-react';
import { ActivitySubmission } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface ProofPreviewModalProps {
  submission: ActivitySubmission | null;
  onClose: () => void;
}

export const ProofPreviewModal: React.FC<ProofPreviewModalProps> = ({ submission, onClose }) => {
  if (!submission) return null;

  // Resolve certificate document URL and format
  const getCertificateInfo = () => {
    let url = submission.certificateData || '';
    const fileName = submission.certificateFileName || submission.certificateName || submission.proofFileName || 'Certificate.pdf';
    let fileType = submission.certificateFileType || '';

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
  const isRejected = submission.status === 'Rejected';
  const remarkText = submission.facultyRemarks || submission.teacherRemark || submission.rejectionReason;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0B2945]/50 overflow-y-auto">
      <div className="bg-white rounded-[8px] shadow-xl max-w-3xl w-full max-h-[94vh] flex flex-col border border-[#D9E0E7] my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#D9E0E7] bg-[#F5F7F9] shrink-0">
          <div>
            <span className="text-[11px] font-bold text-[#65758B] uppercase tracking-wider">
              {submission.category || submission.type} · Submission Record
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#0B2945] mt-0.5">{submission.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[4px] text-[#65758B] hover:text-[#0B2945] hover:bg-[#D9E0E7]/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-[#F5F7F9] rounded-[6px] border border-[#D9E0E7]">
            <div>
              <p className="text-[#65758B] font-medium">Student</p>
              <p className="font-semibold text-[#0B2945] mt-0.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#65758B]" />
                {submission.studentName || 'Vansh Shende'}
              </p>
            </div>
            <div>
              <p className="text-[#65758B] font-medium">Branch / Year</p>
              <p className="font-semibold text-[#0B2945] mt-0.5 flex items-center gap-1 truncate">
                <GraduationCap className="w-3.5 h-3.5 text-[#65758B] shrink-0" />
                {submission.branch || submission.studentDept || 'Information Technology (IT)'}
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

          {/* Proof Certificate Preview */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-[#D9E0E7]">
              <div>
                <h4 className="text-[11px] font-bold text-[#65758B] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#123B63]" />
                  Uploaded Proof Document: <span className="text-[#0B2945] normal-case ml-1 font-bold">{certFileName}</span>
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#EAF2F8] text-[#123B63] border border-[#D9E0E7] rounded-[5px] font-semibold text-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Document
                </a>
                <a
                  href={certificateUrl}
                  download={certFileName}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#EAF2F8] text-[#123B63] border border-[#D9E0E7] rounded-[5px] font-semibold text-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
              </div>
            </div>

            {/* Visual Canvas / Embedded View */}
            <div className="border border-[#D9E0E7] bg-white rounded-[5px] overflow-hidden">
              {isPdf ? (
                <div className="w-full flex flex-col items-center">
                  <iframe
                    src={certificateUrl}
                    title="Certificate Document Preview"
                    className="w-full h-[440px] sm:h-[480px] border-0 bg-slate-50"
                  />
                  <div className="w-full py-2 px-3 bg-[#F5F7F9] border-t border-[#D9E0E7] flex items-center justify-between text-[11px] text-[#65758B]">
                    <span>PDF Document: {certFileName}</span>
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
                <div className="p-3 text-center bg-[#F8FAFC]">
                  <img
                    src={certificateUrl}
                    alt={`Certificate for ${submission.title}`}
                    className="max-w-full max-h-[460px] object-contain mx-auto rounded border border-[#D9E0E7] shadow-sm bg-white p-2"
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

          {/* Faculty Remarks if present */}
          {remarkText && (
            <div className={`p-3.5 rounded-[5px] border ${isRejected ? 'bg-[#FDF2F2] border-[#F7C8C8]' : 'bg-[#EAF5EE] border-[#C6E7D5]'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-semibold flex items-center gap-1.5 ${isRejected ? 'text-[#B33A3A]' : 'text-[#287A55]'}`}>
                  {isRejected ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  {isRejected ? 'Faculty Rejection Reason' : 'Faculty Evaluation Remarks'}
                </span>
                {submission.activityPoints && (
                  <span className="text-[11px] font-bold text-[#287A55] bg-white border border-[#C6E7D5] px-2 py-0.5 rounded-[3px]">
                    +{submission.activityPoints} Activity Points
                  </span>
                )}
              </div>
              <p className="text-xs text-[#243447] mt-1">{remarkText}</p>
              <p className="text-[11px] text-[#65758B] mt-1.5">
                Reviewed by: <strong>{submission.reviewedBy || 'Mrs. Harshita Jain'}</strong> on {submission.reviewedAt || 'Recent'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#D9E0E7] bg-[#F5F7F9] flex justify-end shrink-0">
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
