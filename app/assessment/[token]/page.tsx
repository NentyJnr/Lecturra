"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import {
  GraduationCapIcon,
  BookOpenIcon,
  UserIcon,
  MailIcon,
  IdCardIcon,
  CheckCircle2Icon,
  XCircleIcon,
  Loader2Icon,
  AlertCircleIcon,
  SparklesIcon,
  ClockIcon,
  AwardIcon,
} from "lucide-react";
import { toast } from "sonner";
import { assessmentsApi, PublicAssessmentDto, SubmissionResultDto } from "@/lib/api/services/assessments";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export default function PublicStudentAssessmentPage() {
  const params = useParams();
  const token = params?.token as string;

  const [assessment, setAssessment] = useState<PublicAssessmentDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Student Info
  const [studentName, setStudentName] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [studentEmail, setStudentEmail] = useState("");

  // Selected Answers: Map<questionIndex, selectedOptionIndex>
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResultDto | null>(null);

  // Guard to prevent duplicate submission triggers
  const hasSubmittedRef = useRef(false);

  // Timer State (seconds remaining)
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number | null>(null);

  useEffect(() => {
    async function loadAssessment() {
      if (!token) return;
      setIsLoading(true);
      try {
        const data = await assessmentsApi.getPublicAssessment(token);
        if (data) {
          // Shuffle questions so every student gets a randomized sequence
          const shuffledQuestions = data.questions ? [...data.questions] : [];
          for (let i = shuffledQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
          }
          setAssessment({ ...data, questions: shuffledQuestions });

          if (data.durationMinutes && data.durationMinutes > 0) {
            setTimeLeftSeconds(data.durationMinutes * 60);
          }
        } else {
          setErrorMsg("Assessment not found or access link expired.");
        }
      } catch (err: any) {
        console.error("Error loading student assessment:", err);
        setErrorMsg(err?.response?.data?.message || "Failed to load assessment. Please verify your share link.");
      } finally {
        setIsLoading(false);
      }
    }
    loadAssessment();
  }, [token]);

  // Submit Handler
  const handleSubmit = useCallback(
    async (isAutoSubmit = false) => {
      if (hasSubmittedRef.current || isSubmitting || result) return;

      if (!isAutoSubmit) {
        if (!studentName.trim()) {
          toast.error("Please enter your full name before submitting.");
          return;
        }
      }

      if (!assessment || !assessment.questions) return;

      if (!isAutoSubmit && Object.keys(answers).length < assessment.questions.length) {
        const unanswered = assessment.questions.length - Object.keys(answers).length;
        if (!confirm(`You have ${unanswered} unanswered question(s). Are you sure you want to submit?`)) {
          return;
        }
      }

      hasSubmittedRef.current = true;
      setIsSubmitting(true);
      try {
        const formattedAnswers = Object.entries(answers).map(([qIdxStr, optIdx]) => {
          const qIdx = parseInt(qIdxStr, 10);
          const targetQ = assessment.questions[qIdx];
          return {
            questionId: targetQ?.id || "00000000-0000-0000-0000-000000000000",
            questionIndex: qIdx,
            selectedOptionIndex: optIdx,
          };
        });

        const sName = studentName.trim() || "Anonymous Student";
        const mNum = matricNumber.trim() || undefined;
        const sMail = studentEmail.trim() || undefined;

        const res = await assessmentsApi.submitStudentAssessment(token, {
          studentName: sName,
          matricNumber: mNum,
          studentEmail: sMail,
          answers: formattedAnswers as any,
        });

        setResult(
          res || {
            score: Object.keys(answers).length,
            totalQuestions: assessment.questions.length,
            percentage: Math.round((Object.keys(answers).length / assessment.questions.length) * 100),
            submissionId: `sub-${Date.now()}`,
            submittedAt: new Date().toISOString(),
          }
        );

        if (isAutoSubmit) {
          toast.warning("Time's up! Your assessment has been automatically submitted.");
        } else {
          toast.success("Assessment submitted successfully!");
        }
      } catch (err: any) {
        console.error("Error submitting assessment:", err);
        hasSubmittedRef.current = false;
        toast.error(err?.response?.data?.message || "Failed to submit assessment.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [answers, assessment, isSubmitting, matricNumber, result, studentEmail, studentName, token]
  );

  // Countdown Timer Effect
  useEffect(() => {
    if (timeLeftSeconds === null || timeLeftSeconds <= 0 || result || isSubmitting || hasSubmittedRef.current) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timer);
          if (!hasSubmittedRef.current) {
            handleSubmit(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeftSeconds, result, isSubmitting, handleSubmit]);

  function handleOptionSelect(qIdx: number, optIdx: number) {
    if (result) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  }

  function formatTime(totalSecs: number) {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) {
      const remMins = mins % 60;
      return `${hrs}h ${remMins < 10 ? "0" : ""}${remMins}m ${secs < 10 ? "0" : ""}${secs}s`;
    }
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader2Icon className="size-8 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm text-muted-foreground font-medium">Loading Assessment Portal...</p>
      </div>
    );
  }

  if (errorMsg || !assessment) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full text-center border-red-500/30">
          <CardHeader>
            <AlertCircleIcon className="size-10 text-red-500 mx-auto mb-2" />
            <CardTitle className="text-lg">Assessment Unavailable</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              {errorMsg || "Invalid or expired assessment link."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const totalAssessmentMarks = assessment.totalMarks || 100;
  const markPerQuestion =
    assessment.questions.length > 0
      ? Math.round((totalAssessmentMarks / assessment.questions.length) * 10) / 10
      : 0;

  const isLowTime = timeLeftSeconds !== null && timeLeftSeconds < 300;

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      {/* Calculate Display Score */}
      {(() => {
        const displayEarnedScore = result ? (result.totalScore ?? result.score ?? 0) : 0;
        const displayMaxMarks = result ? (result.maxScore ?? totalAssessmentMarks) : totalAssessmentMarks;

        return (
          <>
            {/* Sticky Top Header Banner */}
            {result ? (
              <div className="sticky top-4 z-40 flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 backdrop-blur border border-emerald-500/30 shadow-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2Icon className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    Assessment Status: Completed
                  </span>
                </div>
                <Badge className="bg-emerald-600 text-white font-mono font-bold text-sm px-3 py-1">
                  Score: {displayEarnedScore} / {displayMaxMarks} Marks ({result.percentage}%)
                </Badge>
              </div>
            ) : timeLeftSeconds !== null ? (
              <div className="sticky top-4 z-40 flex items-center justify-between p-3 rounded-xl bg-background/95 backdrop-blur border border-indigo-500/30 shadow-lg">
                <div className="flex items-center gap-2">
                  <ClockIcon className={`size-4 ${isLowTime ? "text-red-500 animate-pulse" : "text-indigo-600"}`} />
                  <span className="text-xs font-semibold text-muted-foreground">Time Remaining:</span>
                </div>
                <Badge
                  className={`font-mono font-bold text-sm px-3 py-1 ${
                    isLowTime ? "bg-red-600 text-white animate-bounce" : "bg-indigo-600 text-white"
                  }`}
                >
                  {formatTime(timeLeftSeconds)}
                </Badge>
              </div>
            ) : null}

            {/* Post-Submission Score Banner */}
            {result && (
              <Card className="border-emerald-500/40 bg-gradient-to-r from-emerald-50/40 via-background to-teal-50/40 dark:from-emerald-950/40 dark:to-teal-950/40 shadow-xl">
                <CardHeader className="text-center pb-3">
                  <CheckCircle2Icon className="size-14 text-emerald-500 mx-auto mb-2" />
                  <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                    Assessment Submitted & Graded!
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Student: <span className="font-semibold text-foreground">{studentName || result.studentName || "Anonymous Student"}</span>{" "}
                    {matricNumber || result.matricNumber ? `(${matricNumber || result.matricNumber})` : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center pb-6 space-y-2">
                  <div className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400">
                    {displayEarnedScore} / {displayMaxMarks} Marks
                  </div>
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1">
                    Overall Percentage: {result.percentage}% — Status: {result.percentage >= 50 ? "PASSED" : "FAILED"}
                  </Badge>
                </CardContent>
              </Card>
            )}
          </>
        );
      })()}

      {/* Top Banner: Course Title & Header */}
      <Card className="border-indigo-500/30 bg-gradient-to-r from-indigo-50/50 via-background to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-600 text-white font-mono text-xs">
                {assessment.courseCode}
              </Badge>
              <Badge variant="outline" className="gap-1 text-xs border-amber-500/40 text-amber-600 dark:text-amber-400">
                <AwardIcon className="size-3.5" /> Total Marks: {totalAssessmentMarks}
              </Badge>
            </div>
            {assessment.durationMinutes > 0 && (
              <Badge variant="outline" className="gap-1 text-xs border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
                <ClockIcon className="size-3.5" /> Time Allowed: {assessment.durationMinutes} Mins
              </Badge>
            )}
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {assessment.title}
          </CardTitle>
          {assessment.topics && assessment.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {assessment.topics.map((t) => (
                <Badge key={t} variant="secondary" className="text-[11px] bg-purple-500/10 text-purple-700 dark:text-purple-300">
                  {t}
                </Badge>
              ))}
            </div>
          )}
          {assessment.instructions && (
            <p className="text-xs text-muted-foreground pt-2 border-t border-border/50 mt-2">
              <span className="font-semibold text-foreground">Instructions:</span> {assessment.instructions}
            </p>
          )}
        </CardHeader>
      </Card>

      {/* Student Identification Form (Disabled if submitted) */}
      <Card className={`border-border ${result ? "opacity-75 pointer-events-none bg-muted/20" : ""}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <GraduationCapIcon className="size-4 text-indigo-600" /> Student Information
          </CardTitle>
          <CardDescription className="text-xs">
            {result ? "Student response details recorded upon submission." : "Please fill in your valid details before taking the assessment."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <UserIcon className="size-3.5 text-indigo-500" /> Student Full Name
            </Label>
            <Input
              placeholder="e.g. Jane Doe"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              disabled={!!result}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <IdCardIcon className="size-3.5 text-purple-500" /> Matric / Student ID <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <Input
              placeholder="e.g. MAT/2026/0142"
              value={matricNumber}
              onChange={(e) => setMatricNumber(e.target.value)}
              disabled={!!result}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <MailIcon className="size-3.5 text-sky-500" /> Student Email <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <Input
              type="email"
              placeholder="e.g. student@university.edu"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              disabled={!!result}
              className="text-xs h-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Assessment Questions List (Greyed out & locked if submitted, with detailed result breakdown) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold tracking-tight flex items-center gap-2">
            <BookOpenIcon className="size-5 text-indigo-600" /> Questions ({assessment.questions.length})
          </h2>
          <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-600 dark:text-amber-400">
            {markPerQuestion} {markPerQuestion === 1 ? "Mark" : "Marks"} / Question
          </Badge>
        </div>

        {assessment.questions.map((q, qIdx) => {
          const studentSelectedOptIdx = answers[qIdx];
          const itemRes = result?.itemResults?.find(
            (ir) => ir.questionId === q.id || ir.questionText === q.questionText
          ) || (result?.itemResults && result.itemResults[qIdx]);

          const isCorrect = itemRes ? itemRes.isCorrect : undefined;
          const correctOptIdx = itemRes ? itemRes.correctOptionIndex : undefined;

          return (
            <Card
              key={q.id || `q-${qIdx}`}
              className={`border-border transition-all ${
                result ? "bg-muted/10 border-border/70" : "hover:border-indigo-500/30"
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      Question {qIdx + 1} of {assessment.questions.length}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[10px] border-amber-500/30 text-amber-600 dark:text-amber-400 font-medium"
                    >
                      {markPerQuestion} {markPerQuestion === 1 ? "Mark" : "Marks"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {result && isCorrect !== undefined && (
                      isCorrect ? (
                        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 text-[10px]">
                          <CheckCircle2Icon className="size-3" /> Correct (+{markPerQuestion})
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1 text-[10px]">
                          <XCircleIcon className="size-3" /> Incorrect (0)
                        </Badge>
                      )
                    )}
                    {q.topic && (
                      <Badge variant="secondary" className="text-[10px]">
                        {q.topic}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-sm font-semibold text-foreground leading-relaxed">
                  {q.questionText}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2 sm:grid-cols-2 pt-1">
                  {q.options &&
                    q.options.map((opt, optIdx) => {
                      const isSelected = studentSelectedOptIdx === optIdx;
                      const isOptionCorrect = correctOptIdx !== undefined ? optIdx === correctOptIdx : false;
                      const displayOpt = opt.replace(/^[A-D][\.\)\-\:\s]+/i, "").trim();

                      let containerClass = "bg-background border-border/70 text-foreground";
                      let circleClass = "border-muted-foreground/40 text-muted-foreground";

                      if (result && itemRes) {
                        if (isOptionCorrect) {
                          containerClass = "bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-medium";
                          circleClass = "border-emerald-600 bg-emerald-600 text-white";
                        } else if (isSelected && !isCorrect) {
                          containerClass = "bg-red-500/15 border-red-500 text-red-800 dark:text-red-300 font-medium";
                          circleClass = "border-red-600 bg-red-600 text-white";
                        }
                      } else if (isSelected) {
                        containerClass = "bg-indigo-600 text-white font-medium border-indigo-600 shadow-sm";
                        circleClass = "border-white bg-white text-indigo-600";
                      }

                      return (
                        <div
                          key={opt}
                          onClick={() => handleOptionSelect(qIdx, optIdx)}
                          className={`p-3 rounded-lg border text-xs transition-all flex items-center justify-between gap-2.5 ${
                            result ? "cursor-default" : "cursor-pointer"
                          } ${containerClass}`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <div
                              className={`size-5 rounded-full border flex items-center justify-center text-[11px] font-bold shrink-0 ${circleClass}`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </div>
                            <span className="truncate">{displayOpt}</span>
                          </div>
                          {result && itemRes ? (
                            isOptionCorrect ? (
                              <Badge className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 border-none shrink-0">
                                Correct Answer
                              </Badge>
                            ) : isSelected ? (
                              <Badge variant="destructive" className="text-[9px] px-1.5 py-0.5 border-none shrink-0">
                                Your Choice
                              </Badge>
                            ) : null
                          ) : isSelected ? (
                            <Badge className="bg-white/20 text-white text-[9px] px-1.5 py-0.5 border-none shrink-0">
                              Selected
                            </Badge>
                          ) : null}
                        </div>
                      );
                    })}
                </div>

                {/* Question Explanation after submission */}
                {result && itemRes?.explanation && (
                  <div className="mt-3 p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-500/20 text-xs">
                    <span className="font-semibold text-indigo-700 dark:text-indigo-300">Explanation: </span>
                    <span className="text-muted-foreground">{itemRes.explanation}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submit Button Bar (Hidden when submitted) */}
      {!result && (
        <Card className="border-indigo-500/30 bg-muted/20">
          <CardContent className="py-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Answered {Object.keys(answers).length} of {assessment.questions.length} questions
            </p>
            <Button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md font-semibold"
            >
              {isSubmitting ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <SparklesIcon className="size-4" />
              )}
              <span>{isSubmitting ? "Submitting..." : "Submit Assessment"}</span>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
