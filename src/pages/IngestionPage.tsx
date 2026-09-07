import React, { useState } from 'react';
import { FileText, Upload, Sparkles, CheckCircle2 } from 'lucide-react';
import { UploadAndAudienceModal } from '../components/assessment/UploadAndAudienceModal';
import { TopicSelectionAndConfigModal } from '../components/assessment/TopicSelectionAndConfigModal';
import { QuestionReviewCanvas } from '../components/assessment/QuestionReviewCanvas';
import { assessmentApi } from '../api/assessmentApi';
import type { AudienceContext, GenerationConfig, GeneratedQuestion } from '../types/assessment';

export const IngestionPage: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [selectedDocTitle, setSelectedDocTitle] = useState('');
  const [extractedTopics, setExtractedTopics] = useState<string[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [draftQuestions, setDraftQuestions] = useState<GeneratedQuestion[] | null>(null);

  const materials = [
    { id: 'DOC-101', name: 'Lecture 4 - Distributed Systems Consensus.pdf', assessmentName: 'CS402 Quiz 2', size: '4.2 MB', status: 'Ingested & Ready', audience: 'Undergraduate (18-22 yrs)' },
    { id: 'DOC-102', name: 'Cloud Computing Syllabus 2026.docx', assessmentName: 'Cloud Arch Midterm', size: '1.8 MB', status: 'Ingested & Ready', audience: 'Undergraduate (18-22 yrs)' },
    { id: 'DOC-103', name: 'Quantum Cryptography Handout.pdf', assessmentName: 'Physics Elective Test', size: '8.5 MB', status: 'Ingested & Ready', audience: 'Postgraduate' },
  ];

  const handleUploadSuccess = (file: File, context: AudienceContext) => {
    alert(`Material "${file.name}" uploaded successfully for Assessment "${context.assessmentName}". Audience context saved.`);
  };

  const handleOpenConfigModal = async (doc: (typeof materials)[0]) => {
    setSelectedDocId(doc.id);
    setSelectedDocTitle(doc.assessmentName || doc.name);
    setIsConfigModalOpen(true);
    setIsLoadingTopics(true);

    try {
      const topics = await assessmentApi.extractTopics(doc.id);
      setExtractedTopics(topics);
    } catch {
      setExtractedTopics([
        'Module 1: Fundamental Principles & Architecture',
        'Module 2: Consensus Algorithms (Raft & Paxos)',
        'Module 3: Fault Tolerance & Data Consistency',
        'Module 4: Performance Metrics & Case Studies',
      ]);
    } finally {
      setIsLoadingTopics(false);
    }
  };

  const handleGenerateQuestions = async (config: GenerationConfig) => {
    try {
      const questions = await assessmentApi.generateQuestions(config);
      setDraftQuestions(questions);
    } catch {
      setDraftQuestions([
        {
          questionText: 'What is the primary goal of the Byzantine Fault Tolerance algorithm in distributed systems?',
          options: ['A. Ensure consensus despite malicious nodes', 'B. Maximize CPU clock cycles', 'C. Prevent SQL injection', 'D. Compress network data'],
          correctOptionIndex: 0,
          explanation: 'BFT ensures agreement in distributed networks even when components fail or broadcast erroneous data.',
          bloomLevel: 'Understand',
          difficulty: 'Medium',
          topic: 'Consensus Algorithms',
        },
        {
          questionText: 'True or False: Raft consensus decomposes cluster state into leader election, log replication, and safety.',
          options: ['True', 'False'],
          correctOptionIndex: 0,
          explanation: 'Raft divides consensus into clear independent subproblems for improved understandability.',
          bloomLevel: 'Remember',
          difficulty: 'Easy',
          topic: 'Consensus Algorithms',
        },
      ]);
    }
  };

  const handleSaveApprovedQuestions = async (approved: GeneratedQuestion[]) => {
    await assessmentApi.saveDraftQuestions(approved);
    alert(`Successfully saved ${approved.length} reviewed questions to Question Bank!`);
    setDraftQuestions(null);
  };

  if (draftQuestions) {
    return (
      <QuestionReviewCanvas
        initialQuestions={draftQuestions}
        onSaveApproved={handleSaveApprovedQuestions}
        onCancel={() => setDraftQuestions(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-lectura-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-lectura-slate-900 tracking-tight">Course Material Ingestion</h1>
          </div>
          <p className="text-sm text-lectura-slate-500 font-medium mt-1">
            Upload course documents, specify assessment names, and set target audience boundaries.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition-all text-sm cursor-pointer"
        >
          <Upload className="w-4 h-4" /> Upload Material with Audience Prompt
        </button>
      </div>

      {/* Upload Drag & Drop Dropzone */}
      <div
        onClick={() => setIsUploadModalOpen(true)}
        className="bg-white p-8 rounded-3xl border-2 border-dashed border-lectura-slate-300 hover:border-lectura-blue-500 transition-colors text-center space-y-4 shadow-xs cursor-pointer"
      >
        <div className="w-16 h-16 bg-lectura-blue-50 text-lectura-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <Upload className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-lectura-slate-900">Upload Course Document & Set Audience Context</h3>
          <p className="text-xs text-lectura-slate-500">Click to upload material and answer audience targeting questions</p>
        </div>
      </div>

      {/* Ingested Materials Log */}
      <div className="bg-white rounded-3xl border border-lectura-slate-200/80 p-6 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-lectura-slate-900">Ingested Course Materials</h2>

        <div className="space-y-3">
          {materials.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-lectura-slate-50 rounded-2xl border border-lectura-slate-200/60 gap-4 text-xs hover:border-lectura-blue-300 transition-all"
            >
              <div className="flex items-start gap-3">
                <FileText className="w-6 h-6 text-lectura-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-lectura-slate-900 text-sm">{doc.assessmentName}</p>
                  <p className="text-lectura-slate-500 font-medium">{doc.name} • {doc.size}</p>
                  <p className="text-purple-600 font-bold">Target Audience: {doc.audience}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-green-100 text-green-700 font-extrabold rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {doc.status}
                </span>

                <button
                  type="button"
                  onClick={() => handleOpenConfigModal(doc)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition-all text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Generate Questions
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <UploadAndAudienceModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <TopicSelectionAndConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        documentId={selectedDocId}
        documentTitle={selectedDocTitle}
        extractedTopics={extractedTopics}
        isLoadingTopics={isLoadingTopics}
        onGenerate={handleGenerateQuestions}
      />
    </div>
  );
};
