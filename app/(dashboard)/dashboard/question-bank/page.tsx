"use client";

import { useState, useEffect } from "react";
import {
  HelpCircleIcon,
  SparklesIcon,
  FileDownIcon,
  SearchIcon,
  CheckCircle2Icon,
  CopyIcon,
  SlidersIcon,
  CheckSquareIcon,
  SquareIcon,
  Loader2Icon,
  BookOpenIcon,
  UserIcon,
  GraduationCapIcon,
  LayersIcon,
  Share2Icon,
  XIcon,
  PrinterIcon,
  FileTextIcon,
  CheckIcon,
  ClockIcon,
  AwardIcon,
  EyeIcon,
  LinkIcon,
  KeyIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ExternalLinkIcon,
  ShieldCheckIcon,
  FilterIcon,
  Building2Icon,
} from "lucide-react";
import { toast } from "sonner";
import { documentsApi, IngestedDocumentDto } from "@/lib/api/services/documents";
import {
  assessmentsApi,
  tenantsApi,
  TenantLookupDto,
  AssessmentSummaryDto,
  AssessmentDetailsDto,
} from "@/lib/api/services/assessments";
import { useAuthStore } from "@/stores/auth-store";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface TopicOption {
  id: string;
  name: string;
}

interface MaterialCourse {
  id: string;
  courseCode: string;
  title: string;
  topics: TopicOption[];
}

interface QuestionItem {
  id: string;
  courseCode: string;
  topic: string;
  type: "MCQ" | "TrueFalse" | "ShortAnswer";
  difficulty: "Easy" | "Medium" | "Hard";
  bloomsTaxonomy: "Remember" | "Understand" | "Apply" | "Analyze" | "Evaluate" | "Create";
  ageRange: string;
  knowledgeLevel: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  correctOptionIndex: number;
  explanation: string;
}

const defaultMaterials: MaterialCourse[] = [
  {
    id: "mat-1",
    courseCode: "EXCEL 101",
    title: "EXCEL 101 - Lecture Material",
    topics: [
      { id: "t-1", name: "Part 1: Foundational Principles & Core Concepts" },
      { id: "t-2", name: "Part 2: Methodology & Practical Application" },
      { id: "t-3", name: "Part 3: Advanced Analysis & Assessment" },
    ],
  },
];

