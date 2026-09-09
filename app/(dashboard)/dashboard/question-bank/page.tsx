"use client";

import { useState } from "react";
import {
  HelpCircleIcon,
  SparklesIcon,
  PlusIcon,
  FileDownIcon,
  FilterIcon,
  SearchIcon,
  CheckCircle2Icon,
  CopyIcon,
  BookOpenIcon,
  SlidersIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface QuestionItem {
  id: string;
  courseCode: string;
  topic: string;
  type: "MCQ" | "TrueFalse" | "ShortAnswer";
  difficulty: "Easy" | "Medium" | "Hard";
  bloomsTaxonomy: "Remember" | "Understand" | "Apply" | "Analyze";
  questionText: string;
  options?: string[];
  correctAnswer: string;
}

const mockQuestions: QuestionItem[] = [
  {
    id: "q-101",
    courseCode: "PHY 301",
    topic: "Schrödinger Wave Equation",
    type: "MCQ",
    difficulty: "Medium",
    bloomsTaxonomy: "Apply",
    questionText: "What represents the physical significance of the squared wave function |Ψ|² in quantum physics?",
    options: [
      "A. The particle momentum density",
      "B. The probability density of finding the particle at a given point",
      "C. The total kinetic energy of the electron cloud",
      "D. The charge density constant",
    ],
    correctAnswer: "B. The probability density of finding the particle at a given point",
  },
  {
    id: "q-102",
    courseCode: "CSC 201",
    topic: "Operating Systems Scheduling",
    type: "MCQ",
    difficulty: "Easy",
    bloomsTaxonomy: "Remember",
    questionText: "Which CPU scheduling algorithm gives minimum average waiting time for a given set of processes?",
    options: [
      "A. First Come First Served (FCFS)",
      "B. Shortest Job First (SJF)",
      "C. Round Robin (RR)",
      "D. Priority Scheduling",
    ],
    correctAnswer: "B. Shortest Job First (SJF)",
  },
  {
    id: "q-103",
    courseCode: "PHY 301",
    topic: "Photoelectric Effect",
    type: "TrueFalse",
    difficulty: "Easy",
    bloomsTaxonomy: "Understand",
    questionText: "True or False: Increasing the intensity of monochromatic light increases the maximum kinetic energy of emitted photoelectrons.",
    options: ["True", "False"],
    correctAnswer: "False (It increases photon flux and emission rate, not kinetic energy)",
  },
];

export default function QuestionBankPage() {
  const [questions] = useState<QuestionItem[]>(mockQuestions);
  const [selectedCourse, setSelectedCourse] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredQuestions = questions.filter((q) => {
    const matchesCourse = selectedCourse === "All" || q.courseCode === selectedCourse;
    const matchesSearch =
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  function triggerAiGenerator() {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  }

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
          <Button onClick={triggerAiGenerator} disabled={isGenerating} className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white">
            <SparklesIcon className="size-4 animate-spin" style={{ animationDuration: "3s" }} />
            {isGenerating ? "AI Generating..." : "Generate Questions with AI"}
          </Button>
        </div>
      </div>

      {/* AI Generator Control Panel */}
      <Card className="border-indigo-500/30 bg-gradient-to-r from-indigo-50/40 via-background to-purple-50/40 dark:from-indigo-950/20 dark:to-purple-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <SlidersIcon className="size-4 text-indigo-600 dark:text-indigo-400" />
            AI Question Run Configuration
          </CardTitle>
          <CardDescription className="text-xs">
            Configure generation parameters based on your ingested course material.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Target Course</label>
            <select className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus:border-primary">
              <option>PHY 301 - Quantum Mechanics</option>
              <option>CSC 201 - Operating Systems</option>
              <option>ENG 101 - Academic Writing</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Question Types</label>
            <select className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus:border-primary">
              <option>MCQ (Multiple Choice) & True/False</option>
              <option>Multiple Choice (MCQ) Only</option>
              <option>True / False Only</option>
              <option>Short Answer / Essay</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Bloom's Taxonomy Level</label>
            <select className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus:border-primary">
              <option>Balanced (Remember, Apply, Analyze)</option>
              <option>Remember & Understand (Lower Order)</option>
              <option>Apply & Analyze (Higher Order)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Question Batch Count</label>
            <select className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus:border-primary">
              <option>25 Questions (625 Credits)</option>
              <option>50 Questions (1,250 Credits)</option>
              <option>10 Questions (250 Credits)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Filter & Questions List */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">Generated Question Repository ({filteredQuestions.length})</CardTitle>
            <CardDescription className="text-xs">
              Review and select questions for your assessment assembly.
            </CardDescription>
          </div>

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
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredQuestions.map((q, idx) => (
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
                    {q.difficulty}
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
                  <Button size="xs" variant="ghost" className="gap-1 text-xs">
                    <CopyIcon className="size-3" /> Copy
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
