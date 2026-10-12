"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EyeIcon,
  EyeOffIcon,
  GraduationCapIcon,
  Loader2Icon,
  OctagonXIcon,
  SparklesIcon,
  StarIcon,
  ClockIcon,
  ShieldCheckIcon,
  CheckCircle2Icon,
  BuildingIcon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ModeToggle } from "@/components/mode-toggle";
import { useRegister } from "@/hooks/use-auth";
import { useSso } from "@/hooks/use-sso";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function MicrosoftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 21 21" width="18" height="18" {...props}>
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();
  const { triggerGoogleLogin, triggerMicrosoftLogin, isGoogleLoading, isMicrosoftLoading } = useSso();
  const [showPassword, setShowPassword] = useState(false);
  const [referralBonusActive, setReferralBonusActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get("ref");
    if (ref) {
      localStorage.setItem("lectura_referral_code", ref.trim());
      setReferralBonusActive(true);
    } else if (localStorage.getItem("lectura_referral_code")) {
      setReferralBonusActive(true);
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { accountType: 1 },
  });

  const selectedAccountType = watch("accountType");

  function onSubmit(values: RegisterValues) {
    const storedRef = typeof window !== "undefined" ? localStorage.getItem("lectura_referral_code") || undefined : undefined;
    registerMutation.mutate(
      {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        accountType: values.accountType,
        institutionName: values.institutionName,
        referredByReferralCode: storedRef,
      },
      {
        onSuccess: () => {
          if (storedRef) {
            localStorage.removeItem("lectura_referral_code");
          }
          toast.success("Account created successfully!", {
            description: "Check your email for the verification link before logging in.",
          });
          router.push("/login");
        },
      },
    );
  }

  return (
    <div className="grid min-h-svh grid-cols-1 lg:grid-cols-2">
      {/* ── Left Column: Streamlined Form Panel ─────────────────────── */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16">
        {/* Top Header Lockup */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2.5 font-heading text-lg font-bold tracking-tight text-foreground"
            aria-label="Back to Lecturra home"
          >
            <div className="relative flex size-8 items-center justify-center overflow-hidden rounded-lg bg-[#FAF9F5] p-1 shadow-xs ring-1 ring-[#38492A]/15 transition-transform group-hover:scale-105 dark:bg-[#182015] dark:ring-[#8FB373]/25">
              <Image src="/logo-icon.png" alt="Lecturra Logo" width={26} height={26} className="object-contain" priority />
            </div>
            <span>Lecturra</span>
          </Link>
          <ModeToggle />
        </div>

        {/* Center Register Form */}
        <div className="mx-auto my-auto w-full max-w-sm py-8 sm:max-w-md">
          <div className="mb-6">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#38492A]/20 bg-[#38492A]/5 px-3 py-1 font-mono text-[11px] font-semibold text-[#38492A] dark:border-[#8FB373]/30 dark:bg-[#8FB373]/10 dark:text-[#8FB373]">
              <SparklesIcon className="size-3" />
              <span>1,500 Free Question Synthesis Credits</span>
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Create your account
            </h1>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Get 1,500 free credits to start generating questions.
            </p>
          </div>

          {/* Institutional Single Sign-On Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              disabled={isGoogleLoading || isMicrosoftLoading}
              onClick={triggerGoogleLogin}
              className="w-full justify-center gap-2.5 border-border/80 bg-background hover:bg-muted font-medium text-xs sm:text-sm h-10 shadow-xs"
            >
              {isGoogleLoading ? <Loader2Icon className="size-4 animate-spin" /> : <GoogleIcon />}
              {isGoogleLoading ? "Connecting to Google..." : "Sign up with Google"}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isGoogleLoading || isMicrosoftLoading}
              onClick={triggerMicrosoftLogin}
              className="w-full justify-center gap-2.5 border-border/80 bg-background hover:bg-muted font-medium text-xs sm:text-sm h-10 shadow-xs"
            >
              {isMicrosoftLoading ? <Loader2Icon className="size-4 animate-spin" /> : <MicrosoftIcon />}
              {isMicrosoftLoading ? "Connecting to Microsoft..." : "Sign up with Microsoft"}
            </Button>
          </div>

          {/* Clean "OR" Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/80" />
            </div>
            <span className="relative bg-background px-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              or continue with email
            </span>
          </div>

          {/* Streamlined Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {registerMutation.isError && (
              <Alert variant="destructive">
                <OctagonXIcon className="size-4" />
                <AlertTitle>Registration failed</AlertTitle>
                <AlertDescription>{getApiErrorMessage(registerMutation.error)}</AlertDescription>
              </Alert>
            )}

            <FieldGroup className="space-y-3.5">
              {/* Account Type Toggle */}
              <Field>
                <FieldLabel className="text-xs font-semibold text-foreground">
                  Account Type
                </FieldLabel>
                <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-border/80 bg-muted/60 p-1">
                  <button
                    type="button"
                    onClick={() => setValue("accountType", 1)}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium rounded-md transition-all ${
                      selectedAccountType === 1
                        ? "bg-background text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <UserIcon className="size-3.5" />
                    Individual Lecturer
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("accountType", 2)}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium rounded-md transition-all ${
                      selectedAccountType === 2
                        ? "bg-background text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <BuildingIcon className="size-3.5" />
                    School / Organization
                  </button>
                </div>
                <input type="hidden" {...register("accountType", { valueAsNumber: true })} />
              </Field>

              {/* Institution Name (revealed only if Organization is selected) */}
              {selectedAccountType === 2 && (
                <Field data-invalid={!!errors.institutionName}>
                  <FieldLabel htmlFor="institutionName" className="text-xs font-semibold text-foreground">
                    Institution / University Name
                  </FieldLabel>
                  <Input
                    id="institutionName"
                    placeholder="e.g. University of Lagos"
                    className="h-10 text-sm"
                    aria-invalid={!!errors.institutionName}
                    {...register("institutionName")}
                  />
                  {errors.institutionName && <FieldError>{errors.institutionName.message}</FieldError>}
                </Field>
              )}

              {/* Full Name */}
              <Field data-invalid={!!errors.fullName}>
                <FieldLabel htmlFor="fullName" className="text-xs font-semibold text-foreground">
                  Full Name
                </FieldLabel>
                <Input
                  id="fullName"
                  placeholder="Dr. Babatunde Adeyemi"
                  autoComplete="name"
                  className="h-10 text-sm"
                  aria-invalid={!!errors.fullName}
                  {...register("fullName")}
                />
                {errors.fullName && <FieldError>{errors.fullName.message}</FieldError>}
              </Field>

              {/* Institutional Email */}
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email" className="text-xs font-semibold text-foreground">
                  Institutional Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@unilag.edu.ng"
                  autoComplete="email"
                  className="h-10 text-sm"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </Field>

              {/* Password */}
              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password" className="text-xs font-semibold text-foreground">
                  Password
                </FieldLabel>
                <div className="relative flex items-center">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••••••"
                    className="h-10 pr-10 text-sm"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 text-muted-foreground hover:text-foreground focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                  </button>
                </div>
                {errors.password && <FieldError>{errors.password.message}</FieldError>}
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Must be at least 8 characters. Additional profile details collected post-signup.
                </p>
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="mt-3 w-full h-10 bg-[#38492A] text-white shadow-xs hover:bg-[#2C3B20] dark:bg-[#8FB373] dark:text-[#11160E] dark:hover:bg-[#A3C687] font-semibold text-sm"
            >
              {registerMutation.isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
              {registerMutation.isPending ? "Creating account..." : "Create account"}
            </Button>
          </form>

          {/* Login Link Footer */}
          <div className="mt-6 text-center text-xs text-muted-foreground sm:text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#38492A] hover:underline dark:text-[#8FB373]"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="text-center text-[11px] text-muted-foreground sm:text-left">
          © {new Date().getFullYear()} Lecturra Academic Suite • Institutional SSO Supported
        </div>
      </div>

      {/* ── Right Column: Engagement & Social Proof Panel ─────────── */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#1A2416] via-[#11160E] to-[#182314] p-10 text-[#F4F5F0] lg:flex lg:flex-col lg:justify-between xl:p-16">
        {/* Subtle Ambient Radial Highlight */}
        <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_75%_35%,rgba(143,179,115,0.18)_0%,transparent_60%)]" />

        {/* Top São Tomé 4-Color Hairline Ribbon */}
        <div className="absolute top-0 right-0 left-0 grid h-1 grid-cols-4">
          <div className="bg-[#38492A]" />
          <div className="bg-[#80802B]" />
          <div className="bg-[#6D8382]" />
          <div className="bg-[#A0795C]" />
        </div>

        {/* Top Social Proof Badge */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-medium text-emerald-300 backdrop-blur-md">
            <SparklesIcon className="size-3.5 text-emerald-400" />
            <span>Join forward-thinking faculty members automating their assessments</span>
          </div>
        </div>

        {/* Center Visual Mockup & Value Proposition */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div>
            <h2 className="font-heading text-3xl font-normal leading-[1.15] tracking-tight text-[#F4F5F0] xl:text-4xl 2xl:text-5xl text-balance">
              1,500 free credits to transform your next midterm.
            </h2>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-white/70 xl:text-base">
              Skip 12 hours of manual marking. Upload your syllabus and let AI compile Bloom&apos;s-aligned exams
              with instant student grading links.
            </p>
          </div>

          {/* High-Quality Abstract UI Mockup: "Time Saved & Automated Grading" */}
          <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md shadow-2xl space-y-4">
            {/* Header Lockup of Mockup */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-xs font-semibold text-white">Live Automated Grading</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-300 border border-emerald-500/30">
                <ClockIcon className="size-3" />
                <span>~8.5 Hours Saved</span>
              </div>
            </div>

            {/* Assessment Meta Card */}
            <div className="rounded-lg bg-black/30 p-3 border border-white/10 text-xs">
              <div className="flex items-center justify-between text-[11px] text-white/60 mb-1">
                <span>Course: PHY 201 • Quantum Mechanics</span>
                <span className="font-mono text-emerald-400">Bloom: Level 4 (Analyze)</span>
              </div>
              <p className="font-medium text-white/90">
                Synthesis Batch: 50 Questions Generated • Vector Duplicate Match: 0.0%
              </p>
            </div>

            {/* Real-time Submissions Stream */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between rounded-md bg-white/5 px-3 py-1.5 text-xs border border-white/5">
                <div className="flex items-center gap-2">
                  <CheckCircle2Icon className="size-3.5 text-emerald-400" />
                  <span className="font-mono text-white/80">Matric: 200408112</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-300">48/50 (96%)</span>
                  <span className="text-[10px] text-white/50">0.0s graded</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-md bg-white/5 px-3 py-1.5 text-xs border border-white/5">
                <div className="flex items-center gap-2">
                  <CheckCircle2Icon className="size-3.5 text-emerald-400" />
                  <span className="font-mono text-white/80">Matric: 200408113</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-300">44/50 (88%)</span>
                  <span className="text-[10px] text-white/50">0.0s graded</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-md bg-white/5 px-3 py-1.5 text-xs border border-white/5">
                <div className="flex items-center gap-2">
                  <CheckCircle2Icon className="size-3.5 text-emerald-400" />
                  <span className="font-mono text-white/80">Matric: 200408114</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-300">49/50 (98%)</span>
                  <span className="text-[10px] text-white/50">0.0s graded</span>
                </div>
              </div>
            </div>

            {/* Mathematical Deduplication Guarantee */}
            <div className="flex items-center gap-2 border-t border-white/10 pt-3 text-[11px] text-white/70">
              <ShieldCheckIcon className="size-3.5 text-emerald-400" />
              <span>Zero student logins required • Direct self-grading web portal</span>
            </div>
          </div>

          {/* Social Proof Quote */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="size-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs leading-relaxed text-white/90">
              &ldquo;Lecturra gave me my weekends back. Setting continuous assessments used to take three days;
              now it takes three minutes.&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-white/60">
              <span className="font-semibold text-white">Prof. Folashade Okonjo</span>
              <span>•</span>
              <span>Dean of Sciences, State University</span>
            </div>
          </div>
        </div>

        {/* Bottom Feature Micro-Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-white/15 pt-6 text-xs text-white/70">
          <div>
            <p className="font-heading text-lg font-bold text-white">1,500 Credits</p>
            <p className="text-[11px] text-white/60">Instant starter balance</p>
          </div>
          <div>
            <p className="font-heading text-lg font-bold text-white">Zero Grading</p>
            <p className="text-[11px] text-white/60">Real-time score compiling</p>
          </div>
          <div>
            <p className="font-heading text-lg font-bold text-white">100% Bloom&apos;s</p>
            <p className="text-[11px] text-white/60">Cognitive taxonomy match</p>
          </div>
        </div>
      </div>
    </div>
  );
}
