import Link from "next/link";
import { GraduationCapIcon } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <nav aria-label="Auth" className="mx-auto flex h-14 max-w-5xl items-center px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-heading text-lg font-medium"
            aria-label="Back to Lecturra home"
          >
            <GraduationCapIcon className="size-5 text-primary" aria-hidden />
            Lecturra
          </Link>
        </nav>
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
