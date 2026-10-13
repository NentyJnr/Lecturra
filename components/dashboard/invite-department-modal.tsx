"use client";

import { useState, useEffect } from "react";
import {
  Building2Icon,
  CheckCircle2Icon,
  CopyIcon,
  Link2Icon,
  Loader2Icon,
  MailIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { organizationsService, InviteLinkResult } from "@/lib/api/services/organizations";
import { getApiErrorMessage } from "@/lib/api/api-error";

interface InviteDepartmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  organizationName: string;
}

export function InviteDepartmentModal({
  open,
  onOpenChange,
  organizationId,
  organizationName,
}: InviteDepartmentModalProps) {
  const [targetEmail, setTargetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [inviteResult, setInviteResult] = useState<InviteLinkResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open && organizationId) {
      handleGenerate();
    } else {
      setInviteResult(null);
      setTargetEmail("");
      setCopied(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, organizationId]);

  async function handleGenerate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!organizationId) return;

    setLoading(true);
    setCopied(false);
    try {
      const res = await organizationsService.generateInviteLink(
        organizationId,
        targetEmail.trim() || undefined
      );
      setInviteResult(res);
    } catch (err) {
      toast.error("Failed to generate invite link", {
        description: getApiErrorMessage(err),
      });
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!inviteResult) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = inviteResult.inviteLink.startsWith("http")
      ? inviteResult.inviteLink
      : `${origin}${inviteResult.inviteLink}`;

    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast.success("Invite link copied to clipboard!", {
      description: fullUrl,
    });
    setTimeout(() => setCopied(false), 3000);
  }

  function handleCopyCode() {
    if (!inviteResult) return;
    navigator.clipboard.writeText(inviteResult.inviteCode);
    toast.success(`Invite code copied: ${inviteResult.inviteCode}`);
  }

  if (!open) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const displayUrl = inviteResult
    ? inviteResult.inviteLink.startsWith("http")
      ? inviteResult.inviteLink
      : `${origin}${inviteResult.inviteLink}`
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => !loading && onOpenChange(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95">
        <button
          onClick={() => !loading && onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted transition-colors"
          disabled={loading}
          aria-label="Close"
        >
          <XIcon className="size-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Building2Icon className="size-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              Invite Colleagues to Department
            </h2>
            <p className="text-xs text-muted-foreground">
              Share pool credits for <span className="font-semibold text-foreground">{organizationName}</span>
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {/* Active Link Preview & Copy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Link2Icon className="size-3.5 text-purple-600 dark:text-purple-400" />
                Shareable Onboarding Link
              </label>
              {inviteResult && (
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="text-[11px] font-mono text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                >
                  Code: {inviteResult.inviteCode}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={loading ? "Generating secure invite link..." : displayUrl}
                className="font-mono text-xs bg-muted/50 select-all"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleCopy}
                disabled={loading || !inviteResult}
                className="gap-1.5 shrink-0 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs"
              >
                {copied ? (
                  <>
                    <CheckCircle2Icon className="size-3.5 text-white" />
                    Copied
                  </>
                ) : (
                  <>
                    <CopyIcon className="size-3.5" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Optional Direct Email Issuance */}
          <form onSubmit={handleGenerate} className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <MailIcon className="size-3.5 text-muted-foreground" />
              Target Specific Educator Email (Optional)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="email"
                placeholder="colleague@university.edu"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                disabled={loading}
                className="text-xs"
              />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                disabled={loading}
                className="shrink-0 text-xs gap-1"
              >
                {loading ? <Loader2Icon className="size-3.5 animate-spin" /> : "Refresh Link"}
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Leave blank to create a generic faculty link anyone with your domain can use.
            </p>
          </form>

          {/* Information Notice */}
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-purple-700 dark:text-purple-300">
              <SparklesIcon className="size-4" />
              <span>Frictionless Google & Microsoft SSO Onboarding</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              When faculty click your invite link, they will see an instant welcome preview. Signing in via Google or Microsoft SSO automatically provisions their account and enrolls them into <strong>{organizationName}</strong> with immediate access to shared credits.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="outline" className="border-purple-500/30 text-[10px] text-purple-600 dark:text-purple-300">
                Auto Domain Enforced
              </Badge>
              <Badge variant="outline" className="border-purple-500/30 text-[10px] text-purple-600 dark:text-purple-300">
                Zero Password Hassle
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