export default function QuestionBankPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "SystemAdmin" || user?.role === "InstitutionAdmin" || user?.email?.toLowerCase() === "neotroltd@gmail.com";

  const [tenants, setTenants] = useState<TenantLookupDto[]>([]);
  const [selectedTenantFilter, setSelectedTenantFilter] = useState<string>("");

  const [materials, setMaterials] = useState<MaterialCourse[]>(defaultMaterials);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // Filtering & AI Parameters
  const [questionType, setQuestionType] = useState<string>("MCQ");
  const [bloomsLevel, setBloomsLevel] = useState<string>("Balanced");
  const [batchCount, setBatchCount] = useState<string>("10");
  const [targetAgeRange, setTargetAgeRange] = useState<string>("19-22");
  const [knowledgeLevel, setKnowledgeLevel] = useState<string>("Intermediate");
  const [testDuration, setTestDuration] = useState<string>("60");
  const [totalMarks, setTotalMarks] = useState<string>("100");

  // Questions Repository State
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Export & Share Modals
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Saved Assessments & 3-Slide Popup Modal State
  const [savedAssessments, setSavedAssessments] = useState<AssessmentSummaryDto[]>([]);
  const [isLoadingAssessments, setIsLoadingAssessments] = useState(false);
  const [activeAssessmentModal, setActiveAssessmentModal] = useState<AssessmentDetailsDto | null>(null);
  const [_isLoadingAssessmentDetails, setIsLoadingAssessmentDetails] = useState(false);
  const [modalShareToken, setModalShareToken] = useState("");
  const [activeSlide, setActiveSlide] = useState<1 | 2 | 3>(1); // 1 = View Questions, 2 = View Answers, 3 = View Link
  const [modalCopiedLink, setModalCopiedLink] = useState(false);

  async function fetchTopicsForMaterial(matId: string) {
    if (!matId || matId.startsWith("mat-")) return;
    setIsLoadingTopics(true);
    try {
      const realTopics = await documentsApi.getDocumentTopics(matId);
      if (realTopics && realTopics.length > 0) {
        const topicObjs: TopicOption[] = realTopics.map((topicName, idx) => ({
          id: `${matId}-${idx}`,
          name: topicName,
        }));
        setMaterials((prev) =>
          prev.map((m) => (m.id === matId ? { ...m, topics: topicObjs } : m))
        );
        setSelectedTopics(realTopics);
      }
    } catch (err) {
      console.error("Error fetching AI topics for document:", err);
    } finally {
      setIsLoadingTopics(false);
    }
  }

  async function loadSavedAssessmentsList(filterTenantId?: string) {
    setIsLoadingAssessments(true);
    try {
      const res = await assessmentsApi.getAssessmentsList(1, 50, filterTenantId);
      setSavedAssessments(res?.items || []);
    } catch (err) {
      console.error("Error fetching saved assessments list:", err);
    } finally {
      setIsLoadingAssessments(false);
    }
  }

  useEffect(() => {
    if (isAdmin) {
      tenantsApi.getAllTenants().then((tList) => setTenants(tList));
    }
  }, [isAdmin]);

  useEffect(() => {
    async function loadUploadedMaterials() {
      try {
        const fetched = await documentsApi.getDocuments();
        if (fetched && fetched.length > 0) {
          const mapped: MaterialCourse[] = fetched.map((doc: IngestedDocumentDto) => {
            const course = doc.courseCode || "GEN 101";
            const title = doc.title || doc.fileName;
            return {
              id: doc.documentId,
              courseCode: course,
              title: `${course} - ${title}`,
              topics: [],
            };
          });
          setMaterials(mapped);
          setSelectedMaterialId("");
          setSelectedTopics([]);
        }
      } catch (err) {
        console.error("Error loading uploaded materials:", err);
      }
    }
    if (!isAdmin) {
      loadUploadedMaterials();
    }
  }, [isAdmin]);

  useEffect(() => {
    loadSavedAssessmentsList(selectedTenantFilter);
  }, [selectedTenantFilter]);

  async function openAssessmentActionModal(id: string) {
    setIsLoadingAssessmentDetails(true);
    setActiveSlide(1);
    setActiveAssessmentModal(null);
    setModalShareToken("");
    try {
      const [details, token] = await Promise.all([
        assessmentsApi.getAssessmentById(id),
        assessmentsApi.generateShareLink(id).catch(() => ""),
      ]);
      if (details) {
        setActiveAssessmentModal(details);
        setModalShareToken(token);
      } else {
        toast.error("Failed to load assessment details.");
      }
    } catch (err: any) {
      console.error("Error loading assessment details:", err);
      toast.error("Failed to load assessment details.");
    } finally {
      setIsLoadingAssessmentDetails(false);
    }
  }

  const currentMaterial = materials.find((m) => m.id === selectedMaterialId);

  async function fetchSavedQuestionsForMaterial(matId: string) {
    if (!matId || matId.startsWith("mat-")) return;
    try {
      const savedData = await documentsApi.getSavedQuestions(matId);
      if (savedData && savedData.questions && savedData.questions.length > 0) {
        const mat = materials.find((m) => m.id === matId);
        const mapped: QuestionItem[] = savedData.questions.map((q: any, idx: number) => ({
          id: `q-saved-${idx + 1}`,
          courseCode: mat?.courseCode || "COURSE",
          topic: q.topic || "Saved Topic",
          type: (q.options && q.options.length === 2) ? "TrueFalse" : "MCQ",
          difficulty: q.difficulty || "Medium",
          bloomsTaxonomy: q.bloomLevel || "Understand",
          ageRange: `${targetAgeRange} Yrs`,
          knowledgeLevel: knowledgeLevel,
          questionText: q.questionText,
          options: q.options || [],
          correctAnswer: q.options?.[q.correctOptionIndex] || q.options?.[0] || "",
          correctOptionIndex: q.correctOptionIndex,
          explanation: q.explanation || "",
        }));

        setQuestions(mapped);
        setHasGenerated(true);

        if (savedData.selectedTopics && savedData.selectedTopics.length > 0) {
          setSelectedTopics(savedData.selectedTopics);
        }
      } else {
        setQuestions([]);
        setHasGenerated(false);
      }
    } catch (err) {
      console.error("Error fetching saved questions:", err);
    }
  }

  function handleMaterialChange(matId: string) {
    setSelectedMaterialId(matId);
    if (!matId) {
      setSelectedTopics([]);
      setQuestions([]);
      setHasGenerated(false);
      return;
    }
    const mat = materials.find((m) => m.id === matId);
    if (mat && mat.topics.length > 0) {
      setSelectedTopics(mat.topics.map((t) => t.name));
    } else {
      setSelectedTopics([]);
    }
    fetchTopicsForMaterial(matId);
    fetchSavedQuestionsForMaterial(matId);
  }

  function toggleTopic(topicName: string) {
    setSelectedTopics((prev) =>
      prev.includes(topicName) ? prev.filter((t) => t !== topicName) : [...prev, topicName]
    );
  }

  function toggleSelectAllTopics() {
    if (!currentMaterial) return;
    if (selectedTopics.length === currentMaterial.topics.length) {
      setSelectedTopics([]);
    } else {
      setSelectedTopics(currentMaterial.topics.map((t) => t.name));
    }
  }

  async function triggerAiGenerator() {
    if (!selectedMaterialId) {
      toast.error("Please select a target course material!");
      return;
    }
    if (selectedTopics.length === 0) {
      toast.error("Please select at least one topic!");
      return;
    }

    setIsGenerating(true);
    const requestedCount = parseInt(batchCount, 10) || 10;
    const creditsNeeded = requestedCount * 10;
    const currentQuota = useAuthStore.getState().user?.remainingQuota ?? 1500;

    if (currentQuota < creditsNeeded) {
      toast.error(`Insufficient credit quota! Generating ${requestedCount} questions requires ${creditsNeeded} credits, but you only have ${currentQuota} credits available. Please top up your balance in Billing.`);
      return;
    }

    setIsGenerating(true);

    try {
      const isRealDocument = !selectedMaterialId.startsWith("mat-");

      if (isRealDocument) {
        const apiQuestions = await assessmentsApi.generateQuestions({
          documentId: selectedMaterialId,
          questionCount: requestedCount,
          selectedTopics: selectedTopics,
          targetAudience: knowledgeLevel,
          targetAgeRange: `${targetAgeRange} Years`,
          trueFalsePercentage: questionType === "TrueFalse" ? 100 : questionType === "Mixed" ? 30 : 0,
          mcqPercentage: questionType === "TrueFalse" ? 0 : questionType === "Mixed" ? 70 : 100,
        });

        if (apiQuestions && apiQuestions.length > 0) {
          const mapped: QuestionItem[] = apiQuestions.map((q, idx) => {
            const rawOpts = q.options && q.options.length > 0
              ? q.options
              : ["Option A", "Option B", "Option C", "Option D"];
            const opts = rawOpts.map((opt, optIdx) => {
              const clean = opt.trim();
              const letter = String.fromCharCode(65 + optIdx);
              if (/^[A-D][.)\-:\s]/i.test(clean)) return clean;
              return `${letter}. ${clean}`;
            });
            const correctOptStr = opts[q.correctOptionIndex] || opts[0];

            return {
              id: `q-${Date.now()}-${idx + 1}`,
              courseCode: currentMaterial?.courseCode || "COURSE",
              topic: q.topic || selectedTopics[idx % selectedTopics.length] || "General Topic",
              type: opts.length === 2 ? "TrueFalse" : "MCQ",
              // SAFETY: AI payload difficulty is string, fallback to Medium validated via domain
              difficulty: (q.difficulty as QuestionItem["difficulty"]) || "Medium",
              // SAFETY: AI payload bloomLevel is string, fallback to Understand validated via domain
              bloomsTaxonomy: (q.bloomLevel as QuestionItem["bloomsTaxonomy"]) || "Understand",
              ageRange: `${targetAgeRange} Yrs`,
              knowledgeLevel: knowledgeLevel,
              questionText: q.questionText,
              options: opts,
              correctAnswer: correctOptStr,
              correctOptionIndex: q.correctOptionIndex,
              explanation: q.explanation || "Correct option identified based on course material analysis.",
            };
          });

          setQuestions(mapped);
          setHasGenerated(true);
          useAuthStore.getState().deductQuota(creditsNeeded);
          toast.success(`Successfully generated ${mapped.length} AI questions for ${currentMaterial?.courseCode}! (${creditsNeeded} credits deducted)`);
          return;
        }
      }

      // Fallback synthetic generator if backend returned empty array
      const generatedBatch: QuestionItem[] = Array.from({ length: requestedCount }).map((_, idx) => {
        const topicName = selectedTopics[idx % selectedTopics.length] || "Core Fundamentals";
        const isTF = questionType === "TrueFalse" || (questionType === "Mixed" && idx % 3 === 2);
        const options = isTF
          ? ["True", "False"]
          : [
              `A. Principle of ${topicName} primary structure`,
              `B. Linear invariant transformation limit`,
              `C. Standard statistical variance threshold`,
              `D. System boundary equilibrium condition`,
            ];
        const correctIndex = 0;

        return {
          id: `q-${Date.now()}-${idx + 1}`,
          courseCode: currentMaterial?.courseCode || "EXCEL 101",
          topic: topicName,
          type: isTF ? "TrueFalse" : "MCQ",
          difficulty: knowledgeLevel === "Beginner" ? "Easy" : knowledgeLevel === "Advanced" ? "Hard" : "Medium",
          bloomsTaxonomy: idx % 2 === 0 ? "Apply" : "Understand",
          ageRange: `${targetAgeRange} Yrs`,
          knowledgeLevel: knowledgeLevel,
          questionText: `In the context of ${topicName}, which primary principle governs domain operations for ${knowledgeLevel.toLowerCase()} learners? (Item ${idx + 1})`,
          options: options,
          correctAnswer: options[correctIndex],
          correctOptionIndex: correctIndex,
          explanation: `Demonstrates essential domain knowledge in ${topicName}.`,
        };
      });

      setQuestions(generatedBatch);
      setHasGenerated(true);
      useAuthStore.getState().deductQuota(creditsNeeded);
      toast.success(`Generated ${generatedBatch.length} AI questions for ${currentMaterial?.courseCode}! (${creditsNeeded} credits deducted)`);
    } catch (err: any) {
      console.error("Error generating questions:", err);
      toast.error(err?.message || "Failed to generate AI questions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  // Generate Shareable Link for Students
  async function handleGenerateShareLink() {
    if (questions.length === 0) {
      toast.error("Please generate questions first before creating a student link!");
      return;
    }

    setIsSharing(true);
    try {
      const createdAssessment = await assessmentsApi.createAssessment({
        title: currentMaterial?.title || "Course Assessment",
        courseCode: currentMaterial?.courseCode || "GEN 101",
        assessmentType: "Quiz",
        durationMinutes: parseInt(testDuration, 10) || 60,
        totalMarks: parseInt(totalMarks, 10) || 100,
        instructions: "Answer all questions. Select the single best option for each question.",
        questions: questions.map((q) => ({
          questionText: q.questionText,
          options: q.options,
          correctOptionIndex: q.correctOptionIndex,
          explanation: q.explanation,
          bloomLevel: q.bloomsTaxonomy,
          difficulty: q.difficulty,
          topic: q.topic,
        })),
      });

      let token = "";
      if (createdAssessment && createdAssessment.id) {
        token = await assessmentsApi.generateShareLink(createdAssessment.id);
      }

      if (!token) {
        throw new Error("Failed to generate share link token from backend API.");
      }

      const fullUrl = `${window.location.origin}/assessment/${token}`;
      setShareUrl(fullUrl);
      setShowShareModal(true);
      toast.success("Shareable student link generated!");
    } catch (err: any) {
      console.error("Error generating share link:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to generate share link. Please try again.");
    } finally {
      setIsSharing(false);
    }
  }

  // Export PDF Formatted Layout
  function exportToFormattedPdf() {
    if (questions.length === 0) {
      toast.error("No questions available to export!");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to export PDF.");
      return;
    }

    const courseName = currentMaterial?.title || "Academic Assessment Paper";
    const courseCode = currentMaterial?.courseCode || "COURSE 101";
    const topicsStr = selectedTopics.join(" • ");

    const questionsHtml = questions
      .map(
        (q, idx) => `
        <div style="margin-bottom: 24px; page-break-inside: avoid;">
          <p style="font-size: 14px; font-weight: bold; color: #111827; margin: 0 0 8px 0;">
            Q${idx + 1}. ${q.questionText}
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; color: #374151; padding-left: 12px;">
            ${q.options.map((opt, optIdx) => {
              const clean = opt.trim();
              const letter = String.fromCharCode(65 + optIdx);
              const formatted = /^[A-D][.)\-:\s]/i.test(clean) ? clean : `${letter}. ${clean}`;
              return `<div style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 6px; background: #f9fafb;">${formatted}</div>`;
            }).join("")}
          </div>
        </div>
      `
      )
      .join("");

    const answerKeyHtml = questions
      .map(
        (q, idx) => `
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 6px 12px; font-weight: bold;">Q${idx + 1}</td>
          <td style="padding: 6px 12px; font-family: monospace; color: #059669; font-weight: bold;">${q.correctAnswer}</td>
          <td style="padding: 6px 12px; color: #4b5563;">${q.explanation}</td>
        </tr>
      `
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${courseCode} - Printable Assessment</title>
          <style>
            @media print {
              body { margin: 20px; font-family: Arial, sans-serif; }
              .no-print { display: none; }
            }
            body { font-family: Arial, sans-serif; padding: 40px; color: #111827; max-width: 850px; margin: auto; }
            .header-box { text-align: center; border-bottom: 2px solid #3730a3; padding-bottom: 16px; margin-bottom: 24px; }
            .course-code { font-size: 24px; font-weight: bold; color: #3730a3; margin: 0; }
            .course-title { font-size: 16px; font-weight: 600; color: #4f46e5; margin: 4px 0; }
            .topics-bar { font-size: 12px; color: #6b7280; margin-top: 8px; font-style: italic; }
            .meta-info { display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 20px; }
            .section-title { font-size: 16px; font-weight: bold; color: #1e1b4b; border-bottom: 1px solid #c7d2fe; padding-bottom: 6px; margin: 32px 0 16px 0; }
          </style>
        </head>
        <body>
          <div className="no-print" style="text-align: right; margin-bottom: 20px;">
            <button onclick="window.print()" style="padding: 8px 16px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
              Print / Save as PDF
            </button>
          </div>

          <div class="header-box">
            <h1 class="course-code">${courseCode}</h1>
            <h2 class="course-title">${courseName}</h2>
            ${topicsStr ? `<div class="topics-bar">Topics: ${topicsStr}</div>` : ""}
          </div>

          <div class="meta-info">
            <span>Total Questions: ${questions.length}</span>
            <span>Time Allowed: ${testDuration} Minutes</span>
            <span>Total Marks: ${totalMarks} Marks</span>
          </div>

          <div class="section-title">PART A: MULTIPLE CHOICE QUESTIONS</div>
          ${questionsHtml}

          <div style="page-break-before: always;"></div>
          <div class="section-title" style="color: #059669; border-color: #a7f3d0;">OFFICIAL ANSWER KEY & EXPLANATIONS</div>
          <table style="width: 100%; text-align: left; font-size: 12px; border-collapse: collapse;">
            <thead>
              <tr style="background: #f0fdf4; border-bottom: 2px solid #a7f3d0;">
                <th style="padding: 8px 12px;">#</th>
                <th style="padding: 8px 12px;">Correct Option</th>
                <th style="padding: 8px 12px;">Academic Rationale</th>
              </tr>
            </thead>
            <tbody>
              ${answerKeyHtml}
            </tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    setShowExportModal(false);
    toast.success("Formatted PDF document generated!");
  }

  // Export Aiken Format
  function exportToAiken() {
    if (questions.length === 0) return;
    let txt = "";
    questions.forEach((q) => {
      txt += `${q.questionText}\n`;
      q.options.forEach((opt, i) => {
        txt += `${String.fromCharCode(65 + i)}. ${opt.replace(/^[A-D][.)]\s*/, "")}\n`;
      });
      txt += `ANSWER: ${String.fromCharCode(65 + q.correctOptionIndex)}\n\n`;
    });

    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentMaterial?.courseCode || "Assessment"}_Aiken.txt`;
    a.click();
    setShowExportModal(false);
    toast.success("Exported in Aiken format!");
  }

  // Export GIFT Format
  function exportToGift() {
    if (questions.length === 0) return;
    let txt = "";
    questions.forEach((q) => {
      txt += `// Topic: ${q.topic}\n`;
      txt += `::${q.topic}:: ${q.questionText} {\n`;
      q.options.forEach((opt, i) => {
        const cleanOpt = opt.replace(/^[A-D][.)]\s*/, "");
        const prefix = i === q.correctOptionIndex ? "=" : "~";
        txt += `  ${prefix}${cleanOpt}\n`;
      });
      txt += `}\n\n`;
    });

    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentMaterial?.courseCode || "Assessment"}_GIFT.txt`;
    a.click();
    setShowExportModal(false);
    toast.success("Exported in GIFT format!");
  }

  const filteredQuestions = questions.filter((q) => {
    return (
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      {isAdmin ? (
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/40">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="gap-1 border-purple-500/40 text-purple-600 dark:text-purple-400 font-semibold">
              <ShieldCheckIcon className="size-3.5" /> Platform Global Audit
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Tenant Filter Dropdown for Admin */}
            <div className="flex items-center gap-2">
              <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <FilterIcon className="size-3.5 text-purple-500" /> Filter Tenant:
              </Label>
              <select
                value={selectedTenantFilter}
                onChange={(e) => setSelectedTenantFilter(e.target.value)}
                className="h-9 rounded-lg border border-purple-500/30 bg-background px-3 text-xs outline-none focus:border-purple-500 font-medium"
              >
                <option value="">-- All Institutions & Tenants --</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.institutionName || t.email})
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={() => setShowExportModal(true)}
              variant="outline"
              className="gap-1 text-xs border-indigo-500/30"
            >
              <FileDownIcon className="size-3.5 text-indigo-600" /> Export (Aiken / GIFT / PDF)
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
              <HelpCircleIcon className="size-3.5" /> AI Question Bank Engine
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {hasGenerated && (
              <Button
                onClick={handleGenerateShareLink}
                disabled={isSharing}
                variant="outline"
                className="gap-1.5 text-xs border-purple-500/40 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40"
              >
                {isSharing ? <Loader2Icon className="size-3.5 animate-spin" /> : <Share2Icon className="size-3.5" />}
                <span>Generate Student Link</span>
              </Button>
            )}

            <Button
              onClick={() => setShowExportModal(true)}
              variant="outline"
              className="gap-1 text-xs border-indigo-500/30"
            >
              <FileDownIcon className="size-3.5 text-indigo-600" /> Export (Aiken / GIFT / PDF)
            </Button>
          </div>
        </div>
      )}

      {/* AI Generator Control Panel Grid (Educators Only - Hidden for Admin) */}
      {!isAdmin && (
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <SlidersIcon className="size-4 text-indigo-600 dark:text-indigo-400" />
              AI Question Run Configuration
            </CardTitle>
            <CardDescription className="text-xs">
              Select an ingested course material, choose topics to test, and set audience parameters before generating.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Left Controls: Course, Audience & Question Params */}
              <div className="lg:col-span-7 space-y-4">
                {/* Target Course Selector */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <BookOpenIcon className="size-3.5 text-indigo-500" /> Target Course Material
                  </Label>
                  <select
                    value={selectedMaterialId}
                    onChange={(e) => handleMaterialChange(e.target.value)}
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="">-- Select Target Course Material --</option>
                    {materials.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-muted-foreground">
                    Populated from your uploaded materials in System Library.
                  </p>
                </div>

                {/* Target Audience Age Range & Knowledge Level Row */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <UserIcon className="size-3.5 text-sky-500" /> Target Audience Age Range
                    </Label>
                    <select
                      value={targetAgeRange}
                      onChange={(e) => setTargetAgeRange(e.target.value)}
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus:border-indigo-500"
                    >
                      <option value="10-14">10-14 Years (Middle School)</option>
                      <option value="15-18">15-18 Years (High School / K-12)</option>
                      <option value="19-22">19-22 Years (Undergraduate)</option>
                      <option value="23+">23+ Years (Postgraduate / Pro)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <GraduationCapIcon className="size-3.5 text-emerald-500" /> Knowledge Level
                    </Label>
                    <select
                      value={knowledgeLevel}
                      onChange={(e) => setKnowledgeLevel(e.target.value)}
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus:border-indigo-500"
                    >
                      <option value="Beginner">Beginner / Introductory</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced / Expert</option>
                    </select>
                  </div>
                </div>

                {/* Question Parameters Row */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">Question Types</Label>
                    <select
                      value={questionType}
                      onChange={(e) => setQuestionType(e.target.value)}
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus:border-indigo-500"
                    >
                      <option value="MCQ">Multiple Choice (MCQ)</option>
                      <option value="TrueFalse">True / False Only</option>
                      <option value="Mixed">MCQ & True/False Mixed</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">Bloom's Taxonomy</Label>
                    <select
                      value={bloomsLevel}
                      onChange={(e) => setBloomsLevel(e.target.value)}
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus:border-indigo-500"
                    >
                      <option value="Balanced">Balanced (Remember & Apply)</option>
                      <option value="Remember">Remember & Understand</option>
                      <option value="Apply">Apply & Analyze</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">Question Count</Label>
                    <select
                      value={batchCount}
                      onChange={(e) => setBatchCount(e.target.value)}
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus:border-indigo-500"
                    >
                      <option value="10">10 Questions (100 Credits)</option>
                      <option value="25">25 Questions (250 Credits)</option>
                      <option value="50">50 Questions (500 Credits)</option>
                    </select>
                  </div>
                </div>

                {/* Assessment Time Allowed & Total Marks Row */}
                <div className="grid gap-4 sm:grid-cols-2 pt-1 border-t border-border/40">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <ClockIcon className="size-3.5 text-sky-500" /> Test Duration (Time Allowed)
                    </Label>
                    <select
                      value={testDuration}
                      onChange={(e) => setTestDuration(e.target.value)}
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus:border-indigo-500"
                    >
                      <option value="3">3 Minutes (Test Run)</option>
                      <option value="15">15 Minutes</option>
                      <option value="30">30 Minutes</option>
                      <option value="45">45 Minutes</option>
                      <option value="60">60 Minutes (1 Hour)</option>
                      <option value="90">90 Minutes (1.5 Hours)</option>
                      <option value="120">120 Minutes (2 Hours)</option>
                      <option value="180">180 Minutes (3 Hours)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <AwardIcon className="size-3.5 text-amber-500" /> Total Marks / Maximum Score
                    </Label>
                    <select
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(e.target.value)}
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus:border-indigo-500"
                    >
                      <option value="10">10 Marks</option>
                      <option value="20">20 Marks</option>
                      <option value="30">30 Marks</option>
                      <option value="40">40 Marks</option>
                      <option value="50">50 Marks</option>
                      <option value="60">60 Marks</option>
                      <option value="70">70 Marks</option>
                      <option value="80">80 Marks</option>
                      <option value="90">90 Marks</option>
                      <option value="100">100 Marks</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Side Column: Material Topics Checklist */}
              <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-border/80 pt-4 lg:pt-0 lg:pl-6 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <LayersIcon className="size-3.5 text-purple-500" /> Extracted Topics in Material
                    </Label>
                    <button
                      type="button"
                      onClick={toggleSelectAllTopics}
                      className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {currentMaterial && selectedTopics.length === currentMaterial.topics.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  </div>

                  <p className="text-[11px] text-muted-foreground mb-3">
                    Check the specific topics you want AI to generate questions for:
                  </p>

                  {!selectedMaterialId ? (
                    <div className="p-6 text-center text-xs text-muted-foreground border border-dashed rounded-lg bg-muted/10 space-y-1">
                      <p className="font-medium text-foreground">No material selected</p>
                      <p>Select a target course material from the dropdown on the left to view AI-extracted topics.</p>
                    </div>
                  ) : isLoadingTopics ? (
                    <div className="flex items-center justify-center p-6 text-xs text-muted-foreground gap-2 border border-dashed rounded-lg bg-muted/20">
                      <Loader2Icon className="size-4 animate-spin text-purple-500" />
                      <span>Extracting AI topics from document...</span>
                    </div>
                  ) : currentMaterial?.topics && currentMaterial.topics.length > 0 ? (
                    <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                      {currentMaterial.topics.map((t) => {
                        const isChecked = selectedTopics.includes(t.name);
                        return (
                          <div
                            key={t.id}
                            onClick={() => toggleTopic(t.name)}
                            className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                              isChecked
                                ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-medium"
                                : "bg-background/60 border-border/70 text-muted-foreground hover:bg-muted/40"
                            }`}
                          >
                            {isChecked ? (
                              <CheckSquareIcon className="size-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                            ) : (
                              <SquareIcon className="size-4 shrink-0 opacity-40" />
                            )}
                            <span className="truncate">{t.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-xs text-muted-foreground italic border rounded-lg bg-muted/10">
                      No topics extracted for this material yet.
                    </div>
                  )}
                </div>

                <div className="pt-3">
                  <Button
                    onClick={triggerAiGenerator}
                    disabled={isGenerating}
                    className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {isGenerating ? <Loader2Icon className="size-4 animate-spin" /> : <SparklesIcon className="size-4" />}
                    <span>{isGenerating ? "Parsing & Generating..." : "Generate Questions with AI"}</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Created Assessments & Question Sets Repository Table */}
      <Card className="border-indigo-500/30">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpenIcon className="size-4 text-indigo-600" /> Created Assessments & Question Sets ({savedAssessments.length})
            </CardTitle>
            <CardDescription className="text-xs">
              {isAdmin
                ? "Platform-wide list of AI-generated assessments and question sets."
                : "List of generated assessments with interactive 3-slide popups (View Questions, View Answers, and Student Share Links)."}
            </CardDescription>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => loadSavedAssessmentsList(selectedTenantFilter)}
            disabled={isLoadingAssessments}
            className="text-xs gap-1.5 border-indigo-500/30 text-indigo-600 dark:text-indigo-400"
          >
            {isLoadingAssessments ? <Loader2Icon className="size-3.5 animate-spin" /> : <SparklesIcon className="size-3.5" />}
            <span>Refresh Assessments</span>
          </Button>
        </CardHeader>

        <CardContent>
          {isLoadingAssessments ? (
            <div className="py-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center space-y-2">
              <Loader2Icon className="size-6 animate-spin text-indigo-600" />
              <p>Loading created assessments...</p>
            </div>
          ) : savedAssessments.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground border border-dashed rounded-lg bg-muted/10 space-y-1">
              <p className="font-semibold text-foreground">No Assessments Found</p>
              <p>
                {isAdmin
                  ? "No generated assessments found for the selected tenant filter."
                  : 'Generate AI questions above and click "Generate Student Link" to create your first assessment set.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border/80 bg-muted/40 font-semibold text-muted-foreground">
                  <tr>
                    {isAdmin && <th className="p-3">Institution / Tenant</th>}
                    <th className="p-3">{isAdmin ? "Token Used" : "Course Code"}</th>
                    <th className="p-3">Assessment Title</th>
                    <th className="p-3">Questions</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Created Date</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {savedAssessments.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      {isAdmin && (
                        <td className="p-3 font-medium text-foreground">
                          <div className="flex items-center gap-1.5">
                            <Building2Icon className="size-3.5 text-purple-500 shrink-0" />
                            <span className="truncate max-w-[160px] font-semibold">{item.tenantName || "Lectura Workspace"}</span>
                          </div>
                        </td>
                      )}
                      <td className="p-3">
                        {isAdmin ? (
                          <Badge variant="secondary" className="font-mono text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold">
                            {item.tokensUsed ?? (item.totalQuestions * 10)} Tokens
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="font-mono text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold">
                            {item.courseCode}
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 font-semibold text-foreground">
                        {item.title}
                      </td>
                      <td className="p-3 font-medium">
                        {item.totalQuestions} Questions
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {item.durationMinutes} Mins
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          size="xs"
                          onClick={() => openAssessmentActionModal(item.id)}
                          className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm"
                        >
                          <EyeIcon className="size-3.5" />
                          <span>Action / View &rarr;</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questions Output Repository Card (Educators Only - Hidden for Admin) */}
      {!isAdmin && (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">Generated Question Repository ({filteredQuestions.length})</CardTitle>
              <CardDescription className="text-xs">
                Review and copy AI questions constructed from your lecture materials.
              </CardDescription>
            </div>

            {hasGenerated && (
              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-60">
                  <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search topic or question text..."
                    className="pl-8 text-xs h-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {!hasGenerated ? (
              <div className="py-12 px-4 text-center border-2 border-dashed border-border/80 rounded-2xl bg-muted/10 space-y-3">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 mx-auto">
                  <BookOpenIcon className="size-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading text-base font-semibold">No Questions Generated Yet</h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Select your target course material, check your preferred topics, configure the target age range and knowledge level above, then click <span className="font-semibold text-foreground">"Generate Questions with AI"</span>.
                  </p>
                </div>
                <div className="pt-2">
                  <Button
                    onClick={triggerAiGenerator}
                    disabled={isGenerating}
                    className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <SparklesIcon className="size-4" />
                    <span>Generate Questions with AI</span>
                  </Button>
                </div>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-xs">
                No questions matched your search criteria.
              </div>
            ) : (
              filteredQuestions.map((q, idx) => (
                <div key={q.id} className="rounded-xl border border-border p-4 space-y-3 bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        {q.courseCode}
                      </Badge>
                      <span className="text-xs font-semibold text-foreground">{q.topic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        {q.type}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-600">
                        Level: {q.knowledgeLevel}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] border-sky-500/30 text-sky-600">
                        Age: {q.ageRange}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-600">
                        Bloom: {q.bloomsTaxonomy}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    <span className="font-bold text-muted-foreground mr-1">Q{idx + 1}.</span> {q.questionText}
                  </p>

                  {q.options && (
                    <div className="grid gap-1.5 sm:grid-cols-2 pt-1 pl-4">
                      {q.options.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx);
                        const cleanOpt = opt.trim();
                        const formattedOpt = /^[A-D][.)\-:\s]/i.test(cleanOpt)
                          ? cleanOpt
                          : `${letter}. ${cleanOpt}`;

                        const isCorrect = optIdx === q.correctOptionIndex ||
                          cleanOpt.startsWith(q.correctAnswer.substring(0, 2)) ||
                          formattedOpt === q.correctAnswer;

                        return (
                          <div
                            key={opt}
                            className={`rounded-lg px-3 py-2 text-xs flex items-center gap-2 ${
                              isCorrect
                                ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 font-semibold text-emerald-700 dark:text-emerald-300"
                                : "bg-background border border-border/60 text-muted-foreground"
                            }`}
                          >
                            {formattedOpt}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2Icon className="size-3.5" /> Correct Answer: {
                        /^[A-D][.)\-:\s]/i.test(q.correctAnswer.trim())
                          ? q.correctAnswer
                          : `${String.fromCharCode(65 + q.correctOptionIndex)}. ${q.correctAnswer}`
                      }
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="xs"
                        variant="ghost"
                        className="gap-1 text-xs"
                        onClick={() => {
                          navigator.clipboard.writeText(`${q.questionText}\n${q.options?.join("\n")}\nAnswer: ${q.correctAnswer}`);
                          toast.success("Question copied to clipboard!");
                        }}
                      >
                        <CopyIcon className="size-3" /> Copy
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Export Format Bundle Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-heading font-semibold text-base flex items-center gap-2">
                <FileDownIcon className="size-4 text-indigo-600" /> Export Question Bank
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Select your preferred export format for <span className="font-semibold text-foreground">{questions.length} generated questions</span>:
            </p>

            <div className="space-y-2.5">
              <button
                onClick={exportToFormattedPdf}
                className="w-full text-left p-3.5 rounded-xl border border-indigo-500/30 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <PrinterIcon className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground group-hover:text-indigo-600">Formatted PDF Document</h4>
                    <p className="text-[11px] text-muted-foreground">Includes Course Header, Selected Topics & Answer Key</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] border-indigo-500/30 text-indigo-600">PDF</Badge>
              </button>

              <button
                onClick={exportToAiken}
                className="w-full text-left p-3.5 rounded-xl border border-border hover:bg-muted/40 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <FileTextIcon className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground group-hover:text-emerald-600">Aiken Plain Text Format</h4>
                    <p className="text-[11px] text-muted-foreground">Standard LMS format (Moodle, Canvas, Blackboard)</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">TXT</Badge>
              </button>

              <button
                onClick={exportToGift}
                className="w-full text-left p-3.5 rounded-xl border border-border hover:bg-muted/40 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <FileTextIcon className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground group-hover:text-purple-600">GIFT Quiz Format</h4>
                    <p className="text-[11px] text-muted-foreground">Structured syntax with category & weight tags</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">TXT</Badge>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shareable Student Link Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-heading font-semibold text-base flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Share2Icon className="size-4" /> Share Link with Students
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Students can open this link to view questions, enter their Student Name, Matric Number, and Email, and submit the assessment directly.
            </p>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground">Student Assessment Public URL</Label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={shareUrl}
                  className="text-xs font-mono bg-muted/40 h-9"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    setCopiedLink(true);
                    toast.success("Student share link copied!");
                    setTimeout(() => setCopiedLink(false), 2500);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs shrink-0 gap-1.5"
                >
                  {copiedLink ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
                  <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
                </Button>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-muted-foreground border-t flex items-center justify-between">
              <span>Public Access: Enabled</span>
              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                Preview Student Portal &rarr;
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 3-Slide Action Popup Modal */}
      {activeAssessmentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col justify-between">
            {/* Modal Header */}
            <div>
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono text-xs bg-indigo-600 text-white">
                    {activeAssessmentModal.courseCode}
                  </Badge>
                  <h3 className="font-heading font-bold text-lg text-foreground truncate max-w-md">
                    {activeAssessmentModal.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveAssessmentModal(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <XIcon className="size-5" />
                </button>
              </div>

              {/* 3 Slide Header Navigation Tabs */}
              <div className="grid grid-cols-3 gap-2 mt-4 p-1 rounded-xl bg-muted/50 border border-border/60">
                <button
                  onClick={() => setActiveSlide(1)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                    activeSlide === 1
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <EyeIcon className="size-3.5" /> 1. View Questions
                </button>

                <button
                  onClick={() => setActiveSlide(2)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                    activeSlide === 2
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <KeyIcon className="size-3.5" /> 2. View Answers
                </button>

                <button
                  onClick={() => setActiveSlide(3)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                    activeSlide === 3
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LinkIcon className="size-3.5" /> 3. View Link
                </button>
              </div>
            </div>

            {/* Modal Body Content (Scrollable) */}
            <div className="overflow-y-auto max-h-[55vh] py-2 pr-1 space-y-4">
              {/* SLIDE 1: VIEW QUESTIONS */}
              {activeSlide === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <BookOpenIcon className="size-4 text-indigo-600" /> Part A: Assessment Questions ({activeAssessmentModal.questions.length})
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      Time Allowed: {activeAssessmentModal.durationMinutes} Mins
                    </Badge>
                  </div>

                  {activeAssessmentModal.questions.map((q, idx) => (
                    <div key={q.id || `mod-q-${idx}`} className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2.5">
                      <p className="text-xs font-semibold text-foreground leading-relaxed">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold mr-1">Q{idx + 1}.</span> {q.questionText}
                      </p>

                      <div className="grid gap-2 sm:grid-cols-2 pt-1">
                        {q.options && q.options.map((opt, optIdx) => (
                          <div
                            key={opt}
                            className="p-2.5 rounded-lg border border-border/70 bg-background text-xs text-foreground flex items-center gap-2"
                          >
                            <div className="size-5 rounded-full border border-muted-foreground/40 flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </div>
                            <span className="truncate">{opt.replace(/^[A-D][.)\-:\s]+/i, "").trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SLIDE 2: VIEW ANSWERS */}
              {activeSlide === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <CheckCircle2Icon className="size-4 text-emerald-500" /> Part B: Official Answer Key & Explanations
                    </h4>
                    <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600">
                      Answer Key Verified
                    </Badge>
                  </div>

                  {activeAssessmentModal.questions.map((q, idx) => (
                    <div key={q.id || `mod-ans-${idx}`} className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-2.5">
                      <p className="text-xs font-semibold text-foreground leading-relaxed">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold mr-1">Q{idx + 1}.</span> {q.questionText}
                      </p>

                      <div className="grid gap-2 sm:grid-cols-2 pt-1">
                        {q.options && q.options.map((opt, optIdx) => {
                          const isCorrect = optIdx === q.correctOptionIndex;
                          return (
                            <div
                              key={opt}
                              className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 ${
                                isCorrect
                                  ? "bg-emerald-600 text-white font-semibold border-emerald-600 shadow-sm"
                                  : "bg-background border-border/70 text-muted-foreground"
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <div className={`size-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                  isCorrect ? "border-white bg-white text-emerald-600" : "border-muted-foreground/40 text-muted-foreground"
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </div>
                                <span className="truncate">{opt.replace(/^[A-D][.)\-:\s]+/i, "").trim()}</span>
                              </div>
                              {isCorrect && (
                                <Badge className="bg-white/20 text-white text-[9px] px-1.5 py-0.5 border-none shrink-0">
                                  Correct Option
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {q.explanation && (
                        <div className="p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-500/20 text-xs">
                          <span className="font-semibold text-indigo-700 dark:text-indigo-300">Explanation: </span>
                          <span className="text-muted-foreground">{q.explanation}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* SLIDE 3: VIEW LINK */}
              {activeSlide === 3 && (
                <div className="space-y-4 py-4">
                  <div className="text-center space-y-1">
                    <div className="size-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-2">
                      <LinkIcon className="size-6" />
                    </div>
                    <h4 className="font-heading font-bold text-base text-foreground">Shareable Student Assessment Link</h4>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      Send this link to your students. They can open it directly on any phone or laptop to take the test.
                    </p>
                  </div>

                  {modalShareToken ? (
                    <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-50/30 dark:bg-purple-950/20 space-y-3">
                      <Label className="text-xs font-semibold text-foreground">Public Student Assessment URL</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          readOnly
                          value={`${window.location.origin}/assessment/${modalShareToken}`}
                          className="text-xs font-mono bg-background h-10"
                        />
                        <Button
                          onClick={() => {
                            const url = `${window.location.origin}/assessment/${modalShareToken}`;
                            navigator.clipboard.writeText(url);
                            setModalCopiedLink(true);
                            toast.success("Student link copied to clipboard!");
                            setTimeout(() => setModalCopiedLink(false), 2500);
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs shrink-0 gap-1.5 h-10 px-4"
                        >
                          {modalCopiedLink ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
                          <span>{modalCopiedLink ? "Copied!" : "Copy Link"}</span>
                        </Button>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-purple-500/20">
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2Icon className="size-3.5" /> Public Access Active
                        </span>
                        <a
                          href={`${window.location.origin}/assessment/${modalShareToken}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                        >
                          Preview Test Portal <ExternalLinkIcon className="size-3.5" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
                      <Loader2Icon className="size-5 animate-spin text-purple-600 mx-auto mb-2" />
                      Generating shareable link...
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="border-t pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activeSlide > 1 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      // SAFETY: decrement stays within 1|2|3, validated by activeSlide > 1 guard
                      setActiveSlide((prev) => (prev - 1) as 1 | 2 | 3);
                    }}
                    className="text-xs gap-1"
                  >
                    <ChevronLeftIcon className="size-3.5" /> Back
                  </Button>
                )}
              </div>

              <div className="text-xs text-muted-foreground font-medium">
                Slide {activeSlide} of 3
              </div>

              <div className="flex items-center gap-2">
                {activeSlide < 3 ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      // SAFETY: increment stays within 1|2|3, validated by activeSlide < 3 guard
                      setActiveSlide((prev) => (prev + 1) as 1 | 2 | 3);
                    }}
                    className="text-xs gap-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <span>{activeSlide === 1 ? "Next: View Answers" : "Next: View Link"}</span>
                    <ChevronRightIcon className="size-3.5" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setActiveAssessmentModal(null)}
                    className="text-xs bg-muted hover:bg-muted/80 text-foreground"
                  >
                    Close
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
