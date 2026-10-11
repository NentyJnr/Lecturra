import { GraduationCapIcon, QuoteIcon } from "lucide-react";

const testimonials = [
  {
    quote:
      "Setting our 300-level Operating Systems exam used to consume an entire weekend of cross-referencing past papers. Lecturra synthesized 50 Bloom's-level questions in under 2 minutes, and the cosine deduplication caught three questions we had accidentally reused from the previous semester.",
    author: "Prof. Adekunle Balogun",
    role: "Head of Computer Science",
    institution: "Federal University of Technology",
    initials: "AB",
  },
  {
    quote:
      "The direct student link with zero registration barrier changed everything for continuous assessment tests. 280 students completed their test simultaneously on their smartphones, and the auto-graded Excel spreadsheet was ready for our departmental meeting 10 minutes later.",
    author: "Dr. Ngozi Eze",
    role: "Senior Lecturer, Biochemistry & Genetics",
    institution: "College of Medicine & Health Sciences",
    initials: "NE",
  },
  {
    quote:
      "The 1-click Aiken format export allowed us to import 600 verified departmental questions straight into Moodle without syntax formatting errors or broken answer keys. It is the single most reliable exam preparation tool in our faculty.",
    author: "Dr. Marcus Alabi",
    role: "Faculty Examination Officer",
    institution: "State University Senate Committee",
    initials: "MA",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="border-t border-border/70 bg-[#FAF9F5]/70 py-20 dark:bg-[#151C12]/70"
    >
      <div className="mx-auto max-w-7xl 2xl:max-w-[1400px] px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#38492A]/20 bg-[#38492A]/5 px-3 py-1 text-xs font-semibold text-[#38492A] dark:border-[#8FB373]/30 dark:bg-[#8FB373]/10 dark:text-[#8FB373]">
            <GraduationCapIcon className="size-3.5" />
            Verified Faculty Voices
          </div>
          <h2
            id="testimonials-heading"
            className="title-immersive mt-4 text-3xl font-normal text-balance text-[#1A2416] sm:text-4xl lg:text-[2.75rem] dark:text-[#F4F5F0]"
          >
            Endorsed by Lecturers, Exam Officers & Deans
          </h2>
          <p className="mt-3.5 text-base text-muted-foreground">
            Read how academic departments are eliminating exam preparation delays and administrative
            marking burdens.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="card-organic relative flex flex-col justify-between rounded-2xl border border-border/80 p-7 shadow-xs"
            >
              <div>
                <QuoteIcon className="size-7 text-[#38492A]/20 dark:text-[#8FB373]/30" aria-hidden />
                <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-border/70 pt-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#38492A] font-mono text-xs font-bold text-white dark:bg-[#8FB373] dark:text-[#11160E]">
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-heading text-sm font-semibold text-foreground">
                    {t.author}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                  <p className="text-[11px] font-medium text-[#38492A] dark:text-[#8FB373]">
                    {t.institution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
