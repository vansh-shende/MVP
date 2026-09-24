import React from 'react';
import { SubmissionStatus } from '../../types';

interface StatusBadgeProps {
  status: SubmissionStatus;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'Approved':
    case 'Verified':
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-[4px] bg-[#EAF5EE] text-[#287A55] border border-[#C6E7D5]">
          Approved
        </span>
      );
    case 'Pending':
    case 'Under Review':
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-[4px] bg-[#FEF7EB] text-[#A66A00] border border-[#F6DFC0]">
          Pending
        </span>
      );
    case 'Rejected':
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-[4px] bg-[#FDF2F2] text-[#B33A3A] border border-[#F7C8C8]">
          Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-[4px] bg-white text-[#65758B] border border-[#D9E0E7]">
          {status}
        </span>
      );
  }
};
