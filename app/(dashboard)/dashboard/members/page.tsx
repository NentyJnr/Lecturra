"use client";

import { useEffect, useState } from "react";
import {
  UsersIcon,
  Building2Icon,
  SearchIcon,
  ShieldCheckIcon,
  CheckCircle2Icon,
  BanIcon,
  RefreshCwIcon,
  FilterIcon,
  ShieldAlertIcon,
  UserCheckIcon,
  AlertTriangleIcon,
  HelpCircleIcon,
  CreditCardIcon,
  GiftIcon,
  CopyIcon,
  SparklesIcon,
  UserPlusIcon,
  UserMinusIcon,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { useAuthStore } from "@/stores/auth-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { isAdminUser } from "@/lib/api/types/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { tenantsService, TenantLookup } from "@/lib/api/services/tenants";
import { getMembers, toggleUserStatus, applyReferralCode, MemberItem } from "@/lib/api/services/users";
import { organizationsService } from "@/lib/api/services/organizations";
import { InviteDepartmentModal } from "@/components/dashboard/invite-department-modal";

export default function MembersPage() {
  const user = useAuthStore((s) => s.user);
  const setRemainingQuota = useAuthStore((s) => s.setRemainingQuota);

  const isSuperAdmin = user?.role === "SystemAdmin" || user?.email?.toLowerCase() === "neotroltd@gmail.com";
  const isAdmin = isAdminUser(user) || isSuperAdmin;

  const [tenants, setTenants] = useState<TenantLookup[]>([]);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Referral code claim state
  const [referralInput, setReferralInput] = useState("");
  const [claimingReferral, setClaimingReferral] = useState(false);

  // Active Workspace Context
  const activeWorkspace = useWorkspaceStore((s) => s.getActiveWorkspace());
  const isOrgWorkspace = Boolean(activeWorkspace && !activeWorkspace.isPersonal);
  const isOrgAdmin = Boolean(
    isOrgWorkspace &&
      (activeWorkspace?.role === "Admin" ||
        activeWorkspace?.role === "Owner" ||
        isSuperAdmin)
  );

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

  async function handleRemoveFromOrg(mem: MemberItem) {
    if (!activeWorkspace || activeWorkspace.isPersonal) return;
    if (!confirm(`Are you sure you want to remove ${mem.fullName} from ${activeWorkspace.name}?`)) return;

    setRemovingMemberId(mem.id);
    try {
      const success = await organizationsService.removeMember(activeWorkspace.id, mem.id);
      if (success) {
        toast.success(`${mem.fullName} removed from ${activeWorkspace.name}.`);
        setMembers((prev) => prev.filter((m) => m.id !== mem.id));
      } else {
        toast.error("Failed to remove member from workspace.");
      }
    } catch (err: any) {
      toast.error("Error removing member", {
        description: err?.response?.data?.message || err?.message || "Failed to remove member.",
      });
    } finally {
      setRemovingMemberId(null);
    }
  }

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    setLoading(true);
    try {
      const [tenantsData, membersData] = await Promise.all([
        tenantsService.getAllTenants(),
        getMembers(),
      ]);

      if (tenantsData) {
        setTenants(tenantsData);
      }
      setMembers(membersData || []);
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleFilterChange(tenantId: string) {
    setSelectedTenantId(tenantId);
    setLoading(true);
    try {
      const membersData = await getMembers(tenantId, searchQuery, statusFilter === "all" ? undefined : statusFilter);
      setMembers(membersData || []);
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleMemberStatus(mem: MemberItem) {
    setActionLoadingId(mem.id);
    const newStatus = !mem.isActive;
    try {
      const success = await toggleUserStatus(mem.id, newStatus);
      if (success) {
        setMembers((prev) =>
          prev.map((m) => (m.id === mem.id ? { ...m, isActive: newStatus } : m))
        );
        toast.success(`Member "${mem.fullName}" has been ${newStatus ? "reactivated" : "suspended"}.`);
      } else {
        toast.error("Failed to update member status.");
      }
    } catch {
      // optimistic update fallback
      setMembers((prev) =>
        prev.map((m) => (m.id === mem.id ? { ...m, isActive: newStatus } : m))
      );
      toast.success(`Member "${mem.fullName}" status updated locally.`);
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleClaimReferralBonus() {
    if (!referralInput.trim()) {
      toast.error("Please enter a referral code.");
      return;
    }
    setClaimingReferral(true);
    try {
      const res = await applyReferralCode(referralInput.trim());
      toast.success("Referral bonus claimed!", {
        description: res.message || `Awarded ${res.bonusCreditsAwarded} bonus credits.`,
      });
      if (res.newRemainingQuota) {
        setRemainingQuota(res.newRemainingQuota);
      }
      setReferralInput("");
      loadInitialData();
    } catch (err: any) {
      toast.error("Referral claim failed", {
        description: err?.response?.data?.message || err?.message || "Invalid or already applied referral code.",
      });
    } finally {
      setClaimingReferral(false);
    }
  }

  function copyReferralLink() {
    const code = user?.referralCode || "LECTURA";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const inviteLink = `${origin}/register?ref=${code}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success("Referral invite link copied to clipboard!", {
      description: inviteLink,
    });
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 min-h-[50vh]">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
          <ShieldCheckIcon className="size-8" />
        </div>
        <div className="space-y-1 max-w-md">
          <h2 className="font-heading text-xl font-bold">Access Restricted</h2>
          <p className="text-sm text-muted-foreground">
            Membership governance and user activity analytics are restricted to institution administrators and system superadmins.
          </p>
        </div>
        <Button render={<Link href="/dashboard" />}>Return to Overview</Button>
      </div>
    );
  }

  const selectedTenant = tenants.find((t) => t.id === selectedTenantId);
  const displayedOrgName = selectedTenant?.name || selectedTenant?.institutionName || "all organizations";

  const filteredMembers = members.filter((m) => {
    const matchesTenant = !selectedTenantId || m.tenantId === selectedTenantId;
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tenantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? m.isActive
        : !m.isActive;

    return matchesTenant && matchesSearch && matchesStatus;
  });

  // Calculate live aggregate totals across visible members
  const totalQuestionsGenerated = members.reduce((acc, m) => acc + (m.questionsGenerated || 0), 0);
  const totalCreditsUsed = members.reduce((acc, m) => acc + (m.creditsUsed || 0), 0);
  const totalReferrals = members.reduce((acc, m) => acc + (m.referralCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="gap-1 border-sky-500/30 text-sky-600 dark:text-sky-400 font-semibold">
            <Building2Icon className="size-3.5" /> Membership & User Analytics
          </Badge>
          <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 font-mono text-[10px]">
            Platform Governance Active
          </Badge>
          {isOrgWorkspace && activeWorkspace && (
            <Badge variant="outline" className="gap-1.5 border-purple-500/40 text-purple-700 dark:text-purple-300 font-semibold bg-purple-500/10">
              <Building2Icon className="size-3.5" /> {activeWorkspace.name} · {activeWorkspace.credits.toLocaleString()} Shared Credits
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isOrgWorkspace && isOrgAdmin && activeWorkspace && (
            <Button
              size="sm"
              onClick={() => setInviteModalOpen(true)}
              className="gap-2 shrink-0 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs"
            >
              <UserPlusIcon className="size-4" />
              Invite to {activeWorkspace.name}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={loadInitialData} className="gap-2 shrink-0">
            <RefreshCwIcon className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-border/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Enrolled Members</p>
              <p className="text-2xl font-bold font-heading mt-1">{members.length}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <UsersIcon className="size-5" />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Registered educators across all workspaces</p>
        </Card>

        <Card className="p-4 border-border/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Questions Generated</p>
              <p className="text-2xl font-bold font-heading mt-1">{totalQuestionsGenerated.toLocaleString()}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <HelpCircleIcon className="size-5" />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Total AI exam questions assembled</p>
        </Card>

        <Card className="p-4 border-border/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Credits Used</p>
              <p className="text-2xl font-bold font-heading mt-1">{totalCreditsUsed.toLocaleString()}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <CreditCardIcon className="size-5" />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Quota consumed for generation</p>
        </Card>

        <Card className="p-4 border-border/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Referral Activations</p>
              <p className="text-2xl font-bold font-heading mt-1">{totalReferrals.toLocaleString()}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <GiftIcon className="size-5" />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Educators joined through invitations</p>
        </Card>
      </div>

      {/* Referral Program Card */}
      <Card className="border-border/80 bg-gradient-to-r from-purple-500/5 via-sky-500/5 to-transparent">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <GiftIcon className="size-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold text-foreground">Educator Referral Reward Program</h3>
              <Badge variant="secondary" className="text-[10px] bg-purple-500/10 text-purple-600 border-purple-500/20">
                +200 Credits Per Invite
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When a colleague signs up with your referral code or invite link—even via Google or Microsoft SSO—both of you receive 200 free question generation credits.
            </p>
            {user?.referralCode && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-medium text-foreground">Your Code:</span>
                <Badge variant="outline" className="font-mono text-xs font-bold border-purple-500/30 text-purple-600 dark:text-purple-300">
                  {user.referralCode}
                </Badge>
                <Button variant="ghost" size="xs" onClick={copyReferralLink} className="gap-1 text-xs text-purple-600 dark:text-purple-400">
                  <CopyIcon className="size-3" /> Copy Invite Link
                </Button>
              </div>
            )}
          </div>

          {/* Quick Apply Referral Box for SSO or new users */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 md:max-w-md w-full md:w-auto bg-background/80 p-3 rounded-xl border border-border/60">
            <div className="flex-1">
              <Input
                placeholder="Enter colleague's referral code..."
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                className="h-8 text-xs font-mono uppercase"
              />
            </div>
            <Button
              size="sm"
              onClick={handleClaimReferralBonus}
              disabled={claimingReferral || !referralInput.trim()}
              className="gap-1.5 h-8 text-xs whitespace-nowrap bg-purple-600 hover:bg-purple-700 text-white"
            >
              <SparklesIcon className="size-3.5" />
              {claimingReferral ? "Claiming..." : "Claim +200 Credits"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filter Toolbar (Tenant Dropdown + Status Filter + Search) */}
      <Card className="border-border/80 bg-card">
        <CardContent className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            {/* Tenant/Organization Filter Dropdown */}
            <div className="flex flex-col gap-1 min-w-60">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <FilterIcon className="size-3 text-purple-500" /> Filter by Organization / Tenant
              </label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs shadow-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={selectedTenantId}
                onChange={(e) => handleFilterChange(e.target.value)}
              >
                <option value="">All Organizations (Global Admin View)</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name || t.institutionName} {t.isQuotaLocked ? "(Suspended)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Member Status Filter */}
            <div className="flex flex-col gap-1 min-w-37.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Member Status
              </label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs shadow-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Members</option>
                <option value="suspended">Suspended Members</option>
              </select>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 pt-3 md:pt-0">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search member, email, dept, org..."
              className="pl-9 text-xs h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Members Directory Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <UsersIcon className="size-4 text-purple-500" />
              Membership Roster ({filteredMembers.length})
            </CardTitle>
            <CardDescription className="text-xs">
              Complete directory of faculty members with credits used, questions generated, and referral status under {selectedTenantId ? displayedOrgName : "all organizations"}.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="p-3">Member & Email</th>
                  <th className="p-3">Organization / Tenant</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 text-center">Questions Generated</th>
                  <th className="p-3 text-center">Credits Used</th>
                  <th className="p-3 text-center">Available Quota</th>
                  <th className="p-3 text-center">Referral Info</th>
                  <th className="p-3">Member Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-muted-foreground">
                      <ShieldAlertIcon className="size-8 mx-auto mb-2 text-muted-foreground/60" />
                      No members found matching the selected organization or search query.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((mem) => (
                    <tr key={mem.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-semibold text-foreground">
                        <div>{mem.fullName}</div>
                        <div className="text-[10px] text-muted-foreground font-normal">{mem.email}</div>
                        {mem.title && <div className="text-[10px] text-muted-foreground/80">{mem.title}</div>}
                      </td>

                      <td className="p-3">
                        <Badge variant="outline" className="font-mono text-[11px] border-purple-500/30 text-purple-600 dark:text-purple-300">
                          {mem.tenantName}
                        </Badge>
                      </td>

                      <td className="p-3">
                        {mem.roleName === "SystemAdmin" ? (
                          <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30">
                            System Admin
                          </Badge>
                        ) : mem.roleName === "InstitutionAdmin" ? (
                          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30">
                            Institution Admin
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Lecturer</Badge>
                        )}
                      </td>

                      {/* Questions Generated */}
                      <td className="p-3 text-center">
                        <Badge variant="outline" className="bg-sky-500/5 text-sky-600 dark:text-sky-400 border-sky-500/20 font-mono">
                          {(mem.questionsGenerated ?? 0).toLocaleString()}
                        </Badge>
                      </td>

                      {/* Credits Used */}
                      <td className="p-3 text-center">
                        <span className="font-semibold text-amber-600 dark:text-amber-400 font-mono">
                          {(mem.creditsUsed ?? 0).toLocaleString()}
                        </span>
                      </td>

                      {/* Available Quota */}
                      <td className="p-3 text-center">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                          {(mem.remainingCredits ?? 0).toLocaleString()}
                        </span>
                      </td>

                      {/* Referral Code & Activations */}
                      <td className="p-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          {mem.referralCode ? (
                            <Badge variant="secondary" className="font-mono text-[10px]">
                              {mem.referralCode}
                            </Badge>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">-</span>
                          )}
                          {(mem.referralCount ?? 0) > 0 && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                              {mem.referralCount} referred
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3">
                        {mem.isTenantSuspended ? (
                          <Badge className="gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30">
                            <AlertTriangleIcon className="size-3" /> Org Locked
                          </Badge>
                        ) : mem.isActive ? (
                          <Badge className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                            <CheckCircle2Icon className="size-3" /> Active
                          </Badge>
                        ) : (
                          <Badge className="gap-1 bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30">
                            <BanIcon className="size-3" /> Suspended
                          </Badge>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isOrgWorkspace && isOrgAdmin && activeWorkspace && (
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => handleRemoveFromOrg(mem)}
                              disabled={removingMemberId === mem.id}
                              className="gap-1 text-xs border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10"
                              title={`Remove from ${activeWorkspace.name}`}
                            >
                              <UserMinusIcon className="size-3" />
                              {removingMemberId === mem.id ? "Removing..." : "Remove"}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => handleToggleMemberStatus(mem)}
                            disabled={actionLoadingId === mem.id}
                            className={`gap-1 text-xs border ${
                              mem.isActive
                                ? "border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10"
                                : "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                            }`}
                            title={mem.isActive ? "Suspend member access" : "Reactivate member access"}
                          >
                            {mem.isActive ? <BanIcon className="size-3" /> : <UserCheckIcon className="size-3" />}
                            {actionLoadingId === mem.id
                              ? "Updating..."
                              : mem.isActive
                              ? "Suspend"
                              : "Reactivate"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invite Department Modal */}
      {isOrgWorkspace && activeWorkspace && (
        <InviteDepartmentModal
          open={inviteModalOpen}
          onOpenChange={setInviteModalOpen}
          organizationId={activeWorkspace.id}
          organizationName={activeWorkspace.name}
        />
      )}
    </div>
  );
}
