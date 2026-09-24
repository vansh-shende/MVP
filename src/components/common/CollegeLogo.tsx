import React, { useState } from 'react';
import { Landmark } from 'lucide-react';

interface CollegeLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const CollegeLogo: React.FC<CollegeLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);

  const emblemSizes = {
    sm: 'h-9 w-auto max-w-[48px]',
    md: 'h-10 w-auto max-w-[56px]',
    lg: 'h-12 w-auto max-w-[68px]',
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex items-center justify-center shrink-0 ${emblemSizes[size]}`}>
        {!imgError ? (
          <img
            src="/kits/kits-emblem.png"
            alt="KITS Ramtek Official Emblem"
            className="h-full w-auto object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-9 h-9 rounded-[4px] bg-[#123B63] text-white flex items-center justify-center">
            <Landmark className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
          </div>
        )}
      </div>
      <div className="leading-tight">
        <div className="flex items-center gap-2">
          <span className={`font-bold tracking-tight text-[#0B2945] ${titleSizes[size]}`}>
            KITS Ramtek
          </span>
        </div>
        {showSubtitle && (
          <p className="text-[11px] sm:text-[12px] text-[#65758B] font-medium mt-0.5">
            Student Activity & Achievement Portal
          </p>
        )}
      </div>
    </div>
  );
};

