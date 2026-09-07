import React, { useState } from 'react';
import { Share2, Copy, Check, X, Globe, Lock } from 'lucide-react';
import type { ShareLinkDetails } from '../../types/assessment';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareDetails: ShareLinkDetails | null;
  assessmentTitle: string;
}

export const ShareLinkModal: React.FC<ShareLinkModalProps> = ({
  isOpen,
  onClose,
  shareDetails,
  assessmentTitle,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !shareDetails) return null;

  const fullUrl = `${window.location.origin}${shareDetails.publicUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-lectura-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl border border-lectura-slate-200 w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-lectura-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-lectura-blue-600 text-white rounded-2xl shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-lectura-slate-900">Share Student Test Link</h2>
              <p className="text-xs text-lectura-slate-500 font-medium truncate max-w-xs">{assessmentTitle}</p>
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

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2 p-3 bg-blue-50/70 border border-blue-200 text-blue-800 rounded-2xl text-xs font-semibold">
            <Globe className="w-4 h-4 text-lectura-blue-600 flex-shrink-0" />
            <span>Students can open this link on any device to take the test. No student account required.</span>
          </div>

          {/* Shareable Link Box */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-lectura-slate-700 uppercase tracking-wider">
              Public Assessment URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={fullUrl}
                className="w-full px-4 py-3 bg-lectura-slate-50 border border-lectura-slate-200 rounded-2xl text-xs font-bold text-lectura-slate-800 select-all focus:bg-white"
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`px-4 py-3 font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2 flex-shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-lectura-blue-600 hover:bg-lectura-blue-700 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-lectura-slate-50 rounded-2xl border border-lectura-slate-200/80 text-xs">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-lectura-slate-500" />
              <div>
                <p className="font-bold text-lectura-slate-900">Public Access Status</p>
                <p className="text-lectura-slate-500 font-medium">Link is active and accepting student submissions</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 font-extrabold rounded-full text-[11px]">
              Active
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-lectura-slate-100 bg-lectura-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-lectura-blue-600 hover:bg-lectura-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
