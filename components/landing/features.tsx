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
    title: "Upload course material",
    body: "Drop in PDF or DOCX textbooks and syllabi — including large files via resumable chunked uploads — and get clean, extracted text.",
  },
  {
    icon: SparklesIcon,
    title: "AI question generation",
    body: "Pick a document, set the count, difficulty, and MCQ / True-False mix, and get exam-style questions. Credits are metered per run.",
  },
  {
    icon: ScanSearchIcon,
    title: "Duplicate detection",
    body: "Cosine-similarity checks flag near-duplicate items so you can merge, replace, or keep each one with confidence.",
  },
  {
    icon: DatabaseIcon,
    title: "Reusable question bank",
    body: "Approved drafts live in your tenant question bank — search, paginate, and pull them into future assessments.",
  },
  {
    icon: Share2Icon,
    title: "Share links students can open",
    body: "Assemble an assessment, generate a public link with QR code, and export to Aiken, GIFT, or PDF when you need paper.",
  },
  {
    icon: BarChart3Icon,
    title: "Instant grading & reports",
    body: "Student submissions are auto-graded on the spot, with scorecards for them and analytics plus CSV/Excel export for you.",
  },
];

export function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="mx-auto max-w-5xl scroll-mt-16 px-6 py-12">
      <div className="max-w-2xl">
        <h2 id="features-heading" className="font-heading text-3xl font-medium text-balance">
          Everything from upload to score sheet
        </h2>
        <p className="mt-2 text-muted-foreground">
          One workflow carries your material from a file on your laptop to graded student results.
        </p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title}>
            <CardHeader>
              <f.icon className="size-5 text-primary" aria-hidden />
              <CardTitle className="mt-2">{f.title}</CardTitle>
              <CardDescription>{f.body}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
