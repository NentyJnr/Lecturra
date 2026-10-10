import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

const kpiStats = [
  { value: "50 Questions in 90s", label: "Generate a full exam batch in under 90 seconds." },
  { value: "Export Anywhere", label: "1-click export to Moodle, Canvas, and Blackboard." },
  { value: "Instant Grading", label: "Get immediate scores on all student submissions." },
  { value: "Free to Start", label: "Get 1,500 complimentary credits on signup." },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 lg:pt-20">
      {/* Ambient Nature Atmospheric Glow */}
      <div className="ambient-nature-glow pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl 2xl:max-w-[1536px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Value Proposition & High-Conversion Copy */}
          <div className="flex flex-col items-start gap-6 lg:col-span-6 xl:col-span-6">
            {/* Category Ribbon Indicator */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#38492A]/20 bg-card/90 px-3.5 py-1.5 text-xs font-medium text-[#38492A] shadow-xs backdrop-blur-sm dark:border-[#8FB373]/30 dark:bg-card/40 dark:text-[#8FB373]">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#80802B] opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-[#38492A] dark:bg-[#8FB373]" />
              </span>
              <span>AI Assistant for Lecturers • Bloom&apos;s Taxonomy Aligned</span>
            </div>

            {/* Editorial Title */}
            <h1 className="title-immersive text-4xl leading-[1.08] font-normal text-balance text-[#1A2416] sm:text-5xl lg:text-[3.5rem] dark:text-[#F4F5F0]">
              Turn lecture notes into exam-ready questions in seconds.
            </h1>

            {/* Compelling Value Narrative */}
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Upload your textbooks, slides, or syllabi. Lecturra instantly creates high-quality
              multiple-choice and true/false questions, prevents duplicates, and generates shareable
              exam links that grade themselves.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Button
                size="lg"
                className="bg-[#38492A] px-6 text-white shadow-xs hover:bg-[#2C3B20] dark:bg-[#8FB373] dark:text-[#11160E] dark:hover:bg-[#A3C687]"
                render={<Link href="/register" />}
              >
                Start generating free
                <ArrowRightIcon className="ml-1 size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border/80 bg-background/60 hover:bg-muted dark:hover:bg-muted"
                render={<a href="#how-it-works" />}
              >
                See how it works
              </Button>
            </div>

            {/* Live KPI Metric Grid */}
            <dl className="mt-4 grid w-full grid-cols-2 gap-x-6 gap-y-5 border-t border-border/80 pt-6 sm:grid-cols-4">
              {kpiStats.map((kpi) => (
                <div key={kpi.value} className="flex flex-col">
                  <dd className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
                    {kpi.value}
                  </dd>
                  <dt className="mt-1 text-xs leading-snug text-muted-foreground">
                    {kpi.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          {/* Right Column: Seamless Responsive Video Player */}
          <div className="w-full lg:col-span-6 xl:col-span-6">
            <div className="card-organic relative overflow-hidden rounded-2xl border border-border/80 bg-card p-2 shadow-lg transition-all sm:p-2.5">
              {/* Top Organic Accent Ribbon */}
              <div className="absolute top-0 right-0 left-0 z-10 h-1 bg-gradient-to-r from-[#38492A] via-[#80802B] to-[#A0795C]" />

              {/* Video Element Container */}
              <div className="relative overflow-hidden rounded-xl bg-black/95">
                <video
                  className="block h-auto w-full rounded-xl object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  aria-label="Lecturra Platform Workflow Preview"
                >
                  <source src="/video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
