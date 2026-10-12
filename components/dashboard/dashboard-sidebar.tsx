"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  LibraryIcon,
  HelpCircleIcon,
  BarChart3Icon,
  CreditCardIcon,
  UsersIcon,
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
  const isSuperAdmin = user?.role === "SystemAdmin" || user?.email?.toLowerCase() === "neotroltd@gmail.com";
  const isAdmin = isAdminUser(user) || isSuperAdmin;
  const isOrganization = user?.accountType === 2 || !!user?.institutionName || isSuperAdmin;

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
      title: "System Library",
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
      title: isAdmin ? "Pricing & Packages" : "Quota Topup / Payments",
      href: "/dashboard/billing",
      icon: CreditCardIcon,
      description: isAdmin ? "Configure tiers & prices" : "Credit packages & billing",
    },
  ];

  const adminNavItems: NavItem[] = [
    {
      title: "Membership",
      href: "/dashboard/members",
      icon: UsersIcon,
      description: "Members, credits used & questions",
    },
  ];

  const allNavItems = [...coreNavItems, ...(isAdmin ? adminNavItems : [])];

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <div className="flex h-full flex-col bg-card text-card-foreground border-r border-border/80">
      {/* Signature São Tomé Organic Palette Top Ribbon */}
      <div className="grid h-[3px] w-full grid-cols-4 shrink-0">
        <div className="bg-[#38492A]" />
        <div className="bg-[#80802B]" />
        <div className="bg-[#6D8382]" />
        <div className="bg-[#A0795C]" />
      </div>

      {/* Top Header & Brand Logo */}
      <div className="flex items-center justify-between p-4 border-b border-border/60 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-heading text-lg font-bold tracking-tight">
          <div className="relative flex size-9 items-center justify-center overflow-hidden rounded-xl bg-[#FAF9F5] p-1 shadow-xs ring-1 ring-[#38492A]/15 dark:bg-[#182015] dark:ring-[#8FB373]/25">
            <Image src="/logo-icon.png" alt="Lecturra Logo" width={30} height={30} className="object-contain" priority />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-foreground">Lecturra</span>
            <span className="text-[10px] font-normal text-muted-foreground">Question Bank Engine</span>
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

      {/* Main Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto py-2">
        {/* Workspace Identity Pill */}
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2.5 rounded-xl border border-[#38492A]/15 bg-[#38492A]/5 p-2.5 dark:border-[#8FB373]/20 dark:bg-[#8FB373]/5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#38492A]/10 text-[#38492A] shrink-0 dark:bg-[#8FB373]/20 dark:text-[#8FB373]">
              {isOrganization ? <Building2Icon className="size-4" /> : <SparklesIcon className="size-4" />}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="truncate text-xs font-semibold text-foreground">
                {isSuperAdmin ? "System Admin Workspace" : isOrganization ? (user?.institutionName || "School Workspace") : (user?.fullName ? `${user.fullName}'s Workspace` : "Lecturer Workspace")}
              </span>
              <div className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-[#80802B]" />
                <span className="text-[10px] text-muted-foreground font-medium">
                  {isSuperAdmin ? "Super Admin" : isAdmin ? "Institution Admin" : "Lecturer Workspace"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="px-3 space-y-1">
          {allNavItems.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen?.(false)}
                className={`group relative flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  active
                    ? "bg-[#38492A] text-white shadow-xs font-semibold dark:bg-[#8FB373] dark:text-[#11160E]"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`size-4 shrink-0 transition-transform group-hover:scale-105 ${active ? "text-white dark:text-[#11160E]" : "text-muted-foreground group-hover:text-foreground"}`} />
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
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-border/60 shrink-0 mt-auto">
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
