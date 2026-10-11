import {
  BarChart3Icon,
  DatabaseIcon,
  FileUpIcon,
  QrCodeIcon,
  ScanSearchIcon,
  SparklesIcon,
} from "lucide-react";

const pillars = [
  {
    icon: FileUpIcon,
    accent: "#38492A",
    tag: "RELIABLE UPLOADS",
    title: "Upload Large Files Easily",
    body: "Safely upload heavy textbooks and slide decks. Our system ensures your uploads never drop or fail, even on slow campus Wi-Fi.",
    badge: "100MB+ Supported",
    colSpan: "sm:col-span-2 lg:col-span-2",
  },
  {
    icon: SparklesIcon,
    accent: "#80802B",
    tag: "SMART GENERATION",
    title: "Tailored Question Difficulty",
    body: "Generate MCQs and True/False questions instantly. Easily adjust the difficulty from simple memory recall to advanced analytical questions.",
    badge: "Custom Difficulty",
    colSpan: "sm:col-span-1 lg:col-span-1",
  },
  {
    icon: ScanSearchIcon,
    accent: "#6D8382",
    tag: "QUALITY CONTROL",
    title: "Prevent Duplicate Questions",
    body: "Never accidentally repeat a past question. Lecturra automatically scans your previous exams and highlights any duplicates before you publish.",
    badge: "Zero Duplicates",
    colSpan: "sm:col-span-1 lg:col-span-1",
  },
  {
    icon: DatabaseIcon,
    accent: "#A0795C",
    tag: "SECURE STORAGE",
    title: "Build a Custom Question Bank",
    body: "Save your best questions in a secure departmental library. Quickly filter by topic or semester and reuse them for future tests in seconds.",
    badge: "Departmental Bank",
    colSpan: "sm:col-span-2 lg:col-span-2",
  },
  {
    icon: QrCodeIcon,
    accent: "#38492A",
    tag: "ZERO FRICTION",
    title: "Share with One Click",
    body: "Share timed tests via a direct link or QR code. Students can take the exam instantly on any phone or laptop—no app downloads or logins required.",
    badge: "No Student Login",
    colSpan: "sm:col-span-1 lg:col-span-1",
  },
  {
    icon: BarChart3Icon,
    accent: "#80802B",
    tag: "AUTOMATED EXPORTS",
    title: "Instant Grading & Reports",
    body: "Exams are automatically graded the second a student finishes. Instantly download clean class averages and spreadsheets ready for Senate approval.",
    badge: "Senate-Ready CSV",
    colSpan: "sm:col-span-2 lg:col-span-2",
  },
];

export function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="mx-auto max-w-7xl 2xl:max-w-[1400px] scroll-mt-20 px-6 sm:px-8 lg:px-12 py-20">
      {/* Section Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#38492A]/20 bg-[#38492A]/5 px-3 py-1 text-xs font-semibold text-[#38492A] dark:border-[#8FB373]/30 dark:bg-[#8FB373]/10 dark:text-[#8FB373]">
          <span className="size-1.5 rounded-full bg-[#38492A] dark:bg-[#8FB373]" />
          Faculty Time-Savings
        </div>
        <h2 id="features-heading" className="title-immersive mt-4 text-3xl font-normal text-balance text-[#1A2416] sm:text-4xl lg:text-[2.75rem] dark:text-[#F4F5F0]">
          6 Ways Lecturra Makes Exams Effortless
        </h2>
        <p className="mt-3.5 text-base text-muted-foreground">
          Stop wasting hours writing questions, checking past papers, and grading answer sheets by hand. Here is how we help you win your time back.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="mt-12 grid gap-6 sm:grid-cols-3 lg:grid-cols-3">
        {pillars.map((p) => (
          <div
            key={p.title}
            className={`card-organic group relative flex flex-col justify-between rounded-2xl border border-border/80 p-6 sm:p-7 ${p.colSpan}`}
          >
            <div>
              {/* Header Icon & Tag */}
              <div className="flex items-center justify-between">
                <div
                  className="flex size-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: `${p.accent}15`,
                    color: p.accent,
                  }}
                >
                  <p.icon className="size-5.5" aria-hidden />
                </div>
                <span className="rounded-full border border-border/80 bg-muted/60 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-muted-foreground">
                  {p.badge}
                </span>
              </div>

              {/* Title & Tag */}
              <div className="mt-5">
                <span
                  className="font-mono text-xs font-semibold uppercase tracking-wider"
                  style={{ color: p.accent }}
                >
                  {p.tag}
                </span>
                <h3 className="font-heading mt-1.5 text-xl font-semibold tracking-tight text-foreground">
                  {p.title}
                </h3>
              </div>

              {/* Body */}
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </div>

            {/* Bottom Accent Line */}
            <div
              className="mt-6 h-1 w-10 rounded-full transition-all group-hover:w-16"
              style={{ backgroundColor: p.accent }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
