import { api } from "@/lib/api/client";
import { useAuthStore } from "@/stores/auth-store";

export interface GeneratedQuestionDto {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  bloomLevel: string;
  difficulty: string;
  topic?: string;
}

export interface AssessmentGenerationResultDto {
  success: boolean;
  quotaCorrelationId: string;
  questions: GeneratedQuestionDto[];
  wasPedagogicallyRebalanced?: boolean;
  pedagogicalWarning?: string;
}

export interface GenerateQuestionsRequest {
  documentId: string;
  questionCount: number;
  targetDistribution?: number;
  targetDifficulty?: number;
  targetAudience?: string;
  targetAgeRange?: string;
  targetComplexity?: string;
  targetPrerequisites?: string;
  trueFalsePercentage?: number;
  mcqPercentage?: number;
  durationMinutes?: number;
  selectedTopics?: string[];
}

export interface CreateAssessmentRequest {
  title: string;
  courseCode: string;
  assessmentType: string;
  durationMinutes: number;
  totalMarks?: number;
  instructions: string;
  questions: GeneratedQuestionDto[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ShareLinkResultDto {
  shareToken: string;
  publicUrl: string;
}

export interface PublicAssessmentDto {
  id: string;
  title: string;
  courseCode: string;
  durationMinutes: number;
  totalMarks?: number;
  instructions: string;
  topics?: string[];
  questions: {
    id: string;
    questionText: string;
    options: string[];
    bloomLevel?: string;
    difficulty?: string;
    topic?: string;
  }[];
}

export interface SubmitStudentAssessmentRequest {
  studentName?: string;
  matricNumber?: string;
  studentEmail?: string;
  answers: { questionId?: string; questionIndex?: number; selectedOptionIndex: number }[];
}

export interface ItemResultDto {
  questionId: string;
  questionText: string;
  selectedOptionIndex: number;
  correctOptionIndex: number;
  isCorrect: boolean;
  explanation: string;
}

export interface SubmissionResultDto {
  submissionId: string;
  studentName?: string;
  matricNumber?: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  grade?: string;
  submittedAt: string;
  itemResults?: ItemResultDto[];
  score?: number;
  totalQuestions?: number;
}

export interface StudentSubmissionItemDto {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  courseCode: string;
  studentName: string;
  matricNumber?: string;
  studentEmail?: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  grade: string;
  submittedAt: string;
  tenantName?: string;
}

export interface TenantLookupDto {
  id: string;
  name: string;
  institutionName: string;
  email: string;
}

export interface AssessmentSummaryDto {
  id: string;
  title: string;
  courseCode: string;
  assessmentType: string;
  totalQuestions: number;
  durationMinutes: number;
  createdAt: string;
  tenantName?: string;
  tokensUsed?: number;
}

export interface AssessmentQuestionDetailsDto {
  id: string;
  sequenceNumber: number;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  topic: string;
  bloomLevel: string;
  difficulty: string;
}

export interface AssessmentDetailsDto {
  id: string;
  title: string;
  courseCode: string;
  assessmentType: string;
  totalQuestions: number;
  durationMinutes: number;
  instructions: string;
  questions: AssessmentQuestionDetailsDto[];
  createdAt: string;
}

export interface PaginatedList<T> {
  items: T[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export const tenantsApi = {
  async getAllTenants(): Promise<TenantLookupDto[]> {
    try {
      const res = await api.get<ApiResponse<TenantLookupDto[]>>("/api/v1/tenants");
      return res.data?.data || [];
    } catch {
      return [];
    }
  },
};

export const assessmentsApi = {
  async getAssessmentsList(pageNumber = 1, pageSize = 50, filterTenantId?: string): Promise<PaginatedList<AssessmentSummaryDto>> {
    const params: Record<string, any> = { pageNumber, pageSize };
    if (filterTenantId) {
      params.filterTenantId = filterTenantId;
    }
    const res = await api.get<ApiResponse<PaginatedList<AssessmentSummaryDto>>>("/api/v1/assessments", {
      params,
    });
    return res.data?.data || { items: [], pageNumber: 1, totalPages: 0, totalCount: 0, hasPreviousPage: false, hasNextPage: false };
  },

  async getAssessmentById(id: string): Promise<AssessmentDetailsDto> {
    const res = await api.get<ApiResponse<AssessmentDetailsDto>>(`/api/v1/assessments/${id}`);
    return res.data?.data;
  },

  async generateQuestions(req: GenerateQuestionsRequest): Promise<GeneratedQuestionDto[]> {
    const res = await api.post<ApiResponse<AssessmentGenerationResultDto>>("/api/v1/assessments/generate", req);
    if (!res.data || !res.data.success) {
      throw new Error(res.data?.message || "Failed to generate questions");
    }
    const questions = res.data.data?.questions || [];
    if (questions.length > 0) {
      const creditsDeducted = (req.questionCount || questions.length) * 25;
      useAuthStore.getState().deductQuota(creditsDeducted);
    }
    return questions;
  },

  async createAssessment(req: CreateAssessmentRequest): Promise<{ id: string }> {
    const res = await api.post<ApiResponse<any>>("/api/v1/assessments", req);
    const data = res.data?.data;
    const id = typeof data === "string" ? data : (data?.id || "");
    return { id };
  },

  async generateShareLink(assessmentId: string): Promise<string> {
    const res = await api.post<ApiResponse<ShareLinkResultDto>>(`/api/v1/assessments/${assessmentId}/share-link?enablePublicAccess=true`);
    return res.data?.data?.shareToken || "";
  },

  async getPublicAssessment(shareToken: string): Promise<PublicAssessmentDto> {
    const res = await api.get<ApiResponse<PublicAssessmentDto>>(`/api/v1/public/assessments/${shareToken}`);
    return res.data?.data;
  },

  async submitStudentAssessment(shareToken: string, req: SubmitStudentAssessmentRequest): Promise<SubmissionResultDto> {
    const res = await api.post<ApiResponse<SubmissionResultDto>>(`/api/v1/public/assessments/${shareToken}/submit`, req);
    return res.data?.data;
  },

  async getSubmissionsReport(params?: {
    assessmentId?: string;
    searchQuery?: string;
    pageNumber?: number;
    pageSize?: number;
    filterTenantId?: string;
  }): Promise<PaginatedList<StudentSubmissionItemDto>> {
    const res = await api.get<ApiResponse<PaginatedList<StudentSubmissionItemDto>>>("/api/v1/assessments/submissions/reports", { params });
    return res.data?.data || { items: [], pageNumber: 1, totalPages: 0, totalCount: 0, hasPreviousPage: false, hasNextPage: false };
  },
};
