import Link from "next/link";
import { ArrowRightIcon, CircleCheckIcon, FileDownIcon, QrCodeIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { value: "50", label: "questions per generation run" },
  { value: "3", label: "export formats: Aiken, GIFT, PDF" },
  { value: "Instant", label: "auto-grading on every submission" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Ambient Nature Atmospheric Glow */}
      <div className="ambient-nature-glow pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-5xl items-center gap-12 px-6 md:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          {/* Signature Organic Indicator Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#38492A]/20 bg-card/80 px-3.5 py-1.5 text-xs font-medium text-[#38492A] shadow-xs backdrop-blur-sm dark:border-[#8FB373]/30 dark:bg-card/40 dark:text-[#8FB373]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#80802B] opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-[#38492A] dark:bg-[#8FB373]" />
            </span>
            <span>1,500 free credits on signup — no card required</span>
          </div>

          <h1 className="title-immersive text-4xl leading-[1.12] font-normal text-balance text-[#1A2416] sm:text-5xl lg:text-[3.25rem] dark:text-[#F4F5F0]">
            Turn lecture notes into exam-ready questions in minutes
          </h1>

          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Upload your course material, let AI draft the questions, then review, assemble, and share
            the assessment with a link. Students submit online and get graded instantly.
          </p>

          <div className="flex flex-wrap gap-3.5">
            <Button
              size="lg"
              className="bg-[#38492A] text-white shadow-xs hover:bg-[#2C3B20] dark:bg-[#8FB373] dark:text-[#11160E] dark:hover:bg-[#A3C687]"
              render={<Link href="/register" />}
            >
              Start generating free <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#38492A]/20 bg-background/50 hover:bg-[#FAF9F5] hover:text-[#38492A] dark:border-border dark:hover:bg-muted"
              render={<a href="#how-it-works" />}
            >
              See how it works
            </Button>
          </div>

          <dl className="grid w-full grid-cols-3 gap-6 border-t border-border/80 pt-6">
            {stats.map((s, idx) => (
              <div key={s.label} className="flex flex-col">
                <dt className="order-2 mt-1.5 text-xs leading-normal text-muted-foreground">{s.label}</dt>
                <dd className="order-1 font-heading text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Example Generated Assessment Card with Organic Styling */}
        <div className="card-organic relative rounded-2xl p-6 sm:p-7">
          {/* Subtle Corner Nature Accent Bar */}
          <div className="absolute top-0 right-8 h-1 w-16 rounded-b-sm bg-[#80802B]" title="Canopy Accent" />

          <div className="flex items-start justify-between gap-3 border-b border-border/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#38492A] dark:bg-[#8FB373]" />
                <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
                  PHY 301 — Mid-Semester Test
                </h3>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">50 questions • 60 min • MCQ 90% / T-F 10%</p>
            </div>
            <span className="rounded-md border border-[#38492A]/20 bg-[#38492A]/10 px-2 py-0.5 text-xs font-semibold text-[#38492A] dark:border-[#8FB373]/30 dark:bg-[#8FB373]/15 dark:text-[#8FB373]">
              Active Draft
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-border/80 bg-background/60 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-wider text-[#80802B] uppercase">Question 12 of 50</p>
                <span className="text-[11px] text-muted-foreground">Multiple Choice</span>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">
                Which CPU scheduling algorithm gives preference to processes with the shortest burst time?
              </p>
              <ul className="mt-3.5 space-y-2 text-xs">
                <li className="flex items-center gap-2.5 rounded-lg border border-[#38492A]/30 bg-[#38492A]/10 px-3 py-2 font-medium text-[#38492A] dark:border-[#8FB373]/30 dark:bg-[#8FB373]/15 dark:text-[#8FB373]">
                  <CircleCheckIcon className="size-4 shrink-0 text-[#38492A] dark:text-[#8FB373]" aria-hidden />
                  Shortest Job First (SJF)
                </li>
                <li className="rounded-lg px-3 py-1.5 text-muted-foreground">First Come, First Served (FCFS)</li>
                <li className="rounded-lg px-3 py-1.5 text-muted-foreground">Round Robin (RR)</li>
                <li className="rounded-lg px-3 py-1.5 text-muted-foreground">Multilevel Feedback Queue</li>
              </ul>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[#6D8382]/20 bg-[#6D8382]/5 px-4 py-3 text-xs text-[#526463] dark:text-[#9FB1B0]">
              <span className="flex items-center gap-2 font-medium">
                <QrCodeIcon className="size-4 text-[#6D8382]" aria-hidden />
                Direct Student Link + QR Active
              </span>
              <span className="font-semibold text-[#6D8382]">Live Ready</span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-border/80 pt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <FileDownIcon className="size-4 text-[#A0795C]" aria-hidden />
              Export: Aiken, GIFT, PDF
            </span>
            <span className="text-[11px] font-medium text-[#38492A] dark:text-[#8FB373]">
              Auto-Grading Configured ✓
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
