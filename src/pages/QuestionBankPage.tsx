import React, { useState } from 'react';
import { BookOpenCheck, Plus, Search, Filter, Tag, CheckCircle2 } from 'lucide-react';

export const QuestionBankPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All Topics');

  const questions = [
    {
      id: 'Q-101',
      title: 'What is the primary difference between RISC and CISC instruction architectures?',
      type: 'Multiple Choice (MCQ)',
      topic: 'Computer Architecture',
      difficulty: 'Medium',
      usageCount: 14,
    },
    {
      id: 'Q-102',
      title: 'Explain the Byzantine Fault Tolerance consensus algorithm in distributed systems.',
      type: 'Essay / Descriptive',
      topic: 'Distributed Systems',
      difficulty: 'Hard',
      usageCount: 9,
    },
    {
      id: 'Q-103',
      title: 'True or False: Cache coherent memory requires hardware write-through policy in multi-core processors.',
      type: 'True / False',
      topic: 'Computer Architecture',
      difficulty: 'Easy',
      usageCount: 22,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-lectura-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <BookOpenCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-lectura-slate-900 tracking-tight">Question Bank</h1>
          </div>
          <p className="text-sm text-lectura-slate-500 font-medium mt-1">
            Manage, categorize, and review your academic question repository (6,420 items).
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition-all text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Question
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-lectura-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-lectura-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions by keyword or topic..."
            className="w-full pl-10 pr-4 py-2.5 bg-lectura-slate-50 border border-lectura-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-lectura-blue-600 focus:ring-2 focus:ring-lectura-blue-150 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-lectura-slate-400" />
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-3.5 py-2.5 bg-lectura-slate-50 border border-lectura-slate-200 rounded-xl text-xs font-bold text-lectura-slate-700 focus:bg-white cursor-pointer"
          >
            <option value="All Topics">All Topics</option>
            <option value="Computer Architecture">Computer Architecture</option>
            <option value="Distributed Systems">Distributed Systems</option>
            <option value="Software Engineering">Software Engineering</option>
          </select>
        </div>
      </div>

      {/* Question List */}
      <div className="bg-white rounded-3xl border border-lectura-slate-200/80 shadow-xs divide-y divide-lectura-slate-100 overflow-hidden">
        {questions.map((q) => (
          <div key={q.id} className="p-5 hover:bg-lectura-slate-50/60 transition-colors space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-lectura-slate-500">
                  <span className="bg-lectura-slate-100 px-2 py-0.5 rounded-md text-lectura-slate-700">{q.id}</span>
                  <span>•</span>
                  <span className="text-lectura-blue-600">{q.type}</span>
                </div>
                <h3 className="text-base font-bold text-lectura-slate-900 leading-snug">{q.title}</h3>
              </div>

              <span
                className={`text-[11px] font-extrabold px-3 py-1 rounded-full flex-shrink-0 ${
                  q.difficulty === 'Easy'
                    ? 'bg-green-100 text-green-700'
                    : q.difficulty === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {q.difficulty}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-lectura-slate-500 font-medium pt-1">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-lectura-slate-400" /> Topic: <strong>{q.topic}</strong>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Used in {q.usageCount} exams
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
