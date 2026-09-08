import { GraduationCapIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-12 text-center">
        <h2 className="font-heading max-w-xl text-3xl font-medium text-balance">
          Your next exam is already in your lecture notes
        </h2>
        <p className="max-w-md text-muted-foreground">
          Create a free account and generate your first assessment today.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" render={<a href="/register" />}>
            Get 5,000 free credits
          </Button>
          <Button size="lg" variant="outline" render={<a href="/login" />}>
            Log in
          </Button>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-5 text-sm text-muted-foreground sm:flex-row">
          <span className="flex items-center gap-2">
            <GraduationCapIcon className="size-4" aria-hidden /> Lecturra — AI assessments for
            lecturers
          </span>
          <nav aria-label="Footer" className="flex gap-4">
            <a href="/login" className="hover:text-foreground">
              Log in
            </a>
            <a href="/register" className="hover:text-foreground">
              Sign up
            </a>
            <a href="#faq" className="hover:text-foreground">
              FAQ
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
