import { axiosClient } from './axiosClient';
import type {
  GenerationConfig,
  GeneratedQuestion,
  ShareLinkDetails,
  PublicAssessmentDetails,
  StudentAnswerInput,
  StudentSubmissionResult,
  StudentSubmissionSummary,
} from '../types/assessment';

export const assessmentApi = {
  // Extract topics from an ingested document
  extractTopics: async (documentId: string): Promise<string[]> => {
    const res = await axiosClient.get(`/api/v1/documents/${documentId}/topics`);
    return res.data?.data || [];
  },

  // Generate draft questions with audience & ratio parameters
  generateQuestions: async (config: GenerationConfig): Promise<GeneratedQuestion[]> => {
    const res = await axiosClient.post('/api/v1/assessments/generate', config);
    return res.data?.data?.questions || [];
  },

  // Save reviewed draft questions to Question Bank
  saveDraftQuestions: async (questions: GeneratedQuestion[]): Promise<boolean> => {
    const res = await axiosClient.post('/api/v1/assessments/draft/save', questions);
    return res.data?.success || false;
  },

  // Generate / toggle public share link
  generateShareLink: async (assessmentId: string, enablePublicAccess = true): Promise<ShareLinkDetails> => {
    const res = await axiosClient.post(`/api/v1/assessments/${assessmentId}/share-link?enablePublicAccess=${enablePublicAccess}`);
    return res.data?.data;
  },

  // Public unauthenticated call to load test details for a student
  getPublicAssessment: async (shareToken: string): Promise<PublicAssessmentDetails> => {
    const res = await axiosClient.get(`/api/v1/public/assessments/${shareToken}`);
    return res.data?.data;
  },

  // Public unauthenticated call to submit student answers
  submitStudentAssessment: async (
    shareToken: string,
    studentName: string,
    matricNumber: string | undefined,
    studentEmail: string | undefined,
    answers: StudentAnswerInput[]
  ): Promise<StudentSubmissionResult> => {
    const res = await axiosClient.post(`/api/v1/public/assessments/${shareToken}/submit`, {
      studentName,
      matricNumber,
      studentEmail,
      answers,
    });
    return res.data?.data;
  },

  // Get score reports for lecturer dashboard
  getStudentSubmissionsReport: async (
    assessmentId?: string,
    searchQuery?: string,
    pageNumber = 1,
    pageSize = 20
  ): Promise<{ items: StudentSubmissionSummary[]; totalCount: number }> => {
    const params = new URLSearchParams();
    if (assessmentId) params.append('assessmentId', assessmentId);
    if (searchQuery) params.append('searchQuery', searchQuery);
    params.append('pageNumber', pageNumber.toString());
    params.append('pageSize', pageSize.toString());

    const res = await axiosClient.get(`/api/v1/assessments/submissions/reports?${params.toString()}`);
    const data = res.data?.data;
    return {
      items: data?.items || [],
      totalCount: data?.totalCount || 0,
    };
  },

  // Export score report as CSV
  exportStudentSubmissionsCsv: async (assessmentId: string): Promise<Blob> => {
    const res = await axiosClient.get(`/api/v1/assessments/${assessmentId}/submissions/export`, {
      responseType: 'blob',
    });
    return res.data;
  },
};
