"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MenuIcon,
  SparklesIcon,
  UserIcon,
  LogOutIcon,
  Building2Icon,
  CreditCardIcon,
  ChevronDownIcon,
  CheckIcon,
  PlusIcon,
  GiftIcon,
  KeyRoundIcon,
} from "lucide-react";

import { useAuthStore } from "@/stores/auth-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { useLogout } from "@/hooks/use-auth";
import { isAdminUser } from "@/lib/api/types/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";
import { JoinWorkspaceModal } from "@/components/dashboard/join-workspace-modal";
import { getCurrentUserProfile } from "@/lib/api/services/users";

interface DashboardHeaderProps {
  onOpenMobileSidebar: () => void;
}

const pageTitles = {
  "/dashboard": { title: "", subtitle: "" },
  "/dashboard/library": { title: "System Library", subtitle: "Upload & manage lecture materials for AI question generation." },
  "/dashboard/question-bank": { title: "Questionbank", subtitle: "Generate AI multiple choice, true/false, and short answer questions." },
  "/dashboard/results": { title: "Result Station", subtitle: "Extract assessment result reports and view student analytics." },
  "/dashboard/billing": { title: "Quota Topup / Payments", subtitle: "Manage your credit balance and payment packages." },
  "/dashboard/profile": { title: "User Profile", subtitle: "Manage your personal information and workspace credentials." },
  "/dashboard/members": { title: "Organization Members", subtitle: "Manage faculty staff access and school access codes." },
  "/dashboard/setup": { title: "Organization Setup", subtitle: "Configure institution settings, domain mapping, and defaults." },
} satisfies Record<string, { title: string; subtitle: string }>;

