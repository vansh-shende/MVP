import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  X
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useActivity } from '../../context/ActivityContext';
import { ActivityCategory, ActivityLevel, ActivityRole } from '../../types';

interface FormErrors {
  title?: string;
  category?: string;
  level?: string;
  date?: string;
  organizingInstitution?: string;
  role?: string;
  certificate?: string;
}

export const AddActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addSubmission } = useActivity();

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory | ''>('');
  const [level, setLevel] = useState<ActivityLevel | ''>('');
  const [date, setDate] = useState('');
  const [organizingInstitution, setOrganizingInstitution] = useState('');
  const [role, setRole] = useState<ActivityRole | ''>('');
  const [description, setDescription] = useState('');
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [certificateName, setCertificateName] = useState('');
  const [certificateData, setCertificateData] = useState<string>('');
  const [certificateFileType, setCertificateFileType] = useState<string>('');

  // Validation & Submission States
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  const categoryOptions: ActivityCategory[] = [
    'Hackathon',
    'Technical Workshop',
    'Coding Contest',
    'Green Campus',
    'Sports',
    'Cultural',
    'Other'
  ];

  const levelOptions: ActivityLevel[] = [
    'College',
    'State',
    'National',
    'International'
  ];

  const roleOptions: ActivityRole[] = [
    'Participant',
    'Winner',
    'Organizer'
  ];

  // File Upload Handler with 5MB restriction and PDF/JPG/PNG validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|jpg|jpeg|png)$/i)) {
      setErrors((prev) => ({
        ...prev,
        certificate: 'Only PDF, JPG, and PNG files are allowed.'
      }));
      setCertificateFile(null);
      setCertificateName('');
      setCertificateData('');
      setCertificateFileType('');
      return;
    }

    if (file.size > maxSizeBytes) {
      setErrors((prev) => ({
        ...prev,
        certificate: 'File size exceeds maximum limit of 5MB.'
      }));
      setCertificateFile(null);
      setCertificateName('');
      setCertificateData('');
      setCertificateFileType('');
      return;
    }

    // Valid file - read into Data URL for persistent faculty review
    setErrors((prev) => {
      const next = { ...prev };
      delete next.certificate;
      return next;
    });
    setCertificateFile(file);
    setCertificateName(file.name);

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const detectedType = isPdf ? 'application/pdf' : (file.type || 'image/png');
    setCertificateFileType(detectedType);

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!isPdf && file.type.startsWith('image/')) {
        // Optimize image resolution to keep localStorage performant
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimized = canvas.toDataURL('image/jpeg', 0.85);
            setCertificateData(optimized);
          } else {
            setCertificateData(rawDataUrl);
          }
        };
        img.onerror = () => {
          setCertificateData(rawDataUrl);
        };
        img.src = rawDataUrl;
      } else {
        setCertificateData(rawDataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Activity Title is required.';
    }

    if (!category) {
      newErrors.category = 'Please select a Category.';
    }

    if (!level) {
      newErrors.level = 'Please select a Level.';
    }

    if (!date) {
      newErrors.date = 'Date is required.';
    }

    if (!organizingInstitution.trim()) {
      newErrors.organizingInstitution = 'Organizing Institution is required.';
    }

    if (!role) {
      newErrors.role = 'Please select a Role.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Save to localStorage via ActivityContext
    addSubmission({
      studentId: currentUser?.id || 'std-103',
      studentName: currentUser?.name || 'Vansh Shende',
      studentRoll: currentUser?.rollNumber || 'IT202208',
      studentDept: currentUser?.department || 'Information Technology (IT)',
      studentYear: currentUser?.year || '3rd Year',
      branch: currentUser?.department || 'Information Technology (IT)',
      title: title.trim(),
      category,
      level,
      date,
      organizingInstitution: organizingInstitution.trim(),
      role,
      description: description.trim(),
      certificateName: certificateName || (certificateFile ? certificateFile.name : 'Certificate.pdf'),
      certificateFileName: certificateName || (certificateFile ? certificateFile.name : 'Certificate.pdf'),
      certificateFileType: certificateFileType || (certificateFile ? certificateFile.type : (certificateName.endsWith('.pdf') ? 'application/pdf' : 'image/png')),
      certificateData: certificateData || ''
    });

    setSuccessMessage('Activity submitted successfully.');

    // Navigate to My Submissions after brief feedback
    setTimeout(() => {
      navigate('/student/submissions');
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D9E0E7]">
          <div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/student/dashboard')}
                className="text-[#65758B] hover:text-[#0B2945] transition-colors p-1 -ml-1 rounded-[4px]"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0B2945]">
                Add Activity / Achievement
              </h1>
            </div>
            <p className="text-xs sm:text-[13px] text-[#65758B] mt-0.5 ml-8">
              Add details of an activity, achievement or participation record for departmental review.
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3.5 bg-[#EAF5EE] border border-[#C6E7D5] rounded-[5px] flex items-center gap-2.5 text-[#287A55] text-xs sm:text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#287A55] shrink-0" />
            <span>{successMessage} Redirecting to My Submissions...</span>
          </div>
        )}

        {/* College Form (Clean institutional style: input height 42-44px, 4-6px radius, labels above) */}
        <form onSubmit={handleSubmit} className="bg-white rounded-[6px] border border-[#D9E0E7] p-5 sm:p-7 space-y-4">
          {/* Field: Activity Title */}
          <div>
            <label className="block text-[13px] font-medium text-[#243447] mb-1.5">
              Activity Title <span className="text-[#B33A3A]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="e.g. Web Development Workshop, Code Rush Hackathon"
              className={`w-full h-[42px] px-3 bg-white border rounded-[5px] text-xs sm:text-sm text-[#243447] placeholder-[#65758B] focus:outline-hidden transition-colors ${
                errors.title
                  ? 'border-[#B33A3A] focus:border-[#B33A3A]'
                  : 'border-[#D9E0E7] focus:border-[#123B63]'
              }`}
            />
            {errors.title && (
              <p className="text-[11px] text-[#B33A3A] mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Grid: Category and Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Field: Category */}
            <div>
              <label className="block text-[13px] font-medium text-[#243447] mb-1.5">
                Category <span className="text-[#B33A3A]">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as ActivityCategory);
                  if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
                }}
                className={`w-full h-[42px] px-3 bg-white border rounded-[5px] text-xs sm:text-sm text-[#243447] focus:outline-hidden transition-colors ${
                  errors.category
                    ? 'border-[#B33A3A] focus:border-[#B33A3A]'
                    : 'border-[#D9E0E7] focus:border-[#123B63]'
                }`}
              >
                <option value="">Select Category</option>
                {categoryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-[11px] text-[#B33A3A] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Field: Level */}
            <div>
              <label className="block text-[13px] font-medium text-[#243447] mb-1.5">
                Level <span className="text-[#B33A3A]">*</span>
              </label>
              <select
                value={level}
                onChange={(e) => {
                  setLevel(e.target.value as ActivityLevel);
                  if (errors.level) setErrors((prev) => ({ ...prev, level: undefined }));
                }}
                className={`w-full h-[42px] px-3 bg-white border rounded-[5px] text-xs sm:text-sm text-[#243447] focus:outline-hidden transition-colors ${
                  errors.level
                    ? 'border-[#B33A3A] focus:border-[#B33A3A]'
                    : 'border-[#D9E0E7] focus:border-[#123B63]'
                }`}
              >
                <option value="">Select Level</option>
                {levelOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.level && (
                <p className="text-[11px] text-[#B33A3A] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.level}
                </p>
              )}
            </div>
          </div>

          {/* Grid: Date and Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Field: Date */}
            <div>
              <label className="block text-[13px] font-medium text-[#243447] mb-1.5">
                Date <span className="text-[#B33A3A]">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
                }}
                className={`w-full h-[42px] px-3 bg-white border rounded-[5px] text-xs sm:text-sm text-[#243447] focus:outline-hidden transition-colors ${
                  errors.date
                    ? 'border-[#B33A3A] focus:border-[#B33A3A]'
                    : 'border-[#D9E0E7] focus:border-[#123B63]'
                }`}
              />
              {errors.date && (
                <p className="text-[11px] text-[#B33A3A] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.date}
                </p>
              )}
            </div>

            {/* Field: Role */}
            <div>
              <label className="block text-[13px] font-medium text-[#243447] mb-1.5">
                Role <span className="text-[#B33A3A]">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value as ActivityRole);
                  if (errors.role) setErrors((prev) => ({ ...prev, role: undefined }));
                }}
                className={`w-full h-[42px] px-3 bg-white border rounded-[5px] text-xs sm:text-sm text-[#243447] focus:outline-hidden transition-colors ${
                  errors.role
                    ? 'border-[#B33A3A] focus:border-[#B33A3A]'
                    : 'border-[#D9E0E7] focus:border-[#123B63]'
                }`}
              >
                <option value="">Select Role</option>
                {roleOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="text-[11px] text-[#B33A3A] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.role}
                </p>
              )}
            </div>
          </div>

          {/* Field: Organizing Institution */}
          <div>
            <label className="block text-[13px] font-medium text-[#243447] mb-1.5">
              Organizing Institution <span className="text-[#B33A3A]">*</span>
            </label>
            <input
              type="text"
              value={organizingInstitution}
              onChange={(e) => {
                setOrganizingInstitution(e.target.value);
                if (errors.organizingInstitution) {
                  setErrors((prev) => ({ ...prev, organizingInstitution: undefined }));
                }
              }}
              placeholder="e.g. KITS Ramtek, Dept of IT"
              className={`w-full h-[42px] px-3 bg-white border rounded-[5px] text-xs sm:text-sm text-[#243447] placeholder-[#65758B] focus:outline-hidden transition-colors ${
                errors.organizingInstitution
                  ? 'border-[#B33A3A] focus:border-[#B33A3A]'
                  : 'border-[#D9E0E7] focus:border-[#123B63]'
              }`}
            />
            {errors.organizingInstitution && (
              <p className="text-[11px] text-[#B33A3A] mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.organizingInstitution}
              </p>
            )}
          </div>

          {/* Field: Description (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[13px] font-medium text-[#243447]">
                Description
              </label>
              <span className="text-[11px] text-[#65758B]">Optional</span>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief details regarding event participation, score, or project topic..."
              className="w-full p-3 bg-white border border-[#D9E0E7] rounded-[5px] text-xs sm:text-sm text-[#243447] placeholder-[#65758B] focus:outline-hidden focus:border-[#123B63] transition-colors"
            />
          </div>

          {/* Field: Certificate / Proof (Optional, max 5MB, PDF/JPG/PNG) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[13px] font-medium text-[#243447]">
                Certificate / Proof
              </label>
              <span className="text-[11px] text-[#65758B]">Optional (PDF, JPG, PNG up to 5MB)</span>
            </div>

            <div className="border border-[#D9E0E7] bg-[#F5F7F9] rounded-[5px] p-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[4px] bg-[#EAF2F8] text-[#123B63] flex items-center justify-center shrink-0">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#243447]">
                      {certificateName || 'Attach certificate proof document'}
                    </p>
                    <p className="text-[11px] text-[#65758B]">
                      {certificateFile
                        ? `${(certificateFile.size / (1024 * 1024)).toFixed(2)} MB`
                        : 'PDF, JPG, PNG format'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {certificateName && (
                    <button
                      type="button"
                      onClick={() => {
                        setCertificateFile(null);
                        setCertificateName('');
                        setCertificateData('');
                        setCertificateFileType('');
                      }}
                      className="p-1 text-[#65758B] hover:text-[#B33A3A]"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <label className="cursor-pointer px-3 py-1.5 bg-white hover:bg-[#F5F7F9] border border-[#D9E0E7] rounded-[5px] text-xs font-semibold text-[#123B63] transition-colors">
                    Browse File
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {errors.certificate && (
                <p className="text-[11px] text-[#B33A3A] mt-2 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.certificate}
                </p>
              )}
            </div>
          </div>

          {/* Form Actions: Slightly square institutional buttons (5-6px radius) */}
          <div className="pt-3 border-t border-[#D9E0E7] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/student/dashboard')}
              className="px-4 py-2 text-xs font-semibold text-[#243447] bg-white border border-[#D9E0E7] rounded-[5px] hover:bg-[#F5F7F9] transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#123B63] hover:bg-[#0B2945] rounded-[5px] transition-colors"
            >
              Submit Activity
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
