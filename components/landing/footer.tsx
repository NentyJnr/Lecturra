import Link from "next/link";
import { GraduationCapIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-background/50">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-6 py-16 text-center">
        <div className="inline-flex size-10 items-center justify-center rounded-xl bg-[#38492A] text-white shadow-xs dark:bg-[#8FB373] dark:text-[#11160E]">
          <GraduationCapIcon className="size-5" aria-hidden />
        </div>
        <h2 className="title-immersive max-w-xl text-3xl font-normal text-balance text-[#1A2416] sm:text-4xl dark:text-[#F4F5F0]">
          Your next exam is already in your lecture notes
        </h2>
        <p className="max-w-md text-base text-muted-foreground">
          Create an account and start generating questions with your 1,500 free credits today.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3.5">
          <Button
            size="lg"
            className="bg-[#38492A] text-white shadow-xs hover:bg-[#2C3B20] dark:bg-[#8FB373] dark:text-[#11160E] dark:hover:bg-[#A3C687]"
            render={<Link href="/register" />}
          >
            Get 1,500 free credits
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-[#38492A]/20 hover:bg-[#FAF9F5] hover:text-[#38492A] dark:hover:bg-muted"
            render={<Link href="/login" />}
          >
            Log in to account
          </Button>
        </div>
      </div>

      <div className="border-t border-border/80">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
          <span className="flex items-center gap-2 font-medium">
            <span className="size-1.5 rounded-full bg-[#38492A] dark:bg-[#8FB373]" />
            Lecturra Academic Suite — Intelligent Assessment Platform
          </span>
          <nav aria-label="Footer" className="flex gap-5 font-medium">
            <Link href="/login" className="transition-colors hover:text-[#38492A] dark:hover:text-[#8FB373]">
              Log in
            </Link>
            <Link href="/register" className="transition-colors hover:text-[#38492A] dark:hover:text-[#8FB373]">
              Sign up
            </Link>
            <a href="#features" className="transition-colors hover:text-[#38492A] dark:hover:text-[#8FB373]">
              Features
            </a>
            <a href="#pricing" className="transition-colors hover:text-[#38492A] dark:hover:text-[#8FB373]">
              Pricing
            </a>
            <a href="#faq" className="transition-colors hover:text-[#38492A] dark:hover:text-[#8FB373]">
              FAQ
            </a>
          </nav>
        </div>
      </div>

      {/* Signature São Tomé Organic Palette Bottom Ribbon */}
      <div className="grid h-1 w-full grid-cols-4">
        <div className="bg-[#38492A]" />
        <div className="bg-[#80802B]" />
        <div className="bg-[#6D8382]" />
        <div className="bg-[#A0795C]" />
      </div>
    </footer>
  );
}
