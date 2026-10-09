import {
  BarChart3Icon,
  DatabaseIcon,
  FileUpIcon,
  ScanSearchIcon,
  Share2Icon,
  SparklesIcon,
} from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: FileUpIcon,
    themeColor: "#38492A",
    tag: "Ingestion",
    title: "Upload course material",
    body: "Drop in PDF or DOCX textbooks and syllabi — including large files via resumable chunked uploads — and get clean, extracted text.",
  },
  {
    icon: SparklesIcon,
    themeColor: "#80802B",
    tag: "Intelligence",
    title: "AI question generation",
    body: "Pick a document, set the count, difficulty, and MCQ / True-False mix, and get exam-style questions. Credits are metered per run.",
  },
  {
    icon: ScanSearchIcon,
    themeColor: "#6D8382",
    tag: "Integrity",
    title: "Duplicate detection",
    body: "Cosine-similarity checks flag near-duplicate items so you can merge, replace, or keep each one with confidence.",
  },
  {
    icon: DatabaseIcon,
    themeColor: "#A0795C",
    tag: "Repository",
    title: "Reusable question bank",
    body: "Approved drafts live in your tenant question bank — search, paginate, and pull them into future assessments.",
  },
  {
    icon: Share2Icon,
    themeColor: "#38492A",
    tag: "Distribution",
    title: "Share links students can open",
    body: "Assemble an assessment, generate a public link with QR code, and export to Aiken, GIFT, or PDF when you need paper.",
  },
  {
    icon: BarChart3Icon,
    themeColor: "#80802B",
    tag: "Evaluation",
    title: "Instant grading & reports",
    body: "Student submissions are auto-graded on the spot, with scorecards for them and analytics plus CSV/Excel export for you.",
  },
];

export function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="mx-auto max-w-5xl scroll-mt-16 px-6 py-16">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#38492A]/20 bg-[#38492A]/5 px-3 py-1 text-xs font-semibold text-[#38492A] dark:border-[#8FB373]/30 dark:bg-[#8FB373]/10 dark:text-[#8FB373]">
          <span className="size-1.5 rounded-full bg-[#38492A] dark:bg-[#8FB373]" />
          End-to-End Academic Workflow
        </div>
        <h2 id="features-heading" className="title-immersive mt-4 text-3xl font-normal text-balance text-[#1A2416] sm:text-4xl dark:text-[#F4F5F0]">
          Everything from upload to score sheet
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          One continuous organic workflow carries your material from a raw file on your laptop to graded student results.
        </p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="card-organic group relative flex flex-col justify-between rounded-2xl p-6"
          >
            <div>
              <div className="flex items-center justify-between">
                <div
                  className="flex size-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: `${f.themeColor}15`,
                    color: f.themeColor,
                  }}
                >
                  <f.icon className="size-5" aria-hidden />
                </div>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                  style={{
                    backgroundColor: `${f.themeColor}10`,
                    color: f.themeColor,
                  }}
                >
                  {f.tag}
                </span>
              </div>
              <h3 className="font-heading mt-4 text-lg font-semibold tracking-tight text-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {f.body}
              </p>
            </div>
            <div
              className="mt-5 h-0.5 w-8 rounded-full transition-all group-hover:w-16"
              style={{ backgroundColor: f.themeColor }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
