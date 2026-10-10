"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  CalculatorIcon,
  CheckCircle2Icon,
  ClockIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Free Academic Starter",
    badge: "100% Free Forever",
    price: "₦0",
    unit: "/ 1,500 credits included",
    desc: "For testing Lecturra on a live course and generating your first mid-semester tests.",
    highlight: false,
    cta: "Create free account",
    href: "/register",
    includes: [
      "1,500 credits upon registration (3 full 50-Q runs)",
      "Upload course notes, syllabi & PDF textbooks",
      "Full Bloom's taxonomy & cosine deduplication",
      "Direct student exam link with 0-second auto-grading",
      "+200 bonus credits per referred lecturer",
    ],
  },
  {
    name: "Exam Season Pay-As-You-Go",
    badge: "Most Popular for Faculties",
    price: "₦5,000",
    unit: "/ 5,000 credits",
    desc: "For heavy continuous assessment tests, large cohorts, and comprehensive final exams.",
    highlight: true,
    cta: "Start free, top up anytime",
    href: "/register",
    includes: [
      "5,000 credits (covers 10 complete 50-Q exam batches)",
      "Instant checkout via secure OPay integration",
      "Permanent question bank repository storage",
      "Aiken, GIFT & print-ready PDF exam export",
      "Credits never expire — full rollover across semesters",
    ],
  },
  {
    name: "Departmental & Faculty Pool",
    badge: "Enterprise / Institution",
    price: "Custom",
    unit: "/ pooled faculty quota",
    desc: "For academic departments, exam boards, and university faculties seeking centralized governance.",
    highlight: false,
    cta: "Inquire for faculty license",
    href: "/register",
    includes: [
      "Pooled institutional credits for all departmental staff",
      "Shared tenant question bank with role permissions",
      "Multi-lecturer exam co-authoring & verification",
      "Dedicated onboarding & custom LMS integration",
      "Consolidated Senate exam audit & psychometric reports",
    ],
  },
];

