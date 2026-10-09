const steps = [
  {
    n: "01",
    color: "#38492A",
    title: "Upload your material",
    body: "Upload textbook chapters or syllabi. Large documents upload in resumable chunks and are queued for text extraction.",
  },
  {
    n: "02",
    color: "#80802B",
    title: "Generate questions",
    body: "Choose topics, difficulty, audience, and the MCQ / True-False split. AI drafts the full set against your quota.",
  },
  {
    n: "03",
    color: "#6D8382",
    title: "Review & dedupe",
    body: "Preview every item, clear similarity flags, and save the keepers to your central question bank.",
  },
  {
    n: "04",
    color: "#A0795C",
    title: "Assemble & share",
    body: "Build the assessment, set the duration, and send students a link or QR code. Export to print formats if needed.",
  },
  {
    n: "05",
    color: "#38492A",
    title: "Grade & report",
    body: "Submissions grade themselves instantly. Review the dashboard analytics or download the score sheet.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="border-y border-border/80 bg-[#FAF9F5]/70 py-16 dark:bg-[#151C12]/70"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#80802B]/30 bg-[#80802B]/10 px-3 py-1 text-xs font-semibold text-[#80802B]">
            <span className="size-1.5 rounded-full bg-[#80802B]" />
            Linear Academic Progression
          </div>
          <h2 id="how-it-works-heading" className="title-immersive mt-4 text-3xl font-normal text-balance text-[#1A2416] sm:text-4xl dark:text-[#F4F5F0]">
            From syllabus to scores in five steps
          </h2>
          <p className="mt-2.5 text-base text-muted-foreground">
            The same disciplined, reliable path every assessment follows — zero guesswork or training needed.
          </p>
        </div>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s) => (
            <li
              key={s.n}
              className="card-organic relative flex flex-col justify-between rounded-2xl p-5"
            >
              <div>
                <span
                  aria-hidden
                  className="font-heading text-3xl font-semibold tracking-tight"
                  style={{ color: s.color }}
                >
                  {s.n}
                </span>
                <h3 className="font-heading mt-3 text-base font-semibold tracking-tight text-foreground">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
              <div
                className="mt-4 h-1 w-8 rounded-full"
                style={{ backgroundColor: s.color }}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
