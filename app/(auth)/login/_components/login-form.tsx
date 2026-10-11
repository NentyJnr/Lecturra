"use client";

import { useState } from "react";
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
  ShieldCheckIcon,
  ClockIcon,
  CheckCircle2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ModeToggle } from "@/components/mode-toggle";
import { useLogin } from "@/hooks/use-auth";
import { useSso } from "@/hooks/use-sso";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { ProviderType } from "@/lib/api/types/auth";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";

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

export function LoginForm() {
  const router = useRouter();
  const login = useLogin();
  const { triggerGoogleLogin, triggerMicrosoftLogin, isGoogleLoading, isMicrosoftLoading } = useSso();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  function onSubmit(values: LoginValues) {
    login.mutate(
      {
        email: values.email,
        passwordOrToken: values.password,
        providerType: ProviderType.Email,
      },
      {
        onSuccess: () => {
          toast.success("Welcome back!");
          router.push("/dashboard");
        },
      },
    );
  }

  return (
    <div className="grid min-h-svh grid-cols-1 lg:grid-cols-2">
      {/* ── Left Column: Form Panel ──────────────────────────────── */}
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

        {/* Center Login Form */}
        <div className="mx-auto my-auto w-full max-w-sm py-10 sm:max-w-md">
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Enter your institutional credentials to access your academic workspace.
            </p>
          </div>

          {/* Institutional Single Sign-On Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              disabled={isGoogleLoading || isMicrosoftLoading}
              onClick={triggerGoogleLogin}
              className="w-full justify-center gap-2.5 border-border/80 bg-background/80 hover:bg-muted font-medium text-xs sm:text-sm h-10 shadow-xs"
            >
              {isGoogleLoading ? <Loader2Icon className="size-4 animate-spin" /> : <GoogleIcon />}
              {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isGoogleLoading || isMicrosoftLoading}
              onClick={triggerMicrosoftLogin}
              className="w-full justify-center gap-2.5 border-border/80 bg-background/80 hover:bg-muted font-medium text-xs sm:text-sm h-10 shadow-xs"
            >
              {isMicrosoftLoading ? <Loader2Icon className="size-4 animate-spin" /> : <MicrosoftIcon />}
              {isMicrosoftLoading ? "Connecting to Microsoft..." : "Continue with Microsoft"}
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

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {login.isError && (
              <Alert variant="destructive">
                <OctagonXIcon className="size-4" />
                <AlertTitle>Login failed</AlertTitle>
                <AlertDescription>{getApiErrorMessage(login.error)}</AlertDescription>
              </Alert>
            )}

            <FieldGroup className="space-y-4">
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email" className="text-xs font-semibold text-foreground">
                  Institutional Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@unilag.edu.ng"
                  aria-invalid={!!errors.email}
                  className="h-10 text-sm"
                  {...register("email")}
                />
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.password}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password" className="text-xs font-semibold text-foreground">
                    Password
                  </FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-[#38492A] hover:underline dark:text-[#8FB373]"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative flex items-center">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
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
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              disabled={login.isPending}
              className="mt-2 w-full h-10 bg-[#38492A] text-white shadow-xs hover:bg-[#2C3B20] dark:bg-[#8FB373] dark:text-[#11160E] dark:hover:bg-[#A3C687] font-semibold text-sm"
            >
              {login.isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
              {login.isPending ? "Signing in..." : "Log in"}
            </Button>
          </form>

          {/* Registration Link Footer */}
          <div className="mt-6 text-center text-xs text-muted-foreground sm:text-sm">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#38492A] hover:underline dark:text-[#8FB373]"
            >
              Create one (1,500 free credits)
            </Link>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="text-center text-[11px] text-muted-foreground sm:text-left">
          © {new Date().getFullYear()} Lecturra Academic Suite • Institutional SSO Supported
        </div>
      </div>

      {/* ── Right Column: Engagement Panel ───────────────────────── */}
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

        {/* Top Tag */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-medium text-emerald-300 backdrop-blur-md">
            <SparklesIcon className="size-3.5 text-emerald-400" />
            <span>Academic Assessment Engine • Trusted by 1,400+ Faculty</span>
          </div>
        </div>

        {/* Center Quote & Testimonial Card */}
        <div className="relative z-10 max-w-lg space-y-8">
          <div>
            <h2 className="font-heading text-3xl font-normal leading-[1.15] tracking-tight text-[#F4F5F0] xl:text-4xl 2xl:text-5xl text-balance">
              &ldquo;Turn hours of grading into seconds of review.&rdquo;
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70 xl:text-base">
              Upload textbook chapters, let AI synthesize Bloom&apos;s-level exams, and let timed student links
              auto-grade submissions in real time.
            </p>
          </div>

          {/* Testimonial Card with Glassmorphism */}
          <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md shadow-2xl transition-all hover:border-white/25">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="size-4 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-white/90">
              &ldquo;Lecturra completely changed how I handle my midterms. 280 students tested simultaneously,
              and the scores compiled automatically.&rdquo;
            </p>

            <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#38492A] to-[#8FB373] font-mono text-xs font-bold text-white shadow-xs">
                DA
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Dr. Adeyemi</h4>
                <p className="text-[11px] text-white/60">Faculty of Sciences, Federal University</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Micro-Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-white/15 pt-6 text-xs text-white/70">
          <div>
            <p className="font-heading text-lg font-bold text-white">50 Qs in 90s</p>
            <p className="text-[11px] text-white/60">Full batch synthesis</p>
          </div>
          <div>
            <p className="font-heading text-lg font-bold text-white">Zero Logins</p>
            <p className="text-[11px] text-white/60">Instant student exam link</p>
          </div>
          <div>
            <p className="font-heading text-lg font-bold text-white">100% Instant</p>
            <p className="text-[11px] text-white/60">Auto-graded scorecards</p>
          </div>
        </div>
      </div>
    </div>
  );
}