export function DashboardHeader({ onOpenMobileSidebar }: DashboardHeaderProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const setRemainingQuota = useAuthStore((s) => s.setRemainingQuota);
  const handleLogout = useLogout();

  // Workspace Switcher State
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const setActiveWorkspace = useWorkspaceStore((s) => s.setActiveWorkspace);
  const fetchWorkspaces = useWorkspaceStore((s) => s.fetchWorkspaces);
  const getActiveWorkspace = useWorkspaceStore((s) => s.getActiveWorkspace);

  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const [workspaceModalTab, setWorkspaceModalTab] = useState<"create" | "join">("create");

  useEffect(() => {
    async function syncRemainingQuota() {
      try {
        const profile = await getCurrentUserProfile();
        if (profile && profile.remainingQuota !== undefined && Number.isFinite(profile.remainingQuota)) {
          setRemainingQuota(profile.remainingQuota);
        }
      } catch {
        // Fallback to existing store state if offline/network error
      }
    }
    syncRemainingQuota();
  }, [setRemainingQuota]);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const activeWorkspace = getActiveWorkspace();
  const isPersonal = activeWorkspace?.isPersonal ?? true;
  const activeCredits = activeWorkspace?.credits ?? (user?.remainingQuota ?? 1500);

  // SAFETY: pathname is a validated dashboard route string, fallback to empty covers unknown routes
  const currentPage = pageTitles[pathname as keyof typeof pageTitles] || { title: "", subtitle: "" };

  const isSuperAdmin = user?.role === "SystemAdmin" || user?.email?.toLowerCase() === "neotroltd@gmail.com";
  const isAdmin = isAdminUser(user) || isSuperAdmin;
  const isOrganization = user?.accountType === 2 || !!user?.institutionName || isSuperAdmin;

  const pageTitle = pathname === "/dashboard/billing" && isAdmin
    ? "Pricing & Packages Setup"
    : currentPage.title;
  const pageSubtitle = pathname === "/dashboard/billing" && isAdmin
    ? "Configure generation packages, quotas, and pricing for your institution."
    : currentPage.subtitle;

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "LE";

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border/80 bg-background/85 px-4 backdrop-blur md:px-6">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={onOpenMobileSidebar}
            aria-label="Open Navigation Menu"
          >
            <MenuIcon className="size-5" />
          </Button>
          {pageTitle ? (
            <div className="flex flex-col">
              <h1 className="font-heading text-base font-bold tracking-tight text-foreground md:text-lg">
                {pageTitle}
              </h1>
              {pageSubtitle && (
                <p className="hidden text-xs text-muted-foreground sm:block">
                  {pageSubtitle}
                </p>
              )}
            </div>
          ) : null}
        </div>

        {/* Right: Workspace Switcher & User Profile Dropdown */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <ModeToggle />

          {/* Interactive Workspace Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setWorkspaceDropdownOpen((v) => !v)}
              className={`flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs transition-all focus:outline-hidden ${
                isPersonal
                  ? "border-[#80802B]/30 bg-[#80802B]/10 hover:bg-[#80802B]/20 text-[#80802B] dark:border-[#8FB373]/30 dark:bg-[#8FB373]/10 dark:text-[#8FB373]"
                  : "border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/15 text-blue-600 dark:text-blue-400"
              }`}
              aria-label="Switch active workspace"
            >
              {isPersonal ? (
                <div className="flex items-center gap-1.5">
                  <UserIcon className="size-3.5 opacity-80" />
                  <span className="font-medium hidden sm:inline">Personal</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 max-w-[130px] truncate">
                  <Building2Icon className="size-3.5 shrink-0 opacity-80" />
                  <span className="font-semibold truncate">{activeWorkspace?.name || "Department"}</span>
                </div>
              )}

              <span className="opacity-40">|</span>

              <div className="flex items-center gap-1">
                <SparklesIcon className="size-3.5 fill-current animate-pulse shrink-0" />
                <span className="font-bold">{activeCredits.toLocaleString()}</span>
                <span className="text-[10px] uppercase font-semibold opacity-80 hidden md:inline">
                  {isPersonal ? "Credits" : "Shared"}
                </span>
              </div>

              <ChevronDownIcon className="size-3 opacity-60 ml-0.5" />
            </button>

            {/* Workspace Switcher Menu */}
            {workspaceDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setWorkspaceDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 z-50 w-72 rounded-2xl border border-border bg-card p-2 text-card-foreground shadow-2xl animate-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-border/60">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Active Workspace Context
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Deductions apply to your currently active account.
                    </p>
                  </div>

                  {/* Workspaces List */}
                  <div className="py-1.5 space-y-1">
                    {workspaces.map((ws) => {
                      const isSelected = ws.id === activeWorkspaceId || (ws.isPersonal && activeWorkspaceId === "personal");
                      return (
                        <button
                          key={ws.id}
                          onClick={() => {
                            setActiveWorkspace(ws.id);
                            setWorkspaceDropdownOpen(false);
                          }}
                          className={`flex w-full items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-left transition-colors ${
                            isSelected
                              ? "bg-primary/10 text-primary font-semibold"
                              : "hover:bg-muted text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`flex size-7 items-center justify-center rounded-lg ${
                              ws.isPersonal ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            }`}>
                              {ws.isPersonal ? <UserIcon className="size-4" /> : <Building2Icon className="size-4" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate leading-tight">{ws.name}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {ws.credits.toLocaleString()} {ws.isPersonal ? "personal" : "shared"} credits
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {!ws.isPersonal && (
                              <Badge variant="outline" className="text-[9px] px-1 py-0 font-medium">
                                {ws.role}
                              </Badge>
                            )}
                            {isSelected && <CheckIcon className="size-4 text-primary" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-2 border-t border-border/60 space-y-1">
                    <button
                      onClick={() => {
                        setWorkspaceDropdownOpen(false);
                        setWorkspaceModalTab("create");
                        setWorkspaceModalOpen(true);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors text-left"
                    >
                      <PlusIcon className="size-4 text-primary shrink-0" />
                      <div>
                        <span className="block leading-tight font-semibold">Create Department Workspace</span>
                        <span className="text-[10px] text-muted-foreground font-normal">Start a shared credit pool as Admin</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setWorkspaceDropdownOpen(false);
                        setWorkspaceModalTab("join");
                        setWorkspaceModalOpen(true);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left"
                    >
                      <KeyRoundIcon className="size-4 shrink-0" />
                      <span>Join with Workspace Code</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-border p-1 hover:bg-muted transition-colors focus:outline-hidden"
              aria-label="User account menu"
            >
              {user?.profileImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.profileImageUrl}
                  alt={user.fullName || "User Avatar"}
                  className="size-8 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="flex size-8 items-center justify-center rounded-full bg-[#38492A] text-white text-xs font-bold shadow-2xs dark:bg-[#8FB373] dark:text-[#11160E]">
                  {initials}
                </div>
              )}
              <div className="hidden text-left md:flex md:flex-col pr-1">
                <span className="truncate text-xs font-semibold text-foreground max-w-[120px]">
                  {user?.fullName || "Educator"}
                </span>
                <span className="truncate text-[10px] text-muted-foreground font-medium">
                  {isSuperAdmin ? "Super Admin" : isAdmin ? "Admin" : "Lecturer"}
                </span>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 z-50 w-56 rounded-xl border border-border bg-card p-2 text-card-foreground shadow-xl animate-in zoom-in-95">
                  <div className="px-2 py-2 border-b border-border/60">
                    <p className="text-xs font-bold text-foreground truncate">{user?.fullName || "Educator"}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                    <div className="mt-1 flex items-center gap-1">
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-medium bg-[#38492A]/10 text-[#38492A] dark:bg-[#8FB373]/20 dark:text-[#8FB373] border-[#38492A]/20">
                        {isSuperAdmin ? "Super Admin Workspace" : isOrganization ? (user?.institutionName || "Organization") : "Individual Lecturer"}
                      </Badge>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <UserIcon className="size-4 text-muted-foreground" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/dashboard/profile?tab=referrals"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-[#38492A] dark:text-[#8FB373] hover:bg-[#38492A]/10 dark:hover:bg-[#8FB373]/15 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <GiftIcon className="size-4 text-[#38492A] dark:text-[#8FB373]" />
                        <span>Refer & Earn Credits</span>
                      </div>
                      <Badge className="bg-[#38492A]/15 text-[#38492A] dark:bg-[#8FB373]/25 dark:text-[#8FB373] text-[10px] px-1.5 py-0 border-none font-mono">
                        +200
                      </Badge>
                    </Link>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setWorkspaceModalTab("create");
                        setWorkspaceModalOpen(true);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors text-left"
                    >
                      <PlusIcon className="size-4 text-primary shrink-0" />
                      <span>Create Department</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setWorkspaceModalTab("join");
                        setWorkspaceModalOpen(true);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors text-left"
                    >
                      <Building2Icon className="size-4 text-muted-foreground shrink-0" />
                      <span>Join Department</span>
                    </button>

                    {isAdmin && (
                      <>
                        <Link
                          href="/dashboard/billing"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          <CreditCardIcon className="size-4 text-muted-foreground" />
                          <span>Quota Topup & Billing</span>
                        </Link>

                        <Link
                          href="/dashboard/setup"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          <Building2Icon className="size-4 text-muted-foreground" />
                          <span>Organization Setup</span>
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="pt-1 border-t border-border/60">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOutIcon className="size-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Manual Join / Create Workspace Modal */}
      <JoinWorkspaceModal
        open={workspaceModalOpen}
        onOpenChange={setWorkspaceModalOpen}
        initialTab={workspaceModalTab}
      />
    </>
  );
}