export function Pricing() {
  const [coursesCount, setCoursesCount] = useState<number>(2);
  const [studentsCount, setStudentsCount] = useState<number>(150);

  // Time savings model:
  // Traditional: 12 hrs per course for question drafting & dedupe
  // Grading: 5 mins (0.083 hrs) per student per assessment
  const draftingHoursSaved = coursesCount * 11;
  const gradingHoursSaved = Math.round(coursesCount * studentsCount * (4 / 60));
  const totalHoursSaved = draftingHoursSaved + gradingHoursSaved;

  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="mx-auto max-w-7xl 2xl:max-w-[1536px] scroll-mt-20 px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#A0795C]/30 bg-[#A0795C]/10 px-3 py-1 text-xs font-semibold text-[#A0795C]">
          <span className="size-1.5 rounded-full bg-[#A0795C]" />
          Transparent Academic Economics
        </div>
        <h2 id="pricing-heading" className="title-immersive mt-4 text-3xl font-normal text-balance text-[#1A2416] sm:text-4xl lg:text-[2.75rem] dark:text-[#F4F5F0]">
          Start Free, Top Up When Exam Season Hits
        </h2>
        <p className="mt-3.5 text-base text-muted-foreground">
          No subscriptions, no hidden lock-ins. A standard 50-question run costs 500 credits. Your initial
          1,500 free credits easily cover your first tests.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`card-organic relative flex flex-col justify-between rounded-2xl p-7 transition-all ${
              t.highlight
                ? "border-2 border-[#38492A] shadow-lg dark:border-[#8FB373]"
                : "border border-border/80"
            }`}
          >
            {t.highlight && (
              <div className="absolute -top-3.5 right-6 rounded-full bg-[#38492A] px-3.5 py-1 text-[11px] font-semibold text-white shadow-xs dark:bg-[#8FB373] dark:text-[#11160E]">
                {t.badge}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                  {t.name}
                </h3>
                {!t.highlight && (
                  <span className="rounded-full border border-border/80 bg-muted/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {t.badge}
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {t.desc}
              </p>

              {/* Price Display */}
              <div className="mt-6 flex items-baseline gap-1.5">
                <span
                  className={`font-heading text-4xl font-bold tracking-tight sm:text-5xl ${
                    t.highlight
                      ? "text-[#38492A] dark:text-[#8FB373]"
                      : "text-foreground"
                  }`}
                >
                  {t.price}
                </span>
                <span className="text-xs text-muted-foreground">{t.unit}</span>
              </div>

              {/* Inclusions List */}
              <ul className="mt-6 space-y-3 border-t border-border/70 pt-6 text-xs sm:text-sm">
                {t.includes.map((inc) => (
                  <li key={inc} className="flex items-start gap-2.5 text-muted-foreground">
                    <CheckCircle2Icon
                      className={`mt-0.5 size-4 shrink-0 ${
                        t.highlight
                          ? "text-[#38492A] dark:text-[#8FB373]"
                          : "text-muted-foreground"
                      }`}
                      aria-hidden
                    />
                    <span className="text-foreground">{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <div className="mt-8 border-t border-border/70 pt-5">
              <Button
                className={`w-full justify-center ${
                  t.highlight
                    ? "bg-[#38492A] text-white hover:bg-[#2C3B20] dark:bg-[#8FB373] dark:text-[#11160E] dark:hover:bg-[#A3C687]"
                    : "border-border/80 bg-background/80 hover:bg-muted"
                }`}
                variant={t.highlight ? "default" : "outline"}
                render={<Link href={t.href} />}
              >
                {t.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Academic ROI & Hours-Saved Calculator */}
      <div className="card-organic mt-12 rounded-2xl border border-border/80 p-6 sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#80802B]/30 bg-[#80802B]/10 px-3 py-1 text-xs font-semibold text-[#80802B] dark:text-[#8FB373]">
              <CalculatorIcon className="size-3.5" />
              Faculty Efficiency Calculator
            </div>
            <h3 className="font-heading mt-3 text-2xl font-semibold tracking-tight text-foreground">
              Calculate Your Semester Time Savings
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Adjust your course load and class size to calculate how many hours of manual exam drafting
              and script grading Lecturra will save you this semester.
            </p>

            {/* Sliders / Toggle Controls */}
            <div className="mt-6 space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span>Courses Coordinated:</span>
                  <span className="font-mono text-sm text-[#38492A] dark:text-[#8FB373]">
                    {coursesCount} {coursesCount === 1 ? "Course" : "Courses"}
                  </span>
                </div>
                <div className="mt-2 flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCoursesCount(num)}
                      className={`flex-1 rounded-md border py-1.5 text-xs font-medium transition-all ${
                        coursesCount === num
                          ? "border-[#38492A] bg-[#38492A] text-white dark:border-[#8FB373] dark:bg-[#8FB373] dark:text-[#11160E]"
                          : "border-border bg-muted/40 hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span>Total Students Across Classes:</span>
                  <span className="font-mono text-sm text-[#38492A] dark:text-[#8FB373]">
                    {studentsCount} Students
                  </span>
                </div>
                <div className="mt-2 flex gap-2">
                  {[50, 100, 200, 350, 500].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setStudentsCount(num)}
                      className={`flex-1 rounded-md border py-1.5 text-xs font-medium transition-all ${
                        studentsCount === num
                          ? "border-[#38492A] bg-[#38492A] text-white dark:border-[#8FB373] dark:bg-[#8FB373] dark:text-[#11160E]"
                          : "border-border bg-muted/40 hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Calculator Output KPI Card */}
          <div className="rounded-xl border border-border/80 bg-muted/30 p-6 lg:min-w-[320px]">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <ClockIcon className="size-4 text-[#38492A] dark:text-[#8FB373]" />
              Estimated Workload Reclaimed
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-heading text-5xl font-extrabold tracking-tight text-[#38492A] dark:text-[#8FB373]">
                ~{totalHoursSaved}
              </span>
              <span className="text-base font-semibold text-foreground">Hours Saved</span>
            </div>

            <div className="mt-4 space-y-2 border-t border-border/70 pt-4 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Exam formulation time saved:</span>
                <span className="font-mono font-medium text-foreground">~{draftingHoursSaved} hrs</span>
              </div>
              <div className="flex justify-between">
                <span>Script grading time saved:</span>
                <span className="font-mono font-medium text-foreground">~{gradingHoursSaved} hrs</span>
              </div>
              <div className="flex justify-between font-semibold text-foreground">
                <span>Free trial coverage:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">100% Free Initial Tests</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                className="w-full bg-[#38492A] text-white hover:bg-[#2C3B20] dark:bg-[#8FB373] dark:text-[#11160E]"
                render={<Link href="/register" />}
              >
                Reclaim your time now <ArrowRightIcon className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
