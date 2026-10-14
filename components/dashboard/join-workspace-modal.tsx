"use client";

import { useEffect, useState } from "react";
import {
  Building2Icon,
  CheckCircle2Icon,
  KeyRoundIcon,
  Loader2Icon,
  PlusIcon,
  ShieldCheckIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { organizationsService } from "@/lib/api/services/organizations";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { getApiErrorMessage } from "@/lib/api/api-error";

export interface JoinWorkspaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: "create" | "join";
}

export function JoinWorkspaceModal({
  open,
  onOpenChange,
  initialTab = "create",
}: JoinWorkspaceModalProps) {
  const [activeTab, setActiveTab] = useState<"create" | "join">(initialTab);
  const [deptName, setDeptName] = useState("");
  const [allowedDomain, setAllowedDomain] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWorkspaces = useWorkspaceStore((s) => s.fetchWorkspaces);
  const setActiveWorkspace = useWorkspaceStore((s) => s.setActiveWorkspace);

  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);

  if (!open) return null;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const cleanName = deptName.trim();
    if (!cleanName) {
      toast.error("Please enter a department or faculty name.");
      return;
    }

    setLoading(true);
    try {
      const result = await organizationsService.createOrganization({
        name: cleanName,
        allowedDomain: allowedDomain.trim() || undefined,
        initialCredits: 5000,
      });

      toast.success("Department Workspace Created!", {
        description: `Successfully created ${result.name}. Your workspace code is ${result.inviteCode}.`,
      });

      await fetchWorkspaces();
      if (result.id) {
        setActiveWorkspace(result.id);
      }
      setDeptName("");
      setAllowedDomain("");
      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to create department workspace", {
        description: getApiErrorMessage(err),
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const clean = inviteCode.trim();
    if (!clean) {
      toast.error("Please enter a workspace code.");
      return;
    }

    setLoading(true);
    try {
      const result = await organizationsService.joinOrganization(clean);
      toast.success("Joined Workspace!", {
        description: `Successfully joined ${result.name}. You now share ${result.sharedCredits.toLocaleString()} credits.`,
      });
      await fetchWorkspaces();
      setActiveWorkspace(result.organizationId);
      setInviteCode("");
      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to join workspace", {
        description: getApiErrorMessage(err),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => !loading && onOpenChange(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95">
        <button
          onClick={() => !loading && onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted transition-colors"
          disabled={loading}
          aria-label="Close"
        >
          <XIcon className="size-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2Icon className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              {activeTab === "create"
                ? "Create Department Workspace"
                : "Join Department Workspace"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {activeTab === "create"
                ? "Start a shared credit pool and question bank for your faculty."
                : "Connect to your faculty or institution shared pool."}
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex rounded-xl bg-muted/60 p-1 mt-4 border border-border/60">
          <button
            type="button"
            onClick={() => setActiveTab("create")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "create"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <PlusIcon className="size-3.5 text-primary" />
            Create Department
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("join")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "join"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <KeyRoundIcon className="size-3.5" />
            Join with Code
          </button>
        </div>

        {/* TAB 1: CREATE DEPARTMENT */}
        {activeTab === "create" && (
          <form onSubmit={handleCreate} className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Department or Faculty Name <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. Department of Economics"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                disabled={loading}
                className="text-xs"
                autoFocus
              />
              <p className="text-[11px] text-muted-foreground">
                The official academic unit name visible to all invited lecturers.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Official Domain Restriction <span className="text-[10px] text-muted-foreground">(Optional)</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. unilag.edu.ng"
                value={allowedDomain}
                onChange={(e) => setAllowedDomain(e.target.value.toLowerCase())}
                disabled={loading}
                className="text-xs font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                Optionally restrict member joins to faculty members with this email domain.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                <ShieldCheckIcon className="size-4" />
                <span>You will become Workspace Admin</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                As creator, you will hold administrative rights to invite colleagues, manage the shared credit pool, and oversee departmental question libraries.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={loading || !deptName.trim()}
                className="gap-1.5 text-xs font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2Icon className="size-3.5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <PlusIcon className="size-3.5" />
                    Create Workspace
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* TAB 2: JOIN WITH CODE */}
        {activeTab === "join" && (
          <form onSubmit={handleJoin} className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Workspace Code <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. UNILAG-MATH-8291"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                disabled={loading}
                className="font-mono text-xs tracking-wider uppercase"
                autoFocus
              />
              <p className="text-[11px] text-muted-foreground">
                Ask your department head or faculty administrator for your workspace invitation code.
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <SparklesIcon className="size-3.5 text-primary" />
                <span>Instant Shared Credit Access</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                When you join, generated assessments can deduct directly from your department&apos;s shared balance rather than your personal account.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={loading || !inviteCode.trim()}
                className="gap-1.5 text-xs font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2Icon className="size-3.5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2Icon className="size-3.5" />
                    Join Workspace
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
