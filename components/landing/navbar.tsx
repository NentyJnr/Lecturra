"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCapIcon, MenuIcon, XIcon, LayoutDashboardIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuthStore } from "@/stores/auth-store";

const links = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md">
      {/* Signature São Tomé Organic Palette Ribbon */}
      <div className="grid h-[3px] w-full grid-cols-4">
        <div className="bg-[#38492A]" title="Rainforest Moss" />
        <div className="bg-[#80802B]" title="Canopy Olive" />
        <div className="bg-[#6D8382]" title="Atlantic Sage" />
        <div className="bg-[#A0795C]" title="Volcanic Terracotta" />
      </div>

      <nav aria-label="Main" className="mx-auto flex h-15 max-w-5xl items-center gap-4 px-6">
        <Link href="/" className="group flex items-center gap-2.5 font-heading text-xl font-medium tracking-tight">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#38492A] text-white shadow-xs transition-transform group-hover:scale-105 dark:bg-[#8FB373] dark:text-[#11160E]">
            <GraduationCapIcon className="size-4.5" aria-hidden />
          </div>
          <span className="text-foreground">Lecturra</span>
        </Link>
        <div className="ml-8 hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-[#38492A] dark:hover:text-[#8FB373]">
              {l.label}
            </a>
          ))}
        </div>
        <div className="ml-auto hidden items-center gap-2.5 md:flex">
          <ModeToggle />
          {isAuthenticated ? (
            <Button className="bg-[#38492A] text-white hover:bg-[#2C3B20] dark:bg-[#8FB373] dark:text-[#11160E] dark:hover:bg-[#A3C687]" render={<Link href="/dashboard" />}>
              <LayoutDashboardIcon className="size-4" /> Go to Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" className="text-foreground hover:bg-muted" render={<Link href="/login" />}>
                Log in
              </Button>
              <Button className="bg-[#38492A] text-white shadow-xs hover:bg-[#2C3B20] dark:bg-[#8FB373] dark:text-[#11160E] dark:hover:bg-[#A3C687]" render={<Link href="/register" />}>
                Start free
              </Button>
            </>
          )}
        </div>
        <div className="ml-auto flex items-center gap-1 md:hidden">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <XIcon /> : <MenuIcon />}
          </Button>
        </div>
      </nav>
      {open && (
        <div className="border-t bg-background/95 px-6 py-4 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1.5">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 flex gap-2 pt-2 border-t border-border">
              {isAuthenticated ? (
                <Button className="w-full bg-[#38492A] text-white dark:bg-[#8FB373] dark:text-[#11160E]" render={<Link href="/dashboard" />}>
                  <LayoutDashboardIcon className="size-4" /> Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="flex-1" render={<Link href="/login" />}>
                    Log in
                  </Button>
                  <Button className="flex-1 bg-[#38492A] text-white dark:bg-[#8FB373] dark:text-[#11160E]" render={<Link href="/register" />}>
                    Start free
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
