"use client";

import Link from "next/link";
import {
  LibraryIcon,
  HelpCircleIcon,
  BarChart3Icon,
  CreditCardIcon,
  SparklesIcon,
  UploadIcon,
  PlusIcon,
  ArrowRightIcon,
  FileTextIcon,
  CheckCircle2Icon,
  UsersIcon,
  Building2Icon,
} from "lucide-react";

import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardOverviewPage() {
  const user = useAuthStore((s) => s.user);

  const isOrganization = user?.accountType === 2 || !!user?.institutionName;
  const isAdmin = user?.role === "InstitutionAdmin" || user?.role === "SystemAdmin" || user?.accountType === 2;

  const quickStats = [
    {
      title: "AI Credits Remaining",
      value: "1,500",
      change: "Free allocation loaded",
      icon: SparklesIcon,
      accent: "text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900",
    },
    {
      title: "Library Materials",
      value: "0",
      change: "Upload lecture notes & slides",
      icon: LibraryIcon,
      accent: "text-sky-500 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-900",
    },
    {
      title: "Question Banks Generated",
      value: "0",
      change: "Ready for AI question run",
      icon: HelpCircleIcon,
      accent: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900",
    },
    {
      title: "Submissions & Results",
      value: "0",
      change: "Student test submissions",
      icon: BarChart3Icon,
      accent: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1 bg-primary/15 text-primary border-primary/20 font-medium">
                {isOrganization ? <Building2Icon className="size-3.5" /> : <SparklesIcon className="size-3.5" />}
                {isOrganization ? (user?.institutionName || "School Organization") : "Individual Lecturer Workspace"}
              </Badge>
              {isAdmin && (
                <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400">
                  Administrator
                </Badge>
              )}
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">
              Welcome back, {user?.title ? `${user.title} ` : ""}{user?.fullName || "Educator"}!
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Upload your course material, generate AI question banks across multiple difficulty tiers, construct student assessments, and view automated grading analytics from your dashboard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button size="lg" render={<Link href="/dashboard/library" />}>
              <UploadIcon className="size-4" /> Upload Material
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/dashboard/question-bank" />}>
              <SparklesIcon className="size-4 text-amber-500" /> Generate Questions
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stat Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.title} className="relative overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground">{s.title}</CardTitle>
                <div className={`flex size-9 items-center justify-center rounded-xl border ${s.accent}`}>
                  <Icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-heading">{s.value}</div>
                <p className="text-[11px] text-muted-foreground mt-1">{s.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg font-bold tracking-tight">Platform Features & Shortcuts</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* The Library Card */}
          <Card className="group hover:border-primary/50 transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <LibraryIcon className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-base">The Library</CardTitle>
                  <CardDescription className="text-xs">Lecture Materials & Documents</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Upload your course outlines, slides, and textbooks in PDF, PPTX, or DOCX formats to feed the AI question generator.
              </p>
              <Button variant="ghost" size="xs" className="w-full justify-between text-primary hover:text-primary" render={<Link href="/dashboard/library" />}>
                <span>Manage Library</span>
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </CardContent>
          </Card>

          {/* Question Bank Card */}
          <Card className="group hover:border-primary/50 transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <HelpCircleIcon className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Questionbank</CardTitle>
                  <CardDescription className="text-xs">AI Generation & Assembly</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Generate high-quality multiple choice, true/false, and essay questions. Export as Aiken, GIFT, or PDF formats.
              </p>
              <Button variant="ghost" size="xs" className="w-full justify-between text-primary hover:text-primary" render={<Link href="/dashboard/question-bank" />}>
                <span>Open Question Bank</span>
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </CardContent>
          </Card>

          {/* Result Station Card */}
          <Card className="group hover:border-primary/50 transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <BarChart3Icon className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Result Station</CardTitle>
                  <CardDescription className="text-xs">Test Reports & Student Analytics</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                View student assessment submissions, automatically computed total scores, percentage pass rates, and export CSV reports.
              </p>
              <Button variant="ghost" size="xs" className="w-full justify-between text-primary hover:text-primary" render={<Link href="/dashboard/results" />}>
                <span>View Result Reports</span>
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </CardContent>
          </Card>

          {/* Quota Topup / Payments Card */}
          <Card className="group hover:border-primary/50 transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <CreditCardIcon className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Quota Topup / Payments</CardTitle>
                  <CardDescription className="text-xs">Credits & Billing Packages</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                1,500 free credits currently loaded. Top up your AI generation quota anytime via OPay payment integration.
              </p>
              <Button variant="ghost" size="xs" className="w-full justify-between text-primary hover:text-primary" render={<Link href="/dashboard/billing" />}>
                <span>Topup Quota</span>
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </CardContent>
          </Card>

          {/* Organization Members Card - Conditional */}
          {isOrganization && (
            <Card className="group hover:border-primary/50 transition-all hover:shadow-md border-sky-500/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <UsersIcon className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Organization Members</CardTitle>
                    <CardDescription className="text-xs">Faculty Access Code & Staff</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  View department lecturers enrolled in your school workspace and share your unique Faculty Access Code.
                </p>
                <Button variant="ghost" size="xs" className="w-full justify-between text-primary hover:text-primary" render={<Link href="/dashboard/members" />}>
                  <span>Manage Members</span>
                  <ArrowRightIcon className="size-3.5" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Organization Setup Card - Conditional */}
          {isAdmin && (
            <Card className="group hover:border-primary/50 transition-all hover:shadow-md border-amber-500/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Building2Icon className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Organization Setup</CardTitle>
                    <CardDescription className="text-xs">Domain Mapping & Admin</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Configure school workspace settings, institutional domain mapping (e.g. @unilag.edu.ng), and admin parameters.
                </p>
                <Button variant="ghost" size="xs" className="w-full justify-between text-primary hover:text-primary" render={<Link href="/dashboard/setup" />}>
                  <span>Open Setup</span>
                  <ArrowRightIcon className="size-3.5" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
