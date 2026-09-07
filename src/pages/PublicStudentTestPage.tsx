import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, Clock, AlertTriangle, Send, User, Award, ArrowRight, Loader2 } from 'lucide-react';
import { assessmentApi } from '../api/assessmentApi';
import type { PublicAssessmentDetails, StudentSubmissionResult, StudentAnswerInput } from '../types/assessment';

export const PublicStudentTestPage: React.FC = () => {
  const { shareToken } = useParams<{ shareToken: string }>();

  // State
  const [assessment, setAssessment] = useState<PublicAssessmentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Student Identity Form State
  const [isStarted, setIsStarted] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [studentEmail, setStudentEmail] = useState('');

  // Test Taking State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<StudentSubmissionResult | null>(null);

  // Load public assessment metadata
  useEffect(() => {
    if (!shareToken) return;
    setIsLoading(true);
    assessmentApi
      .getPublicAssessment(shareToken)
      .then((data) => {
        setAssessment(data);
        setSecondsRemaining((data.durationMinutes || 60) * 60);
      })
      .catch(() => {
        setErrorMsg('Assessment link is invalid or public access has been disabled by the instructor.');
      })
      .finally(() => setIsLoading(false));
  }, [shareToken]);

  // Countdown timer effect once student starts test
  useEffect(() => {
    if (!isStarted || isSubmitting || submissionResult || secondsRemaining <= 0) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeExpiry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isStarted, isSubmitting, submissionResult, secondsRemaining]);

  const handleTimeExpiry = () => {
    setIsTimeExpired(true);
    // Auto-submit test immediately when time expires
    submitTestInternal();
  };

  const handleOptionSelect = (questionId: string, optionIdx: number) => {
    if (isTimeExpired || submissionResult || isSubmitting) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const submitTestInternal = async () => {
    if (!assessment || !shareToken || isSubmitting || submissionResult) return;
    setIsSubmitting(true);

    const answersList: StudentAnswerInput[] = assessment.questions.map((q) => ({
      questionId: q.id,
      selectedOptionIndex: selectedAnswers[q.id] ?? -1,
    }));

    try {
      const result = await assessmentApi.submitStudentAssessment(
        shareToken,
        studentName.trim(),
        matricNumber.trim() || undefined,
        studentEmail.trim() || undefined,
        answersList
      );
      setSubmissionResult(result);
    } catch (err: any) {
      setErrorMsg('Failed to submit test. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-lectura-slate-900 flex items-center justify-center p-4">
        <div className="text-center text-white space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-lectura-blue-400" />
          <p className="text-sm font-bold">Loading Academic Assessment...</p>
        </div>
      </div>
    );
  }

  if (errorMsg && !assessment) {
    return (
      <div className="min-h-screen bg-lectura-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-lg font-extrabold text-lectura-slate-900">Assessment Unavailable</h2>
          <p className="text-xs text-lectura-slate-600 font-medium">{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (!assessment) return null;

  // -------------------------------------------------------------
  // VIEW 1: Student Identity & Start Screen
  // -------------------------------------------------------------
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lectura-slate-900 via-indigo-950 to-lectura-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-lectura-slate-200/80 w-full max-w-lg shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white mb-2">
              <BookOpen className="w-3.5 h-3.5" /> {assessment.courseCode || 'ONLINE TEST'}
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">{assessment.title}</h1>
            <p className="text-xs text-blue-100 font-medium">Duration: {assessment.durationMinutes} Minutes • {assessment.questions.length} Questions</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (studentName.trim()) setIsStarted(true);
            }}
            className="p-8 space-y-5"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-lectura-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-lectura-blue-600" /> Student Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your full name (e.g. John Doe)"
                  className="w-full px-4 py-3 bg-lectura-slate-50 border border-lectura-slate-200 rounded-2xl text-sm font-semibold focus:bg-white focus:border-lectura-blue-600 focus:ring-2 focus:ring-lectura-blue-150 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-lectura-slate-700 uppercase tracking-wider mb-1">
                  Matriculation / Student ID Number (Optional)
                </label>
                <input
                  type="text"
                  value={matricNumber}
                  onChange={(e) => setMatricNumber(e.target.value)}
                  placeholder="e.g. MAT/2026/042"
                  className="w-full px-4 py-3 bg-lectura-slate-50 border border-lectura-slate-200 rounded-2xl text-sm font-semibold focus:bg-white focus:border-lectura-blue-600 focus:ring-2 focus:ring-lectura-blue-150 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-lectura-slate-700 uppercase tracking-wider mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="e.g. student@university.edu"
                  className="w-full px-4 py-3 bg-lectura-slate-50 border border-lectura-slate-200 rounded-2xl text-sm font-semibold focus:bg-white focus:border-lectura-blue-600 focus:ring-2 focus:ring-lectura-blue-150 transition-all"
                />
              </div>
            </div>

            <div className="bg-lectura-slate-50 p-4 rounded-2xl border border-lectura-slate-200 text-xs text-lectura-slate-600 space-y-1 font-medium">
              <p className="font-bold text-lectura-slate-900">Important Instructions:</p>
              <p>• Once you click Start, the {assessment.durationMinutes}-minute timer will begin immediately.</p>
              <p>• If time expires, your current answers will be automatically submitted.</p>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              Start Assessment <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: Student Test Results Screen
  // -------------------------------------------------------------
  if (submissionResult) {
    return (
      <div className="min-h-screen bg-lectura-slate-50 p-4 sm:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Score Header Card */}
          <div className="bg-white rounded-3xl border border-lectura-slate-200 p-8 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-xs">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-lectura-slate-900">Assessment Completed!</h1>
              <p className="text-xs text-lectura-slate-500 font-bold mt-1">
                Student: {submissionResult.studentName} {submissionResult.matricNumber && `(${submissionResult.matricNumber})`}
              </p>
            </div>

            {/* Score Pill Breakdown */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-lectura-slate-100">
              <div className="bg-lectura-slate-50 p-4 rounded-2xl">
                <p className="text-[11px] font-bold text-lectura-slate-500 uppercase">Score</p>
                <p className="text-2xl font-black text-lectura-slate-900">
                  {submissionResult.totalScore} / {submissionResult.maxScore}
                </p>
              </div>

              <div className="bg-lectura-slate-50 p-4 rounded-2xl">
                <p className="text-[11px] font-bold text-lectura-slate-500 uppercase">Percentage</p>
                <p className="text-2xl font-black text-lectura-blue-600">
                  {submissionResult.percentage}%
                </p>
              </div>

              <div className="bg-lectura-slate-50 p-4 rounded-2xl">
                <p className="text-[11px] font-bold text-lectura-slate-500 uppercase">Grade</p>
                <p className="text-2xl font-black text-purple-600">
                  {submissionResult.grade}
                </p>
              </div>
            </div>
          </div>

          {/* Question Breakdown */}
          <div className="bg-white rounded-3xl border border-lectura-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-lectura-slate-900">Detailed Answer Breakdown</h2>
            <div className="space-y-4">
              {submissionResult.itemResults.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border ${
                    item.isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/50 border-red-200'
                  } space-y-2 text-xs`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-bold text-lectura-slate-900">
                      {idx + 1}. {item.questionText}
                    </p>
                    <span
                      className={`px-3 py-1 font-extrabold rounded-full flex-shrink-0 text-[11px] ${
                        item.isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}
                    </span>
                  </div>
                  <p className="text-lectura-slate-600 font-medium">
                    <strong>Explanation:</strong> {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: Active Test Taking Interface with Timer
  // -------------------------------------------------------------
  const currentQ = assessment.questions[currentQIndex];
  const isLastQ = currentQIndex === assessment.questions.length - 1;

  return (
    <div className="min-h-screen bg-lectura-slate-100 flex flex-col">
      {/* Sticky Header with Timer */}
      <header className="bg-white border-b border-lectura-slate-200 sticky top-0 z-30 px-4 py-3 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-extrabold text-lectura-slate-900 truncate">{assessment.title}</h1>
            <p className="text-xs font-bold text-lectura-slate-500">Student: {studentName}</p>
          </div>

          {/* Countdown Timer */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-sm shadow-xs ${
              secondsRemaining < 300
                ? 'bg-red-100 text-red-700 animate-pulse border border-red-300'
                : 'bg-lectura-slate-900 text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>
        </div>
      </header>

      {/* Time Expired Banner */}
      {isTimeExpired && (
        <div className="bg-red-600 text-white text-center p-3 font-bold text-xs flex items-center justify-center gap-2 shadow-md">
          <AlertTriangle className="w-4 h-4 animate-bounce" /> Time has expired! Disabling input and submitting your answers...
        </div>
      )}

      {/* Main Question Body */}
      <main className={`flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6 ${isTimeExpired ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Progress & Quick Jump Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-lectura-slate-200 flex items-center justify-between gap-4 shadow-xs">
          <span className="text-xs font-extrabold text-lectura-slate-600 uppercase tracking-wider">
            Question {currentQIndex + 1} of {assessment.questions.length}
          </span>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {assessment.questions.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isCurrent = idx === currentQIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQIndex(idx)}
                  className={`w-7 h-7 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-lectura-blue-600 text-white shadow-md'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                      : 'bg-lectura-slate-100 text-lectura-slate-600 hover:bg-lectura-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl border border-lectura-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-lectura-slate-900 leading-relaxed">{currentQ.questionText}</h2>

          {/* Options List */}
          <div className="space-y-3">
            {currentQ.options.map((optionText, optIdx) => {
              const isSelected = selectedAnswers[currentQ.id] === optIdx;
              const optionLetter = String.fromCharCode(65 + optIdx);

              return (
                <div
                  key={optIdx}
                  onClick={() => handleOptionSelect(currentQ.id, optIdx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                    isSelected
                      ? 'bg-blue-50 border-lectura-blue-600 text-lectura-slate-900 font-bold shadow-xs'
                      : 'bg-lectura-slate-50 border-lectura-slate-200 text-lectura-slate-700 font-medium hover:bg-white hover:border-lectura-slate-300'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? 'bg-lectura-blue-600 text-white' : 'bg-lectura-slate-200 text-lectura-slate-700'
                    }`}
                  >
                    {optionLetter}
                  </span>
                  <span className="text-sm">{optionText}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={currentQIndex === 0}
            onClick={() => setCurrentQIndex((prev) => prev - 1)}
            className="px-5 py-3 bg-white border border-lectura-slate-200 hover:bg-lectura-slate-50 text-lectura-slate-700 font-bold text-xs rounded-2xl transition-colors cursor-pointer disabled:opacity-40"
          >
            Previous
          </button>

          {isLastQ ? (
            <button
              type="button"
              disabled={isSubmitting || isTimeExpired}
              onClick={submitTestInternal}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Finish & Submit Assessment
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentQIndex((prev) => prev + 1)}
              className="px-6 py-3 bg-lectura-blue-600 hover:bg-lectura-blue-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              Next Question <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
};
