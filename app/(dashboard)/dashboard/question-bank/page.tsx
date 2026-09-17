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
} from "lucide-react";
import { toast } from "sonner";
import { documentsApi, IngestedDocumentDto } from "@/lib/api/services/documents";

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
  bloomsTaxonomy: "Remember" | "Understand" | "Apply" | "Analyze";
  ageRange: string;
  knowledgeLevel: string;
  questionText: string;
  options?: string[];
  correctAnswer: string;
}

// Fallback materials list if no documents in DB yet
const defaultMaterials: MaterialCourse[] = [
  {
    id: "mat-1",
    courseCode: "PHY 301",
    title: "PHY 301 - Quantum Mechanics & Atomic Structure",
    topics: [
      { id: "t-1", name: "Schrödinger Wave Equation" },
      { id: "t-2", name: "Photoelectric Effect" },
      { id: "t-3", name: "Wave-Particle Duality" },
      { id: "t-4", name: "Heisenberg Uncertainty Principle" },
      { id: "t-5", name: "Quantum Tunneling & Potential Wells" },
    ],
  },
  {
    id: "mat-2",
    courseCode: "CSC 201",
    title: "CSC 201 - Operating Systems & Process Scheduling",
    topics: [
      { id: "t-6", name: "CPU Scheduling Algorithms (SJF, FCFS, RR)" },
      { id: "t-7", name: "Memory Paging & Virtual Memory" },
      { id: "t-8", name: "Process Synchronization & Semaphores" },
      { id: "t-9", name: "Deadlock Detection & Prevention" },
    ],
  },
  {
    id: "mat-3",
    courseCode: "ENG 101",
    title: "ENG 101 - Academic Essay Writing Principles",
    topics: [
      { id: "t-10", name: "Thesis Statement Formulation" },
      { id: "t-11", name: "Paragraph Cohesion & Transitions" },
      { id: "t-12", name: "Citation Formats & Source Synthesis" },
    ],
  },
];

