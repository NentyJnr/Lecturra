import React, { useState, useEffect } from 'react';
import { Award, Download, Search, Filter, Users, CheckCircle, FileSpreadsheet, Loader2 } from 'lucide-react';
import { assessmentApi } from '../api/assessmentApi';
import type { StudentSubmissionSummary } from '../types/assessment';

export const ScoreReportsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<StudentSubmissionSummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  const loadData = () => {
    setIsLoading(true);
    assessmentApi
      .getStudentSubmissionsReport(selectedAssessmentId || undefined, searchQuery || undefined, 1, 50)
      .then((data) => {
        setSubmissions(data.items);
        setTotalCount(data.totalCount);
      })
      .catch((err) => {
        console.error('Failed to load score reports', err);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [selectedAssessmentId, searchQuery]);

  const handleExportCsv = async () => {
    if (!selectedAssessmentId) {
      alert('Please select a specific Test / Assessment from the dropdown to export its score report.');
      return;
    }
    setIsExporting(true);
    try {
      const blob = await assessmentApi.exportStudentSubmissionsCsv(selectedAssessmentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Student_Score_Report_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Failed to export score report.');
    } finally {
      setIsExporting(false);
    }
  };

  // Stats calculation
  const avgPercentage =
    submissions.length > 0
      ? Math.round(submissions.reduce((acc, curr) => acc + curr.percentage, 0) / submissions.length)
      : 0;

  const passCount = submissions.filter((s) => ['A', 'B', 'C'].includes(s.grade)).length;
  const passRate = submissions.length > 0 ? Math.round((passCount / submissions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-lectura-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-lectura-slate-900 tracking-tight">Student Score Reports</h1>
          </div>
          <p className="text-sm text-lectura-slate-500 font-medium mt-1">
            Track student test attempts, AI auto-graded scores, and export result sheets.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          disabled={isExporting || !selectedAssessmentId}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md transition-all text-sm cursor-pointer disabled:opacity-50"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Download CSV Score Sheet
        </button>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-lectura-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-lectura-blue-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-lectura-slate-500 uppercase tracking-wider">Total Submissions</p>
            <p className="text-2xl font-black text-lectura-slate-900">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-lectura-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-lectura-slate-500 uppercase tracking-wider">Average Score</p>
            <p className="text-2xl font-black text-purple-600">{avgPercentage}%</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-lectura-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-lectura-slate-500 uppercase tracking-wider">Pass Rate (A-C)</p>
            <p className="text-2xl font-black text-emerald-600">{passRate}%</p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-lectura-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-lectura-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by student name or matric number..."
            className="w-full pl-10 pr-4 py-2.5 bg-lectura-slate-50 border border-lectura-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-lectura-blue-600 focus:ring-2 focus:ring-lectura-blue-150 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-lectura-slate-400" />
          <select
            value={selectedAssessmentId}
            onChange={(e) => setSelectedAssessmentId(e.target.value)}
            className="px-3.5 py-2.5 bg-lectura-slate-50 border border-lectura-slate-200 rounded-xl text-xs font-bold text-lectura-slate-700 focus:bg-white cursor-pointer"
          >
            <option value="">All Filtered Tests</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-lectura-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-lectura-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-lectura-blue-600 mb-2" />
            <p className="text-xs font-bold">Loading student submission data...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center text-lectura-slate-500">
            <Users className="w-8 h-8 text-lectura-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-lectura-slate-800">No student submissions recorded yet</p>
            <p className="text-xs text-lectura-slate-500 mt-1">Share an assessment link with your students to start receiving attempts.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-lectura-slate-50 border-b border-lectura-slate-100 text-lectura-slate-500 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Matric / Student ID</th>
                  <th className="px-6 py-4">Assessment Title</th>
                  <th className="px-6 py-4 text-center">Score</th>
                  <th className="px-6 py-4 text-center">Percentage</th>
                  <th className="px-6 py-4 text-center">Grade</th>
                  <th className="px-6 py-4 text-right">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lectura-slate-100 font-medium">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-lectura-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-lectura-slate-900">{sub.studentName}</td>
                    <td className="px-6 py-4 text-lectura-slate-600 font-mono">{sub.matricNumber || '—'}</td>
                    <td className="px-6 py-4 font-semibold text-lectura-blue-600">{sub.assessmentTitle}</td>
                    <td className="px-6 py-4 text-center font-bold text-lectura-slate-900">
                      {sub.totalScore} / {sub.maxScore}
                    </td>
                    <td className="px-6 py-4 text-center font-black text-lectura-blue-600">{sub.percentage}%</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 font-extrabold rounded-full text-[11px] ${
                          ['A', 'B'].includes(sub.grade)
                            ? 'bg-emerald-100 text-emerald-700'
                            : ['C', 'D'].includes(sub.grade)
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {sub.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-lectura-slate-500 font-semibold">
                      {new Date(sub.submittedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
