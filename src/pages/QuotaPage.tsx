import React from 'react';
import { CreditCard, Zap } from 'lucide-react';

export const QuotaPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-lectura-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-lectura-slate-900 tracking-tight">Quota & Usage Analytics</h1>
          </div>
          <p className="text-sm text-lectura-slate-500 font-medium mt-1">
            Track AI extraction credits, document processing metrics, and institutional package quota.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition-all text-sm cursor-pointer"
        >
          <Zap className="w-4 h-4" /> Top Up Quota
        </button>
      </div>

      {/* Quota Metric Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-lectura-slate-200/80 shadow-xs space-y-2">
          <span className="text-xs font-bold text-lectura-slate-500 uppercase tracking-wider">Available Credit Quota</span>
          <p className="text-3xl font-extrabold text-lectura-slate-900">3,580 Units</p>
          <p className="text-xs font-semibold text-green-600">82% of Monthly Allocated Credit</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-lectura-slate-200/80 shadow-xs space-y-2">
          <span className="text-xs font-bold text-lectura-slate-500 uppercase tracking-wider">Questions Generated This Month</span>
          <p className="text-3xl font-extrabold text-lectura-slate-900">1,420 Items</p>
          <p className="text-xs font-semibold text-blue-600">+18% Efficiency Increase</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-lectura-slate-200/80 shadow-xs space-y-2">
          <span className="text-xs font-bold text-lectura-slate-500 uppercase tracking-wider">Institution Tier</span>
          <p className="text-3xl font-extrabold text-purple-700">Enterprise Faculty</p>
          <p className="text-xs font-semibold text-lectura-slate-500">University of Oxford License</p>
        </div>
      </div>

      {/* Recent Usage Log */}
      <div className="bg-white rounded-3xl border border-lectura-slate-200/80 p-6 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-lectura-slate-900">Quota Usage Log</h2>
        <div className="space-y-3 text-xs">
          {[
            { action: 'AI Question Generation - Slide Deck 4.pdf', cost: '-48 Units', date: '2026-09-01 09:12' },
            { action: 'AI Ingestion - Distributed Systems Syllabus.docx', cost: '-20 Units', date: '2026-08-31 16:45' },
            { action: 'Institutional Quota Renewal', cost: '+5,000 Units', date: '2026-08-25 00:00', isCredit: true },
          ].map((log, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-lectura-slate-50 rounded-2xl border border-lectura-slate-200/60 font-semibold">
              <div>
                <p className="text-lectura-slate-900 font-bold">{log.action}</p>
                <p className="text-lectura-slate-500 font-medium text-[11px]">{log.date}</p>
              </div>

              <span className={`font-extrabold text-sm ${log.isCredit ? 'text-green-600' : 'text-lectura-slate-800'}`}>
                {log.cost}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
