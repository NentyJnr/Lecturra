import {
  FileTextIcon,
  LayersIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  TablePropertiesIcon,
} from "lucide-react";

const steps = [
  {
    step: "01",
    accent: "#38492A",
    icon: FileTextIcon,
    title: "Ingest Course Material",
    desc: "Drop in PDF textbooks, syllabi, or PowerPoint slide decks. Resumable chunking guarantees complete extraction with zero file loss.",
    detail: "Supports PDF, DOCX, TXT up to 100MB",
  },
  {
    step: "02",
    accent: "#80802B",
    icon: SlidersHorizontalIcon,
    title: "Calibrate Assessment",
    desc: "Specify desired question volume (up to 50 items/run), Bloom's cognitive taxonomy level, and desired MCQ vs True/False ratio.",
    detail: "Configurable difficulty & cognitive level",
  },
  {
    step: "03",
    accent: "#6D8382",
    icon: SparklesIcon,
    title: "Review & Deduplicate",
    desc: "Inspect the generated batch. The cosine similarity engine highlights near-duplicates against your historic bank for 1-click replacement.",
    detail: "Automated similarity audit & question bank save",
  },
  {
    step: "04",
    accent: "#A0795C",
    icon: LayersIcon,
    title: "Distribute or Export",
    desc: "Generate a timed public link or QR code for online examination, or export standard Aiken/GIFT files for Moodle, Canvas, and Blackboard.",
    detail: "Zero student signup required • LMS ready",
  },
  {
    step: "05",
    accent: "#38492A",
    icon: TablePropertiesIcon,
    title: "Instant Gradebook & Senate CSV",
    desc: "Student submissions are auto-graded immediately upon finishing. Access comprehensive item performance analysis and download Senate score sheets.",
    detail: "0.0s grading • 1-click Excel/CSV export",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="border-y border-border/70 bg-[#FAF9F5]/80 py-20 dark:bg-[#151C12]/80"
    >
      <div className="mx-auto max-w-7xl 2xl:max-w-[1400px] px-6 sm:px-8 lg:px-12">
        {/* Section Heading */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#80802B]/30 bg-[#80802B]/10 px-3 py-1 text-xs font-semibold text-[#80802B] dark:text-[#8FB373]">
            <span className="size-1.5 rounded-full bg-[#80802B] dark:bg-[#8FB373]" />
            Linear Academic Progression
          </div>
          <h2
            id="how-it-works-heading"
            className="title-immersive mt-4 text-3xl font-normal text-balance text-[#1A2416] sm:text-4xl lg:text-[2.75rem] dark:text-[#F4F5F0]"
          >
            From Syllabus to Senate Grade Sheet in 5 Steps
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            A standardized, disciplined exam creation lifecycle engineered specifically for higher
            education faculty workflows.
          </p>
        </div>

        {/* 5-Step Process Cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, idx) => (
            <div
              key={s.step}
              className="card-organic group relative flex flex-col justify-between rounded-2xl border border-border/80 p-5 transition-all hover:-translate-y-1 sm:p-6"
            >
              <div>
                {/* Step Monospace Index */}
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-2xl font-bold tracking-tight"
                    style={{ color: s.accent }}
                  >
                    {s.step}
                  </span>
                  <div
                    className="flex size-8 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: `${s.accent}15`,
                      color: s.accent,
                    }}
                  >
                    <s.icon className="size-4" aria-hidden />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-heading mt-4 text-base font-semibold tracking-tight text-foreground">
                  {s.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </div>

              {/* Step Sub-tag */}
              <div className="mt-5 border-t border-border/60 pt-3">
                <span className="font-mono text-[11px] font-medium text-muted-foreground">
                  {s.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
