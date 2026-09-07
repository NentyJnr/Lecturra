import React, { useState } from 'react';
import { Trash2, Edit3, Save, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import type { GeneratedQuestion } from '../../types/assessment';

interface QuestionReviewCanvasProps {
  initialQuestions: GeneratedQuestion[];
  onSaveApproved: (questions: GeneratedQuestion[]) => void;
  onCancel: () => void;
}

export const QuestionReviewCanvas: React.FC<QuestionReviewCanvasProps> = ({
  initialQuestions,
  onSaveApproved,
  onCancel,
}) => {
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([...initialQuestions]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleDelete = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleEditChange = (index: number, field: keyof GeneratedQuestion, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, text: string) => {
    const updated = [...questions];
    const newOptions = [...updated[qIndex].options];
    newOptions[oIndex] = text;
    updated[qIndex] = { ...updated[qIndex], options: newOptions };
    setQuestions(updated);
  };

  const handleSave = async () => {
    if (questions.length === 0) {
      alert('You must have at least 1 question to save.');
      return;
    }
    setIsSaving(true);
    await onSaveApproved(questions);
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Review Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-3xl shadow-lg">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              type="button"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-extrabold tracking-tight">Review & Edit Generated Questions</h1>
          </div>
          <p className="text-xs text-blue-200 font-medium mt-1 ml-10">
            Review AI questions generated for your target audience. You can edit text, options, or delete any questions that don't fit.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || questions.length === 0}
            className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Save ({questions.length} Approved Questions)
          </button>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-lectura-slate-200 space-y-3">
          <AlertCircle className="w-10 h-10 text-lectura-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-lectura-slate-900">All questions deleted</h3>
          <p className="text-xs text-lectura-slate-500 font-medium">Click Discard to return or regenerate questions.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, index) => {
            const isEditing = editingIndex === index;

            return (
              <div
                key={index}
                className="bg-white rounded-3xl border border-lectura-slate-200/80 p-6 shadow-xs space-y-4 transition-all hover:border-lectura-blue-300"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-lectura-blue-50 text-lectura-blue-700 font-extrabold text-xs rounded-xl flex items-center justify-center border border-lectura-blue-200">
                      #{index + 1}
                    </span>
                    <span className="text-xs font-bold text-lectura-slate-500 uppercase tracking-wider">{q.topic || 'General Topic'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingIndex(isEditing ? null : index)}
                      className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isEditing
                          ? 'bg-lectura-blue-600 text-white shadow-xs'
                          : 'bg-lectura-slate-100 text-lectura-slate-700 hover:bg-lectura-slate-200'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" /> {isEditing ? 'Done Editing' : 'Edit'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>

                {/* Question Text Body */}
                {isEditing ? (
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-bold text-lectura-slate-700">Question Text</label>
                    <textarea
                      rows={3}
                      value={q.questionText}
                      onChange={(e) => handleEditChange(index, 'questionText', e.target.value)}
                      className="w-full p-3 bg-lectura-slate-50 border border-lectura-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:border-lectura-blue-600"
                    />
                  </div>
                ) : (
                  <h3 className="text-base font-bold text-lectura-slate-900 leading-relaxed">{q.questionText}</h3>
                )}

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === q.correctOptionIndex;
                    const optionLetter = String.fromCharCode(65 + optIdx);

                    return (
                      <div
                        key={optIdx}
                        className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                          isCorrect
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold'
                            : 'bg-lectura-slate-50/60 border-lectura-slate-200/80 text-lectura-slate-700 font-medium'
                        }`}
                      >
                        <span
                          onClick={() => isEditing && handleEditChange(index, 'correctOptionIndex', optIdx)}
                          className={`w-6 h-6 rounded-lg text-xs font-extrabold flex items-center justify-center cursor-pointer transition-colors ${
                            isCorrect ? 'bg-emerald-600 text-white shadow-xs' : 'bg-lectura-slate-200 text-lectura-slate-600'
                          }`}
                        >
                          {optionLetter}
                        </span>

                        {isEditing ? (
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleOptionChange(index, optIdx, e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-lectura-slate-200 rounded-xl text-xs font-semibold"
                          />
                        ) : (
                          <span className="text-xs">{opt}</span>
                        )}

                        {isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600 ml-auto flex-shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Academic Explanation & Tags */}
                <div className="pt-3 border-t border-lectura-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-lectura-slate-600 font-medium">
                    <strong>Academic Rationale:</strong> {q.explanation}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-lg font-extrabold text-[11px]">
                      {q.bloomLevel || 'Understand'}
                    </span>
                    <span className="bg-lectura-slate-100 text-lectura-slate-700 px-2.5 py-1 rounded-lg font-extrabold text-[11px]">
                      {q.difficulty || 'Medium'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
