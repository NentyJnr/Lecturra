export interface AudienceContext {
  assessmentName: string;
  targetAudience: string;
  targetAgeRange: string;
  targetComplexity: string;
  targetPrerequisites: string;
}

export interface GenerationConfig {
  documentId: string;
  questionCount: number;
  targetDistribution: string;
  targetDifficulty: string;
  targetAudience: string;
  targetAgeRange: string;
  targetComplexity: string;
  targetPrerequisites: string;
  trueFalsePercentage: number;
  mcqPercentage: number;
  durationMinutes: number;
  selectedTopics: string[];
}

export interface GeneratedQuestion {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  bloomLevel: string;
  difficulty: string;
  topic: string;
}

export interface ShareLinkDetails {
  assessmentId: string;
  shareToken: string;
  publicUrl: string;
  isPublicAccessEnabled: boolean;
}

export interface PublicQuestion {
  id: string;
  questionText: string;
  options: string[];
  topic: string;
}

export interface PublicAssessmentDetails {
  assessmentId: string;
  title: string;
  courseCode: string;
  durationMinutes: number;
  instructions: string;
  questions: PublicQuestion[];
}

export interface StudentAnswerInput {
  questionId: string;
  selectedOptionIndex: number;
  answerText?: string;
}

export interface StudentItemResult {
  questionId: string;
  questionText: string;
  selectedOptionIndex: number;
  correctOptionIndex: number;
  isCorrect: boolean;
  explanation: string;
}

export interface StudentSubmissionResult {
  submissionId: string;
  studentName: string;
  matricNumber?: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  grade: string;
  submittedAt: string;
  itemResults: StudentItemResult[];
}

export interface StudentSubmissionSummary {
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
}
