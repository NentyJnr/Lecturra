import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <nav aria-label="Auth" className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 font-heading text-lg font-medium"
            aria-label="Back to Lecturra home"
          >
            <div className="relative flex size-8 items-center justify-center overflow-hidden rounded-lg bg-[#FAF9F5] p-1 shadow-xs ring-1 ring-[#38492A]/15 transition-transform group-hover:scale-105 dark:bg-[#182015] dark:ring-[#8FB373]/25">
              <Image src="/logo-icon.png" alt="Lecturra Logo" width={26} height={26} className="object-contain" priority />
            </div>
            Lecturra
          </Link>
          <ModeToggle />
        </nav>
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