export default function QuestionBankPage() {
  const [materials, setMaterials] = useState<MaterialCourse[]>(defaultMaterials);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  
  // Filtering & AI Parameters
  const [questionType, setQuestionType] = useState<string>("MCQ");
  const [bloomsLevel, setBloomsLevel] = useState<string>("Balanced");
  const [batchCount, setBatchCount] = useState<string>("10");
  const [targetAgeRange, setTargetAgeRange] = useState<string>("19-22");
  const [knowledgeLevel, setKnowledgeLevel] = useState<string>("Intermediate");

  // Questions Repository State (Initially empty until user generates)
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load uploaded materials from API
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
              topics: [
                { id: `${doc.documentId}-1`, name: "Core Concepts & Definitions" },
                { id: `${doc.documentId}-2`, name: "Key Principles & Theoretical Framework" },
                { id: `${doc.documentId}-3`, name: "Practical Applications & Case Analysis" },
                { id: `${doc.documentId}-4`, name: "Problem Solving & Quantitative Methods" },
              ],
            };
          });
          setMaterials(mapped);
          if (mapped.length > 0) {
            setSelectedMaterialId(mapped[0].id);
            setSelectedTopics(mapped[0].topics.map((t) => t.name));
          }
        } else {
          setSelectedMaterialId(defaultMaterials[0].id);
          setSelectedTopics(defaultMaterials[0].topics.map((t) => t.name));
        }
      } catch (err) {
        console.error("Error loading uploaded materials:", err);
        setSelectedMaterialId(defaultMaterials[0].id);
        setSelectedTopics(defaultMaterials[0].topics.map((t) => t.name));
      }
    }
    loadUploadedMaterials();
  }, []);

  const currentMaterial = materials.find((m) => m.id === selectedMaterialId) || materials[0];

  function handleMaterialChange(matId: string) {
    setSelectedMaterialId(matId);
    const mat = materials.find((m) => m.id === matId);
    if (mat) {
      setSelectedTopics(mat.topics.map((t) => t.name));
    }
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

  function triggerAiGenerator() {
    if (!selectedMaterialId || selectedTopics.length === 0) {
      toast.error("Please select a target course material and at least one topic!");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const generatedBatch: QuestionItem[] = [
        {
          id: `q-${Date.now()}-1`,
          courseCode: currentMaterial?.courseCode || "PHY 301",
          topic: selectedTopics[0] || "Core Theory",
          type: questionType.includes("TrueFalse") ? "TrueFalse" : "MCQ",
          difficulty: knowledgeLevel === "Beginner" ? "Easy" : knowledgeLevel === "Advanced" ? "Hard" : "Medium",
          bloomsTaxonomy: "Apply",
          ageRange: `${targetAgeRange} Yrs`,
          knowledgeLevel: knowledgeLevel,
          questionText: `In the context of ${selectedTopics[0] || "the course material"}, which principles govern physical state transformations for ${knowledgeLevel.toLowerCase()} learners?`,
          options: [
            "A. Conservation of total system probability & wave superposition",
            "B. Linear momentum invariant decay constant",
            "C. Thermal entropy balance calculation",
            "D. Static potential field equilibrium",
          ],
          correctAnswer: "A. Conservation of total system probability & wave superposition",
        },
        {
          id: `q-${Date.now()}-2`,
          courseCode: currentMaterial?.courseCode || "PHY 301",
          topic: selectedTopics[1] || selectedTopics[0] || "Key Principles",
          type: "MCQ",
          difficulty: "Medium",
          bloomsTaxonomy: "Analyze",
          ageRange: `${targetAgeRange} Yrs`,
          knowledgeLevel: knowledgeLevel,
          questionText: `What primary metric determines execution efficiency when evaluating ${selectedTopics[1] || selectedTopics[0]}?`,
          options: [
            "A. Mean turnaround & queue waiting duration",
            "B. Shortest Job First preemptive overhead",
            "C. Context switch register allocation frequency",
            "D. Thread stack boundary offset",
          ],
          correctAnswer: "A. Mean turnaround & queue waiting duration",
        },
        {
          id: `q-${Date.now()}-3`,
          courseCode: currentMaterial?.courseCode || "ENG 101",
          topic: selectedTopics[selectedTopics.length - 1] || "Synthesis",
          type: "TrueFalse",
          difficulty: "Easy",
          bloomsTaxonomy: "Understand",
          ageRange: `${targetAgeRange} Yrs`,
          knowledgeLevel: knowledgeLevel,
          questionText: `True or False: Formulating a focused hypothesis requires supporting empirical evidence tailored to target audience level (${targetAgeRange} years).`,
          options: ["True", "False"],
          correctAnswer: "True (Hypothesis formulation must align with domain complexity and target age tier)",
        },
      ];

      setQuestions(generatedBatch);
      setHasGenerated(true);
      setIsGenerating(false);
      toast.success(`Successfully generated AI questions for ${currentMaterial?.courseCode}!`);
    }, 1800);
  }

  const filteredQuestions = questions.filter((q) => {
    return (
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
              <HelpCircleIcon className="size-3.5" /> AI Question Bank Engine
            </Badge>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight mt-1">Questionbank</h1>
          <p className="text-sm text-muted-foreground">
            Generate questions from uploaded lecture materials, construct custom assessments, and export format bundles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1 text-xs">
            <FileDownIcon className="size-3.5" /> Export (Aiken / GIFT / PDF)
          </Button>
          <Button
            onClick={triggerAiGenerator}
            disabled={isGenerating}
            className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
          >
            {isGenerating ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <SparklesIcon className="size-4" />
            )}
            <span>{isGenerating ? "AI Generating..." : "Generate Questions with AI"}</span>
          </Button>
        </div>
      </div>

      {/* AI Generator Control Panel Grid */}
      <Card className="border-indigo-500/30 bg-gradient-to-r from-indigo-50/40 via-background to-purple-50/40 dark:from-indigo-950/20 dark:to-purple-950/20">
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
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-muted-foreground">
                  Populated from your uploaded materials in The Library.
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
                    <option value="ShortAnswer">Short Answer / Essay</option>
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
                    <option value="10">10 Questions (250 Credits)</option>
                    <option value="25">25 Questions (625 Credits)</option>
                    <option value="50">50 Questions (1,250 Credits)</option>
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

                <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                  {currentMaterial?.topics.map((t) => {
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

      {/* Questions Output Repository Card */}
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
                    {q.options.map((opt) => {
                      const isCorrect = opt.startsWith(q.correctAnswer.substring(0, 2));
                      return (
                        <div
                          key={opt}
                          className={`rounded-lg px-3 py-1.5 text-xs ${
                            isCorrect
                              ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 font-semibold text-emerald-700 dark:text-emerald-300"
                              : "bg-background border border-border/60 text-muted-foreground"
                          }`}
                        >
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2Icon className="size-3.5" /> Correct Answer: {q.correctAnswer}
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
    </div>
  );
}

