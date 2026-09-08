const steps = [
  {
    n: "1",
    title: "Upload your material",
    body: "Upload the textbook chapter or syllabus. Large documents upload in resumable chunks and are queued for text extraction.",
  },
  {
    n: "2",
    title: "Generate questions",
    body: "Choose topics, difficulty, audience, and the MCQ / True-False split. AI drafts the full set against your quota.",
  },
  {
    n: "3",
    title: "Review & dedupe",
    body: "Preview every item, clear similarity flags, and save the keepers to your question bank.",
  },
  {
    n: "4",
    title: "Assemble & share",
    body: "Build the assessment, set the duration, and send students a link or QR code. Export to print formats if needed.",
  },
  {
    n: "5",
    title: "Grade & report",
    body: "Submissions grade themselves instantly. Review the dashboard analytics or download the score sheet.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="border-y bg-muted/50"
    >
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="max-w-2xl">
          <h2 id="how-it-works-heading" className="font-heading text-3xl font-medium text-balance">
            From syllabus to scores in five steps
          </h2>
          <p className="mt-2 text-muted-foreground">
            The same path every assessment follows — no training needed.
          </p>
        </div>
        <ol className="mt-8 grid gap-6 md:grid-cols-5">
          {steps.map((s) => (
            <li key={s.n} className="flex flex-col gap-2">
              <span
                aria-hidden
                className="font-heading text-4xl font-medium text-primary/30"
              >
                {s.n}
              </span>
              <h3 className="text-sm font-medium">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
