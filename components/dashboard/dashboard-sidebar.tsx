"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  LibraryIcon,
  HelpCircleIcon,
  BarChart3Icon,
  CreditCardIcon,
  UserIcon,
  UsersIcon,
  SettingsIcon,
  GraduationCapIcon,
  LogOutIcon,
  Building2Icon,
  SparklesIcon,
  ChevronRightIcon,
  XIcon,
} from "lucide-react";

import { useAuthStore } from "@/stores/auth-store";
import { useLogout } from "@/hooks/use-auth";
import { isAdminUser } from "@/lib/api/types/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DashboardSidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export function DashboardSidebar({ mobileOpen, setMobileOpen }: DashboardSidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const handleLogout = useLogout();

  // Determine role and account type from auth store
  const isOrganization = user?.accountType === 2 || !!user?.institutionName;
  const isAdmin = isAdminUser(user);


  interface NavItem {
    title: string;
    href: string;
    icon: any;
    exact?: boolean;
    description?: string;
    badge?: string;
  }

  const coreNavItems: NavItem[] = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: LayoutDashboardIcon,
      exact: true,
    },
    {
      title: "The Library",
      href: "/dashboard/library",
      icon: LibraryIcon,
      description: "Upload lecture materials",
    },
    {
      title: "Questionbank",
      href: "/dashboard/question-bank",
      icon: HelpCircleIcon,
      description: "Generate & assemble questions",
    },
    {
      title: "Result Station",
      href: "/dashboard/results",
      icon: BarChart3Icon,
      description: "Extract test result reports",
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: UserIcon,
    },
  ];

  const adminNavItems: NavItem[] = [
    {
      title: "Quota Topup / Payments",
      href: "/dashboard/billing",
      icon: CreditCardIcon,
      badge: "1,500 Cr",
    },
    {
      title: "Members",
      href: "/dashboard/members",
      icon: UsersIcon,
      description: "Organization staff & access code",
    },
    {
      title: "Setup",
      href: "/dashboard/setup",
      icon: SettingsIcon,
      description: "Organization settings & domain mapping",
    },
  ];



  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-card text-card-foreground border-r border-border/80">
      {/* Top Header & Brand Logo */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-border/60">
          <Link href="/dashboard" className="flex items-center gap-2.5 font-heading text-lg font-bold tracking-tight">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <GraduationCapIcon className="size-5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-foreground">Lectura</span>
              <span className="text-[10px] font-normal text-muted-foreground">Academic AI Platform</span>
            </div>
          </Link>
          {setMobileOpen && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="Close Sidebar"
            >
              <XIcon className="size-4" />
            </Button>
          )}
        </div>

        {/* Workspace Identity Pill */}
        <div className="p-3">
          <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/40 p-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              {isOrganization ? <Building2Icon className="size-4" /> : <SparklesIcon className="size-4" />}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="truncate text-xs font-semibold text-foreground">
                {isOrganization ? (user?.institutionName || "School Workspace") : (user?.fullName ? `${user.fullName}'s Workspace` : "Lecturer Workspace")}
              </span>
              <div className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-muted-foreground font-medium">
                  {isAdmin ? "Institution Admin" : "Lecturer Workspace"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="px-3 py-2 space-y-6 overflow-y-auto max-h-[calc(100vh-220px)]">
          {/* Core Feature Section */}
          <div className="space-y-1">
            <p className="px-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Core Platform
            </p>
            {coreNavItems.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen?.(false)}
                  className={`group relative flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`size-4 shrink-0 transition-transform group-hover:scale-105 ${active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
                    <span className="truncate">{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                      {item.badge}
                    </span>
                  )}
                  {active && <ChevronRightIcon className="size-3.5 shrink-0 opacity-70" />}
                </Link>
              );
            })}
          </div>



          {/* Admin Section - Rendered if logged in as Admin */}
          {isAdmin && (
            <div className="space-y-1">
              <p className="px-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Administration
              </p>
              {adminNavItems.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen?.(false)}
                    className={`group relative flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                      active
                        ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`size-4 shrink-0 transition-transform group-hover:scale-105 ${active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
                      <span className="truncate">{item.title}</span>
                    </div>
                    {active && <ChevronRightIcon className="size-3.5 shrink-0 opacity-70" />}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-border/60">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <div className="flex items-center gap-2">
            <LogOutIcon className="size-4 shrink-0" />
            <span>Sign Out</span>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen?.(false)}
          />
          <aside className="relative z-10 w-72 max-w-[85vw] flex-col flex h-full shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
