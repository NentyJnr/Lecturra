"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2Icon,
  SparklesIcon,
  CheckCircle2Icon,
  ShieldCheckIcon,
  UsersIcon,
  ArrowRightIcon,
  Loader2Icon,
  AlertCircleIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { useSso } from "@/hooks/use-sso";
import {
  organizationsService,
  type InvitePreview,
} from "@/lib/api/services/organizations";

function JoinContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const fetchWorkspaces = useWorkspaceStore((s) => s.fetchWorkspaces);
  const setActiveWorkspace = useWorkspaceStore((s) => s.setActiveWorkspace);

  const { triggerGoogleLogin, triggerMicrosoftLogin, isGoogleLoading, isMicrosoftLoading } = useSso();

  const orgCode = searchParams.get("org") || searchParams.get("invite") || "";
  const [preview, setPreview] = useState<InvitePreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orgCode) {
      setError("No invitation code was found in the link.");
      setLoading(false);
      return;
    }

    // 1. Immediately persist invite code to localStorage and Lax cookie
    if (typeof window !== "undefined") {
      localStorage.setItem("lecturra_org_invite", orgCode.trim());
      document.cookie = `lecturra_org_invite=${encodeURIComponent(orgCode.trim())}; path=/; max-age=86400; SameSite=Lax`;
    }

    // 2. Fetch Organization Preview
    async function fetchPreview() {
      try {
        setLoading(true);
        const data = await organizationsService.getInvitePreview(orgCode.trim());
        setPreview(data);
      } catch (err: any) {
        setError(err.message || "Invalid or expired workspace invitation.");
      } finally {
        setLoading(false);
      }
    }

    fetchPreview();
  }, [orgCode]);

  async function handleAuthenticatedJoin() {
    if (!orgCode) return;
    setJoining(true);
    try {
      const result = await organizationsService.joinOrganization(orgCode.trim());
      toast.success("Joined Workspace!", {
        description: `Successfully joined ${result.name}. You now share ${result.sharedCredits.toLocaleString()} credits.`,
      });
      await fetchWorkspaces();
      setActiveWorkspace(result.organizationId);
      router.replace("/dashboard");
    } catch (err: any) {
      toast.error("Failed to join workspace", {
        description: err.message || "An error occurred.",
      });
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
        <Loader2Icon className="size-8 animate-spin text-primary" />
        <p className="mt-3 text-sm text-muted-foreground">Verifying invitation link...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md p-6 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
          <AlertCircleIcon className="size-6" />
        </div>
        <h1 className="font-heading text-lg font-bold text-foreground">Invitation Unavailable</h1>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{error}</p>
        <div className="mt-6 flex flex-col gap-2">
          <Button render={<Link href="/login" />} variant="outline" size="sm" className="text-xs">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const orgName = preview?.name || "Academic Department";

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <Badge
          variant="secondary"
          className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 gap-1.5"
        >
          <Building2Icon className="size-3.5" />
          <span>Workspace Invitation</span>
        </Badge>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Join {orgName}
        </h1>
        <p className="text-xs text-muted-foreground">
          You&apos;ve been invited to collaborate on this institutional workspace.
        </p>
      </div>

      {/* Main Card */}
      <Card className="border-border/80 shadow-xl bg-card/95 backdrop-blur-xs">
        <CardContent className="p-6 space-y-5">
          {/* Workspace Details Pill */}
          <div className="rounded-xl border border-border/70 bg-muted/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Organization</span>
              <span className="text-xs font-bold text-foreground">{orgName}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border/40 pt-2.5">
              <span className="text-xs text-muted-foreground font-medium">Workspace Code</span>
              <span className="font-mono text-xs font-semibold text-primary">{orgCode.toUpperCase()}</span>
            </div>
            {preview?.memberCount !== undefined && (
              <div className="flex items-center justify-between border-t border-border/40 pt-2.5">
                <span className="text-xs text-muted-foreground font-medium">Faculty Members</span>
                <span className="flex items-center gap-1 text-xs font-medium text-foreground">
                  <UsersIcon className="size-3 text-muted-foreground" />
                  {preview.memberCount} active
                </span>
              </div>
            )}
          </div>

          {/* Benefits List */}
          <div className="space-y-2.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2Icon className="size-4 text-emerald-500 shrink-0" />
              <span>Deduct AI generation credits from the shared department pool</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2Icon className="size-4 text-emerald-500 shrink-0" />
              <span>Maintain your private library and personal credits independently</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2Icon className="size-4 text-emerald-500 shrink-0" />
              <span>Switch between personal and department workspaces with 1-click</span>
            </div>
          </div>

          {/* Actions */}
          {isAuthenticated ? (
            <div className="space-y-3 pt-2">
              <Button
                onClick={handleAuthenticatedJoin}
                disabled={joining}
                className="w-full gap-2 text-xs font-semibold py-2.5"
              >
                {joining ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    Joining Workspace...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="size-4" />
                    Join Workspace as Active Account
                  </>
                )}
              </Button>
              <p className="text-[11px] text-center text-muted-foreground">
                You are currently signed in. Clicking will add this department to your workspace switcher.
              </p>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {/* Google SSO Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 text-xs font-semibold py-2.5 border-border hover:bg-muted"
                onClick={triggerGoogleLogin}
                disabled={isGoogleLoading || isMicrosoftLoading}
              >
                {isGoogleLoading ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <svg className="size-4" viewBox="0 0 24 24">
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
                )}
                <span>Continue with Google</span>
              </Button>

              {/* Microsoft SSO Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 text-xs font-semibold py-2.5 border-border hover:bg-muted"
                onClick={triggerMicrosoftLogin}
                disabled={isGoogleLoading || isMicrosoftLoading}
              >
                {isMicrosoftLoading ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <svg className="size-4" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                )}
                <span>Continue with Microsoft</span>
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/60" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-card px-2 text-muted-foreground font-semibold">Or with password</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button render={<Link href="/login" />} variant="outline" size="sm" className="w-1/2 text-xs">
                  Sign In
                </Button>
                <Button render={<Link href="/register" />} size="sm" className="w-1/2 text-xs">
                  Register
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2Icon className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <JoinContent />
    </Suspense>
  );
}
