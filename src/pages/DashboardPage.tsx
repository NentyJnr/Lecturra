import React from 'react';
import {
  BookOpenCheck,
  FileText,
  ClipboardList,
  Target,
  Sparkles,
  ArrowUpRight,
  Clock,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useCurrentUserQuery } from '../hooks/useCurrentUser';

export const DashboardPage: React.FC = () => {
  const { data: userProfile } = useCurrentUserQuery();

  const metrics = [
    { title: 'Question Bank Items', value: '6,420', change: '+12% this month', icon: BookOpenCheck, color: 'text-purple-600 bg-purple-50' },
    { title: 'Ingested Documents', value: '148', change: '8 pending AI extraction', icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { title: 'Active Assessments', value: '42', change: '15 active exams', icon: ClipboardList, color: 'text-green-600 bg-green-50' },
    { title: 'Remaining Quota', value: '3,580', change: '82% quota available', icon: Target, color: 'text-indigo-600 bg-indigo-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-lectura-navy-900 via-lectura-blue-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-wide text-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Platform Active</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {userProfile?.title || 'Prof.'} {userProfile?.fullName || 'John Smith'}
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 max-w-2xl font-medium leading-relaxed">
            Manage your academic question bank, ingest lecture materials, build assessments, and track AI processing quotas for {userProfile?.location || 'University of Oxford'}.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-lectura-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-lectura-slate-500 uppercase tracking-wider">{m.title}</span>
                <div className={`p-2.5 rounded-xl ${m.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-lectura-slate-900">{m.value}</p>
                <p className="text-xs font-semibold text-lectura-slate-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                  <span>{m.change}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Modules Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Ingestion Activity */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-lectura-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-lectura-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-lectura-slate-900">Recent Course Document Ingestion</h2>
              <p className="text-xs text-lectura-slate-500 font-medium">Uploaded lecture materials ready for AI question extraction</p>
            </div>
            <a href="/ingestion" className="text-xs font-bold text-lectura-blue-600 hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Advanced Computer Architecture - Slide Deck 4.pdf', status: 'Extracted (48 Questions)', time: '10 mins ago', badge: 'bg-green-100 text-green-700' },
              { title: 'Distributed Systems & Cloud Security Syllabus 2026.docx', status: 'AI Ingestion Completed', time: '1 hour ago', badge: 'bg-blue-100 text-blue-700' },
              { title: 'Quantum Computing Fundamentals Lecture Notes.pdf', status: 'Processing Extraction', time: '3 hours ago', badge: 'bg-yellow-100 text-yellow-800' },
            ].map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 bg-lectura-slate-50 rounded-2xl border border-lectura-slate-200/60">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-lectura-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-lectura-slate-900 truncate max-w-xs sm:max-w-md">{doc.title}</p>
                    <p className="text-[11px] text-lectura-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-lectura-slate-400" /> {doc.time}
                    </p>
                  </div>
                </div>
                <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${doc.badge}`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Faculty Status & System Card */}
        <div className="bg-white rounded-3xl p-6 border border-lectura-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-lectura-slate-100 pb-4">
            <div className="p-2.5 bg-lectura-navy-900 text-white rounded-2xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-lectura-slate-900">Faculty Workspace</h3>
              <p className="text-xs text-lectura-slate-500 font-medium">{userProfile?.location || 'Department of CS'}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-lectura-slate-50 rounded-xl border border-lectura-slate-200/60 flex items-center justify-between">
              <span className="font-semibold text-lectura-slate-600">Verification Status</span>
              <span className="font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-md">Verified Academic</span>
            </div>
            <div className="p-3 bg-lectura-slate-50 rounded-xl border border-lectura-slate-200/60 flex items-center justify-between">
              <span className="font-semibold text-lectura-slate-600">Assessment Engine</span>
              <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">Lectura v2.4 Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
