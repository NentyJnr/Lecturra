import React, { useState, useEffect } from 'react';
import { BookOpen, CheckSquare, Square, Clock, Percent, Sparkles, X, Loader2, Filter } from 'lucide-react';
import type { GenerationConfig } from '../../types/assessment';

interface TopicSelectionAndConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentTitle: string;
  extractedTopics: string[];
  isLoadingTopics: boolean;
  onGenerate: (config: GenerationConfig) => void;
}

export const TopicSelectionAndConfigModal: React.FC<TopicSelectionAndConfigModalProps> = ({
  isOpen,
  onClose,
  documentId,
  documentTitle,
  extractedTopics,
  isLoadingTopics,
  onGenerate,
}) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(15);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [trueFalsePercentage, setTrueFalsePercentage] = useState(10);
  const [targetDistribution] = useState('Understand');
  const [targetDifficulty] = useState('Medium');

  useEffect(() => {
    if (extractedTopics && extractedTopics.length > 0) {
      setSelectedTopics([...extractedTopics]);
    }
  }, [extractedTopics]);

  if (!isOpen) return null;

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const selectAllTopics = () => {
    setSelectedTopics([...extractedTopics]);
  };

  const clearAllTopics = () => {
    setSelectedTopics([]);
  };

  const handleGenerateClick = () => {
    const mcqPercentage = Math.max(0, 100 - trueFalsePercentage);

    onGenerate({
      documentId,
      questionCount,
      targetDistribution,
      targetDifficulty,
      targetAudience: 'Undergraduate',
      targetAgeRange: '18-22 years',
      targetComplexity: 'Intermediate',
      targetPrerequisites: '',
      trueFalsePercentage,
      mcqPercentage,
      durationMinutes,
      selectedTopics,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-lectura-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-lectura-slate-200 w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-lectura-slate-100 bg-gradient-to-r from-purple-50/50 to-blue-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-600 text-white rounded-2xl shadow-md">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-lectura-slate-900">Topic Selection & Generation Config</h2>
              <p className="text-xs text-lectura-slate-500 font-medium">Material: {documentTitle}</p>
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

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Topic Selection Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-lectura-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-lectura-blue-600" /> Select Covered Topics / Chapters ({selectedTopics.length}/{extractedTopics.length})
              </label>
              <div className="flex items-center gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={selectAllTopics}
                  className="text-lectura-blue-600 hover:underline cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-lectura-slate-300">•</span>
                <button
                  type="button"
                  onClick={clearAllTopics}
                  className="text-lectura-slate-500 hover:underline cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            {isLoadingTopics ? (
              <div className="flex items-center justify-center p-8 bg-lectura-slate-50 rounded-2xl border border-lectura-slate-200">
                <Loader2 className="w-6 h-6 text-lectura-blue-600 animate-spin" />
                <span className="ml-3 text-xs font-bold text-lectura-slate-600">Extracting topics from document...</span>
              </div>
            ) : extractedTopics.length === 0 ? (
              <div className="p-4 bg-lectura-slate-50 rounded-2xl text-xs text-lectura-slate-500 text-center font-medium">
                No specific sub-topics extracted. Full material content will be used.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-1">
                {extractedTopics.map((topic, idx) => {
                  const isSelected = selectedTopics.includes(topic);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleTopic(topic)}
                      className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/60 border-lectura-blue-300 text-lectura-slate-900'
                          : 'bg-white border-lectura-slate-200 text-lectura-slate-500 hover:bg-lectura-slate-50'
                      }`}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-lectura-blue-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-lectura-slate-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-xs font-bold leading-relaxed">{topic}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Test Duration & Question Mix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-lectura-slate-50/80 p-5 rounded-2xl border border-lectura-slate-200">
            {/* Test Duration */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-lectura-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-600" /> Test Duration / Time Limit
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-lectura-slate-200 rounded-xl text-xs font-semibold text-lectura-slate-800"
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes (Standard)</option>
                <option value={90}>90 Minutes</option>
                <option value={120}>120 Minutes (2 Hours)</option>
              </select>
            </div>

            {/* Total Question Count */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-lectura-slate-700">Total Questions to Generate</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-lectura-slate-200 rounded-xl text-xs font-semibold text-lectura-slate-800"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
                <option value={30}>30 Questions</option>
              </select>
            </div>

            {/* True/False Ratio Slider */}
            <div className="space-y-2 sm:col-span-2 pt-2 border-t border-lectura-slate-200/80">
              <div className="flex items-center justify-between text-xs font-bold text-lectura-slate-700">
                <span className="flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-lectura-blue-600" /> Question Type Ratios
                </span>
                <span className="text-lectura-blue-600">
                  {trueFalsePercentage}% True/False • {100 - trueFalsePercentage}% 4-Option MCQs
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={trueFalsePercentage}
                onChange={(e) => setTrueFalsePercentage(Number(e.target.value))}
                className="w-full accent-lectura-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-lectura-slate-500 font-medium">
                MCQs will feature 4 distinct options (A, B, C, D) with 1 correct option and 3 plausible distractors.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-lectura-slate-100 bg-lectura-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-lectura-slate-200 hover:bg-lectura-slate-100 text-lectura-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerateClick}
            disabled={selectedTopics.length === 0 && extractedTopics.length > 0}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" /> Generate Questions for Review
          </button>
        </div>
      </div>
    </div>
  );
};
