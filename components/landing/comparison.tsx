import { CheckCircle2Icon, XCircleIcon, SparklesIcon } from "lucide-react";

const rows = [
  {
    feature: "Question Formulation Speed",
    traditional: "10 – 14 hours of manual drafting, typing, and answer key formulation",
    lecturra: "Under 90 seconds for a complete 50-item Bloom's taxonomy batch",
  },
  {
    feature: "Repetition & Duplicate Auditing",
    traditional: "Relies on fallible memory; recurring questions slip across semesters",
    lecturra: "Mathematical cosine vector similarity checks against tenant question bank",
  },
  {
    feature: "LMS Ingestion (Moodle, Canvas, Blackboard)",
    traditional: "Tedious manual copy-pasting with frequent syntax and formatting errors",
    lecturra: "1-click native export to Aiken, GIFT, and print-ready formatted PDF",
  },
  {
    feature: "Student Grading & Score Turnaround",
    traditional: "3 – 7 days of stressful manual script marking for 200+ students",
    lecturra: "0.0-second instant auto-grading as students submit; instant scorecards",
  },
  {
    feature: "Student Access Barrier",
    traditional: "Physical paper distribution; logistically complex hall allocations",
    lecturra: "Direct timed web link or QR code — zero student signup required",
  },
  {
    feature: "Senate & Accreditation Records",
    traditional: "Manual spreadsheet data entry prone to transcription and calculation errors",
    lecturra: "1-click downloadable CSV/Excel gradebook with psychometric item analytics",
  },
];

export function Comparison() {
  return (
    <section id="comparison" aria-labelledby="comparison-heading" className="mx-auto max-w-7xl 2xl:max-w-[1536px] scroll-mt-20 px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#38492A]/20 bg-[#38492A]/5 px-3 py-1 text-xs font-semibold text-[#38492A] dark:border-[#8FB373]/30 dark:bg-[#8FB373]/10 dark:text-[#8FB373]">
          <SparklesIcon className="size-3.5" />
          The Academic Advantage
        </div>
        <h2 id="comparison-heading" className="title-immersive mt-4 text-3xl font-normal text-balance text-[#1A2416] sm:text-4xl lg:text-[2.75rem] dark:text-[#F4F5F0]">
          Traditional Exam Setting vs. Lecturra OS
        </h2>
        <p className="mt-3.5 text-base text-muted-foreground">
          A definitive comparison between traditional pen-and-paper bottlenecks and the modern
          pedagogical operating system.
        </p>
      </div>

      {/* Comparison Matrix Table */}
      <div className="mt-14 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
        <div className="grid grid-cols-12 border-b border-border/80 bg-muted/50 p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:p-5">
          <div className="col-span-12 sm:col-span-4">Evaluation Dimension</div>
          <div className="col-span-6 mt-2 sm:col-span-4 sm:mt-0">Traditional Examination</div>
          <div className="col-span-6 mt-2 text-[#38492A] sm:col-span-4 sm:mt-0 dark:text-[#8FB373]">
            Lecturra Academic Suite
          </div>
        </div>

        <div className="divide-y divide-border/70">
          {rows.map((row, index) => (
            <div
              key={row.feature}
              className={`grid grid-cols-12 items-center gap-4 p-4 text-xs transition-colors hover:bg-muted/20 sm:p-5 sm:text-sm ${
                index % 2 === 1 ? "bg-muted/10" : ""
              }`}
            >
              {/* Feature Dimension */}
              <div className="col-span-12 font-medium text-foreground sm:col-span-4">
                {row.feature}
              </div>

              {/* Traditional */}
              <div className="col-span-12 flex items-start gap-2 text-muted-foreground sm:col-span-4">
                <XCircleIcon className="mt-0.5 size-4 shrink-0 text-rose-500/80" aria-hidden />
                <span className="leading-relaxed">{row.traditional}</span>
              </div>

              {/* Lecturra */}
              <div className="col-span-12 flex items-start gap-2 font-medium text-foreground sm:col-span-4">
                <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-[#38492A] dark:text-[#8FB373]" aria-hidden />
                <span className="leading-relaxed text-[#1A2416] dark:text-[#F4F5F0]">{row.lecturra}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
