import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, ShieldCheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-card/60">
      {/* High-Impact Closing CTA Banner */}
      <div className="mx-auto max-w-7xl 2xl:max-w-[1400px] px-6 sm:px-8 lg:px-12 py-20">
        <div className="card-organic relative overflow-hidden rounded-3xl border border-border/80 p-8 sm:p-12 lg:p-16 text-center shadow-lg">
          {/* Subtle Ambient Radial Highlight */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(56,73,42,0.12)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(143,179,115,0.15)_0%,transparent_70%)]" />

          <div className="mx-auto flex size-14 items-center justify-center overflow-hidden rounded-2xl bg-[#FAF9F5] p-2 shadow-sm ring-1 ring-[#38492A]/15 dark:bg-[#182015] dark:ring-[#8FB373]/25">
            <Image src="/logo-icon.png" alt="Lecturra Logo" width={40} height={40} className="object-contain" />
          </div>

          <h2 className="title-immersive mx-auto mt-6 max-w-3xl text-3xl font-normal text-balance text-[#1A2416] sm:text-4xl lg:text-5xl dark:text-[#F4F5F0]">
            Your next exam is already inside your lecture notes.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Empower your faculty with automated Bloom&apos;s question synthesis, duplicate auditing, and
            0-second auto-grading. Claim your 1,500 complimentary credits today.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <Button
              size="lg"
              className="bg-[#38492A] px-7 text-white shadow-xs hover:bg-[#2C3B20] dark:bg-[#8FB373] dark:text-[#11160E] dark:hover:bg-[#A3C687]"
              render={<Link href="/register" />}
            >
              Start generating free
              <span className="ml-1 rounded bg-white/20 px-1 py-0.5 text-[10px] font-mono tracking-tight text-white dark:bg-black/20 dark:text-black">
                1,500 credits
              </span>
              <ArrowRightIcon className="ml-1 size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border/80 bg-background/80 hover:bg-muted"
              render={<Link href="/login" />}
            >
              Sign in to account
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            No credit card required • Instant automated setup • Full workflow unlocked
          </p>
        </div>
      </div>

      {/* Structured Footer Navigation */}
      <div className="border-t border-border/70 py-12">
        <div className="mx-auto max-w-7xl 2xl:max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            {/* Brand Information */}
            <div>
              <Link href="/" className="flex items-center gap-2.5 font-heading text-xl font-bold tracking-tight text-foreground">
                <div className="relative flex size-8 items-center justify-center overflow-hidden rounded-lg bg-[#FAF9F5] p-1 shadow-xs ring-1 ring-[#38492A]/15 dark:bg-[#182015] dark:ring-[#8FB373]/25">
                  <Image src="/logo-icon.png" alt="Lecturra Logo" width={24} height={24} className="object-contain" />
                </div>
                <span>Lecturra</span>
              </Link>
              <p className="mt-2 text-xs text-muted-foreground max-w-xs">
                The Academic Operating System for intelligent question synthesis, duplicate auditing, and instant auto-grading.
              </p>
            </div>

            {/* Links Navigation */}
            <nav aria-label="Footer Navigation" className="flex flex-wrap gap-6 text-xs font-medium text-muted-foreground">
              <a href="#features" className="transition-colors hover:text-[#38492A] dark:hover:text-[#8FB373]">
                Features
              </a>
              <a href="#how-it-works" className="transition-colors hover:text-[#38492A] dark:hover:text-[#8FB373]">
                Workflow
              </a>
              <a href="#comparison" className="transition-colors hover:text-[#38492A] dark:hover:text-[#8FB373]">
                Why Lecturra
              </a>
              <a href="#pricing" className="transition-colors hover:text-[#38492A] dark:hover:text-[#8FB373]">
                Pricing
              </a>
              <a href="#testimonials" className="transition-colors hover:text-[#38492A] dark:hover:text-[#8FB373]">
                Faculty Proof
              </a>
              <a href="#faq" className="transition-colors hover:text-[#38492A] dark:hover:text-[#8FB373]">
                FAQ
              </a>
              <Link href="/login" className="transition-colors hover:text-[#38492A] dark:hover:text-[#8FB373]">
                Log in
              </Link>
              <Link href="/register" className="transition-colors hover:text-[#38492A] dark:hover:text-[#8FB373]">
                Register
              </Link>
            </nav>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} Lecturra Academic Suite. All rights reserved.</p>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <ShieldCheckIcon className="size-3.5 text-[#38492A] dark:text-[#8FB373]" />
                LMS Standard Compliant (Aiken & GIFT)
              </span>
              <span>•</span>
              <span>Paystack Secured Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Signature São Tomé Organic Palette Bottom Ribbon */}
      <div className="grid h-1.5 w-full grid-cols-4">
        <div className="bg-[#38492A]" />
        <div className="bg-[#80802B]" />
        <div className="bg-[#6D8382]" />
        <div className="bg-[#A0795C]" />
      </div>
    </footer>
  );
}
