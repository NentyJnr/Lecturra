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
    <section className="mx-auto grid max-w-5xl items-center gap-10 px-6 pt-16 pb-12 md:grid-cols-2 md:pt-24">
      <div className="flex flex-col items-start gap-5">
        <Badge variant="secondary">1,500 free credits on signup — no card required</Badge>
        <h1 className="font-heading text-4xl leading-tight font-medium text-balance md:text-5xl">
          Turn lecture notes into exam-ready questions in minutes
        </h1>
        <p className="text-lg text-muted-foreground">
          Upload your course material, let AI draft the questions, then review, assemble, and share
          the assessment with a link. Students submit online and get graded instantly.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" render={<Link href="/register" />}>
            Start generating free <ArrowRightIcon data-icon="inline-end" />
          </Button>
          <Button size="lg" variant="outline" render={<a href="#how-it-works" />}>
            See how it works
          </Button>
        </div>
        <dl className="grid w-full grid-cols-3 gap-4 border-t pt-5">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col">
              <dt className="order-2 mt-1 text-xs text-muted-foreground">{s.label}</dt>
              <dd className="order-1 font-heading text-2xl font-medium">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <Card aria-label="Example of a generated assessment">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>PHY 301 — Mid-semester test</CardTitle>
            <Badge>Draft</Badge>
          </div>
          <p className="text-sm text-muted-foreground">50 questions • 60 min • MCQ 90% / T-F 10%</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="rounded-lg border p-3">
            <p className="text-sm font-medium">12. Which scheduling algorithm favours short jobs?</p>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CircleCheckIcon className="size-4 shrink-0 text-primary" aria-hidden /> Shortest
                Job First
              </li>
              <li className="ps-6">First Come, First Served</li>
              <li className="ps-6">Round Robin</li>
              <li className="ps-6">Priority Scheduling</li>
            </ul>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <QrCodeIcon className="size-4" aria-hidden /> Share link + QR generated for students
          </div>
        </CardContent>
        <CardFooter className="gap-2 text-sm">
          <FileDownIcon className="size-4 text-muted-foreground" aria-hidden />
          Export as Aiken, GIFT, or PDF
        </CardFooter>
      </Card>
    </section>
  );
}
