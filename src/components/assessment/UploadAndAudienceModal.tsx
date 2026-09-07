import React, { useState } from 'react';
import { Upload, X, Sparkles, BookOpen, Layers, Users, Calendar, AlertCircle } from 'lucide-react';
import type { AudienceContext } from '../../types/assessment';

interface UploadAndAudienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (file: File, context: AudienceContext) => void;
}

export const UploadAndAudienceModal: React.FC<UploadAndAudienceModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [assessmentName, setAssessmentName] = useState('');
  const [targetAudience, setTargetAudience] = useState('Undergraduate');
  const [targetAgeRange, setTargetAgeRange] = useState('18-22 years');
  const [targetComplexity, setTargetComplexity] = useState('Intermediate');
  const [targetPrerequisites, setTargetPrerequisites] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMsg('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assessmentName.trim()) {
      setErrorMsg('Please enter an Assessment Name/Title.');
      return;
    }
    if (!selectedFile) {
      setErrorMsg('Please select a course document file (PDF, DOCX, TXT).');
      return;
    }

    onUploadSuccess(selectedFile, {
      assessmentName: assessmentName.trim(),
      targetAudience,
      targetAgeRange,
      targetComplexity,
      targetPrerequisites: targetPrerequisites.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-lectura-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-lectura-slate-200 w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-lectura-slate-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-lectura-blue-600 text-white rounded-2xl shadow-md">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-lectura-slate-900">Upload Course Material & Audience Bounds</h2>
              <p className="text-xs text-lectura-slate-500 font-medium">Define your test title and guide AI boundaries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-lectura-slate-400 hover:text-lectura-slate-700 rounded-xl hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMsg && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Assessment Name */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-lectura-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-lectura-blue-600" /> Assessment / Test Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={assessmentName}
              onChange={(e) => setAssessmentName(e.target.value)}
              placeholder="e.g. CS101 Mid-Semester Continuous Assessment"
              className="w-full px-4 py-3 bg-lectura-slate-50 border border-lectura-slate-200 rounded-2xl text-sm font-semibold focus:bg-white focus:border-lectura-blue-600 focus:ring-2 focus:ring-lectura-blue-150 transition-all"
            />
          </div>

          {/* File Upload Zone */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-lectura-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-lectura-blue-600" /> Select Document File <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-lectura-slate-300 hover:border-lectura-blue-500 bg-lectura-slate-50/50 rounded-2xl p-6 text-center space-y-3 transition-colors relative">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="w-12 h-12 bg-blue-100 text-lectura-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-lectura-slate-900">
                  {selectedFile ? selectedFile.name : 'Click to select or drop file here'}
                </p>
                <p className="text-xs text-lectura-slate-500 mt-1">Supports PDF, DOCX, TXT (Max 50MB)</p>
              </div>
            </div>
          </div>

          {/* Audience Demographic Questions (4 Factors) */}
          <div className="bg-lectura-slate-50/80 p-5 rounded-2xl border border-lectura-slate-200 space-y-4">
            <h3 className="text-xs font-extrabold text-lectura-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" /> Target Audience & Demographic Limits (AI Guidance)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Factor 1: Audience Level */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-lectura-slate-600">1. Target Audience Level</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-lectura-slate-200 rounded-xl text-xs font-semibold text-lectura-slate-800"
                >
                  <option value="Primary School">Primary School</option>
                  <option value="High School / Secondary">High School / Secondary</option>
                  <option value="Undergraduate">Undergraduate (University/Polytechnic)</option>
                  <option value="Postgraduate">Postgraduate (Masters/PhD)</option>
                  <option value="Executive / Professional">Executive / Professional</option>
                </select>
              </div>

              {/* Factor 2: Target Age Range */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-lectura-slate-600 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-lectura-slate-400" /> 2. Target Age Range
                </label>
                <select
                  value={targetAgeRange}
                  onChange={(e) => setTargetAgeRange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-lectura-slate-200 rounded-xl text-xs font-semibold text-lectura-slate-800"
                >
                  <option value="10-14 years">10-14 years</option>
                  <option value="15-18 years">15-18 years</option>
                  <option value="18-22 years">18-22 years</option>
                  <option value="23-30 years">23-30 years</option>
                  <option value="30+ years / Adult Learners">30+ years / Adult Learners</option>
                </select>
              </div>

              {/* Factor 3: Cognitive Complexity */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-lectura-slate-600 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-lectura-slate-400" /> 3. Cognitive Complexity Level
                </label>
                <select
                  value={targetComplexity}
                  onChange={(e) => setTargetComplexity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-lectura-slate-200 rounded-xl text-xs font-semibold text-lectura-slate-800"
                >
                  <option value="Introductory / Foundational">Introductory / Foundational</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced / Specialist">Advanced / Specialist</option>
                </select>
              </div>

              {/* Factor 4: Prerequisites & Restrictions */}
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-[11px] font-bold text-lectura-slate-600">
                  4. Scope Constraints & Special Audience Guidelines (Optional)
                </label>
                <textarea
                  rows={2}
                  value={targetPrerequisites}
                  onChange={(e) => setTargetPrerequisites(e.target.value)}
                  placeholder="e.g. Focus on practical applications. Avoid advanced calculus or non-introductory jargon."
                  className="w-full px-3.5 py-2 bg-white border border-lectura-slate-200 rounded-xl text-xs font-medium focus:border-lectura-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-lectura-slate-100 hover:bg-lectura-slate-200 text-lectura-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Save Material & Audience Context
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
