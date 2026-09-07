import React, { useState } from 'react';
import { ClipboardList, Plus, FileDown, Share2, FileSpreadsheet } from 'lucide-react';
import { ShareLinkModal } from '../components/assessment/ShareLinkModal';
import { assessmentApi } from '../api/assessmentApi';
import type { ShareLinkDetails } from '../types/assessment';
import { Link } from 'react-router-dom';

export const AssessmentsPage: React.FC = () => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedShareDetails, setSelectedShareDetails] = useState<ShareLinkDetails | null>(null);
  const [selectedTitle, setSelectedTitle] = useState('');

  const assessments = [
    { id: 'ASM-2026-01', realGuid: '11111111-1111-1111-1111-111111111111', title: 'Computer Architecture Midterm Examination 2026', questions: 50, duration: '60 Mins', status: 'Published', date: '2026-09-15' },
    { id: 'ASM-2026-02', realGuid: '22222222-2222-2222-2222-222222222222', title: 'Distributed Systems Quiz 3', questions: 15, duration: '30 Mins', status: 'Published', date: '2026-09-20' },
    { id: 'ASM-2026-03', realGuid: '33333333-3333-3333-3333-333333333333', title: 'Cloud Infrastructure Final Assessment Paper', questions: 75, duration: '180 Mins', status: 'Archived', date: '2026-08-10' },
  ];

  const handleShareClick = async (a: (typeof assessments)[0]) => {
    setSelectedTitle(a.title);
    try {
      const details = await assessmentApi.generateShareLink(a.realGuid, true);
      setSelectedShareDetails(details);
    } catch {
      setSelectedShareDetails({
        assessmentId: a.realGuid,
        shareToken: `demo-${a.id.toLowerCase()}`,
        publicUrl: `/test/demo-${a.id.toLowerCase()}`,
        isPublicAccessEnabled: true,
      });
    }
    setShareModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-lectura-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-green-100 text-green-700 rounded-xl">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-lectura-slate-900 tracking-tight">Assessments & Exams</h1>
          </div>
          <p className="text-sm text-lectura-slate-500 font-medium mt-1">
            Create, share student test links, and view student score reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/score-reports"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all text-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" /> Student Score Reports
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition-all text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create New Assessment
          </button>
        </div>
      </div>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {assessments.map((a) => (
          <div key={a.id} className="bg-white p-6 rounded-3xl border border-lectura-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between hover:border-lectura-blue-300 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-lectura-slate-500">{a.id}</span>
                <span
                  className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    a.status === 'Published'
                      ? 'bg-green-100 text-green-700'
                      : a.status === 'Drafting'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-lectura-slate-100 text-lectura-slate-700'
                  }`}
                >
                  {a.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-lectura-slate-900 leading-tight">{a.title}</h3>
              <p className="text-xs text-lectura-slate-500 font-medium">
                {a.questions} Questions • {a.duration}
              </p>
            </div>

            <div className="pt-3 border-t border-lectura-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => handleShareClick(a)}
                className="text-lectura-blue-600 hover:text-lectura-blue-800 font-extrabold flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-lectura-blue-600" /> Share Link
              </button>

              <button
                type="button"
                className="text-lectura-slate-600 hover:text-lectura-slate-900 font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <FileDown className="w-4 h-4" /> Export Paper
              </button>
            </div>
          </div>
        ))}
      </div>

      <ShareLinkModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareDetails={selectedShareDetails}
        assessmentTitle={selectedTitle}
      />
    </div>
  );
};
