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
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <nav aria-label="Main" className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-6">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-medium">
          <GraduationCapIcon className="size-5 text-primary" aria-hidden />
          Lecturra
        </Link>
        <div className="ml-6 hidden items-center gap-5 text-sm text-muted-foreground md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </div>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <ModeToggle />
          {isAuthenticated ? (
            <Button render={<Link href="/dashboard" />}>
              <LayoutDashboardIcon className="size-4" /> Go to Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" render={<Link href="/login" />}>
                Log in
              </Button>
              <Button render={<Link href="/register" />}>Start free</Button>
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
        <div className="border-t px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2 text-sm hover:bg-muted"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex gap-2">
              {isAuthenticated ? (
                <Button className="w-full" render={<Link href="/dashboard" />}>
                  <LayoutDashboardIcon className="size-4" /> Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="flex-1" render={<Link href="/login" />}>
                    Log in
                  </Button>
                  <Button className="flex-1" render={<Link href="/register" />}>
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
