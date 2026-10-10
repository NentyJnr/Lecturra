"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCapIcon, MenuIcon, XIcon, LayoutDashboardIcon, SparklesIcon, ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuthStore } from "@/stores/auth-store";

const links = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "Workflow" },
  { href: "#comparison", label: "Why Lecturra" },
  { href: "#pricing", label: "Pricing & ROI" },
  { href: "#testimonials", label: "Faculty Proof" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      {/* Signature São Tomé Organic Academic Palette Ribbon */}
      <div className="grid h-[3px] w-full grid-cols-4">
        <div className="bg-[#38492A]" title="Rainforest Moss" />
        <div className="bg-[#80802B]" title="Canopy Olive" />
        <div className="bg-[#6D8382]" title="Atlantic Sage" />
        <div className="bg-[#A0795C]" title="Volcanic Terracotta" />
      </div>

      <nav aria-label="Main Navigation" className="mx-auto flex h-16 max-w-7xl 2xl:max-w-[1536px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex items-center gap-2.5 font-heading text-xl font-medium tracking-tight">
            <div className="flex size-8.5 items-center justify-center rounded-lg bg-[#38492A] text-white shadow-xs transition-transform group-hover:scale-105 dark:bg-[#8FB373] dark:text-[#11160E]">
              <GraduationCapIcon className="size-5" aria-hidden />
            </div>
            <span className="font-heading text-xl font-semibold tracking-tight text-foreground">Lecturra</span>
          </Link>
          <span className="hidden items-center gap-1 rounded-full border border-border/80 bg-muted/60 px-2 py-0.5 text-[10px] font-mono font-medium text-muted-foreground sm:inline-flex">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            v2.0 Academic Engine
          </span>
        </div>

        {/* Center Desktop Navigation */}
        <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-[#38492A] dark:hover:text-[#8FB373]"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Right CTA Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ModeToggle />
          {isAuthenticated ? (
            <Button
              className="bg-[#38492A] text-white hover:bg-[#2C3B20] dark:bg-[#8FB373] dark:text-[#11160E] dark:hover:bg-[#A3C687]"
              render={<Link href="/dashboard" />}
            >
              <LayoutDashboardIcon className="size-4" /> Go to Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-sm font-medium text-foreground hover:bg-muted"
                render={<Link href="/login" />}
              >
                Log in
              </Button>
              <Button
                className="bg-[#38492A] px-3.5 text-white shadow-xs hover:bg-[#2C3B20] dark:bg-[#8FB373] dark:text-[#11160E] dark:hover:bg-[#A3C687]"
                render={<Link href="/register" />}
              >
                Start free
                <span className="ml-1 rounded bg-white/20 px-1 py-0.5 text-[10px] font-mono tracking-tight text-white dark:bg-black/20 dark:text-black">
                  1,500 credits
                </span>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-border/80 bg-background/95 px-6 py-5 backdrop-blur-md md:hidden animate-in fade-in-50 slide-in-from-top-2">
          <div className="flex flex-col gap-1.5">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-2.5 border-t border-border/80 pt-4">
              {isAuthenticated ? (
                <Button
                  className="w-full bg-[#38492A] text-white dark:bg-[#8FB373] dark:text-[#11160E]"
                  render={<Link href="/dashboard" />}
                >
                  <LayoutDashboardIcon className="size-4" /> Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-center"
                    render={<Link href="/login" />}
                  >
                    Log in
                  </Button>
                  <Button
                    className="w-full justify-center bg-[#38492A] text-white dark:bg-[#8FB373] dark:text-[#11160E]"
                    render={<Link href="/register" />}
                  >
                    Start free with 1,500 credits
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
