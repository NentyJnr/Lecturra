"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MenuIcon,
  SparklesIcon,
  UserIcon,
  LogOutIcon,
  Building2Icon,
  CreditCardIcon,
} from "lucide-react";

import { useAuthStore } from "@/stores/auth-store";
import { useLogout } from "@/hooks/use-auth";
import { isAdminUser } from "@/lib/api/types/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  onOpenMobileSidebar: () => void;
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "", subtitle: "" },
  "/dashboard/library": { title: "System Library", subtitle: "Upload & manage lecture materials for AI question generation." },
  "/dashboard/question-bank": { title: "Questionbank", subtitle: "Generate AI multiple choice, true/false, and short answer questions." },
  "/dashboard/results": { title: "Result Station", subtitle: "Extract assessment result reports and view student analytics." },
  "/dashboard/billing": { title: "Quota Topup / Payments", subtitle: "Manage your credit balance and payment packages." },
  "/dashboard/profile": { title: "User Profile", subtitle: "Manage your personal information and workspace credentials." },
  "/dashboard/members": { title: "Organization Members", subtitle: "Manage faculty staff access and school access codes." },
  "/dashboard/setup": { title: "Organization Setup", subtitle: "Configure institution settings, domain mapping, and defaults." },
};

import { useEffect } from "react";
import { getCurrentUserProfile } from "@/lib/api/services/users";

export function DashboardHeader({ onOpenMobileSidebar }: DashboardHeaderProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const setRemainingQuota = useAuthStore((s) => s.setRemainingQuota);
  const handleLogout = useLogout();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    async function syncRemainingQuota() {
      try {
        const profile = await getCurrentUserProfile();
        if (profile && typeof profile.remainingQuota === "number") {
          setRemainingQuota(profile.remainingQuota);
        }
      } catch {
        // Fallback to existing store state if offline/network error
      }
    }
    syncRemainingQuota();
  }, [setRemainingQuota]);

  const currentPage = pageTitles[pathname] || { title: "", subtitle: "" };

  const isOrganization = user?.accountType === 2 || !!user?.institutionName;
  const isAdmin = isAdminUser(user);
  const remainingCredits = user?.remainingQuota ?? 1500;

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "LE";

  const creditBadgeContent = (
    <Badge
      variant="outline"
      className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 hover:bg-sky-100 transition-colors"
    >
      <SparklesIcon className="size-3.5 fill-sky-500 text-sky-500 animate-pulse" />
      <span className="font-bold text-xs">{remainingCredits.toLocaleString()}</span>
      <span className="text-[10px] uppercase font-medium opacity-80 hidden sm:inline">Credits</span>
    </Badge>
  );

  return (
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
        {currentPage.title ? (
          <div className="flex flex-col">
            <h1 className="font-heading text-base font-bold tracking-tight text-foreground md:text-lg">
              {currentPage.title}
            </h1>
            {currentPage.subtitle && (
              <p className="hidden text-xs text-muted-foreground sm:block">
                {currentPage.subtitle}
              </p>
            )}
          </div>
        ) : null}
      </div>

      {/* Right: Credits Counter & User Profile Dropdown */}
      <div className="flex items-center gap-3">
        {/* Credits Counter Pill - Only visible for non-admin users/lecturers */}
        {!isAdmin && (
          <div>{creditBadgeContent}</div>
        )}

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-border p-1 hover:bg-muted transition-colors focus:outline-none"
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
              <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">
                {initials}
              </div>
            )}
            <div className="hidden text-left md:flex md:flex-col pr-1">
              <span className="truncate text-xs font-semibold text-foreground max-w-[120px]">
                {user?.fullName || "Educator"}
              </span>
              <span className="truncate text-[10px] text-muted-foreground font-medium">
                {user?.email?.toLowerCase() === "neotroltd@gmail.com" ? "Super Admin" : isAdmin ? "Admin" : "Lecturer"}
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
              <div className="absolute right-0 mt-2 z-50 w-56 rounded-xl border border-border bg-card p-2 text-card-foreground shadow-xl">
                <div className="px-2 py-2 border-b border-border/60">
                  <p className="text-xs font-bold text-foreground truncate">{user?.fullName || "Educator"}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                      {user?.email?.toLowerCase() === "neotroltd@gmail.com" ? "Super Admin Workspace" : isOrganization ? (user?.institutionName || "Organization") : "Individual Lecturer"}
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
  );
}
