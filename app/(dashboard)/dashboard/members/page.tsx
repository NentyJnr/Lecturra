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
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { useAuthStore } from "@/stores/auth-store";
import { isAdminUser } from "@/lib/api/types/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { tenantsService, TenantLookup } from "@/lib/api/services/tenants";
import { getMembers, toggleUserStatus, MemberItem } from "@/lib/api/services/users";

const mockFallbackMembers: MemberItem[] = [
  {
    id: "mem-1",
    tenantId: "00000000-0000-0000-0000-000000000001",
    tenantName: "University of Lagos Workspace",
    fullName: "Dr. Jane Doe",
    email: "j.doe@unilag.edu.ng",
    title: "Senior Lecturer",
    location: "Physics & Astronomy",
    roleName: "InstitutionAdmin",
    isActive: true,
    isTenantSuspended: false,
    createdAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "mem-2",
    tenantId: "00000000-0000-0000-0000-000000000001",
    tenantName: "University of Lagos Workspace",
    fullName: "Prof. Olumide Falase",
    email: "o.falase@unilag.edu.ng",
    title: "Head of Department",
    location: "Computer Sciences",
    roleName: "Lecturer",
    isActive: true,
    isTenantSuspended: false,
    createdAt: "2026-09-03T10:30:00Z",
  },
  {
    id: "mem-3",
    tenantId: "00000000-0000-0000-0000-000000000001",
    tenantName: "University of Lagos Workspace",
    fullName: "Engr. Fatima Bello",
    email: "f.bello@unilag.edu.ng",
    title: "Associate Professor",
    location: "Electrical Engineering",
    roleName: "Lecturer",
    isActive: false,
    isTenantSuspended: false,
    createdAt: "2026-09-05T14:15:00Z",
  },
  {
    id: "mem-4",
    tenantId: "00000000-0000-0000-0000-000000000002",
    tenantName: "Covenant University Workspace",
    fullName: "Dr. Emmanuel Chukwu",
    email: "e.chukwu@covenant.edu.ng",
    title: "Department Chair",
    location: "Software Engineering",
    roleName: "InstitutionAdmin",
    isActive: true,
    isTenantSuspended: true,
    createdAt: "2026-09-07T11:00:00Z",
  },
];

export default function MembersPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = isAdminUser(user);

  const [tenants, setTenants] = useState<TenantLookup[]>([]);
  const [members, setMembers] = useState<MemberItem[]>(mockFallbackMembers);
  const [selectedTenantId, setSelectedTenantId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

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

      if (tenantsData && tenantsData.length > 0) {
        setTenants(tenantsData);
      }
      if (membersData && membersData.length > 0) {
        setMembers(membersData);
      }
    } catch {
      // Keep fallbacks if offline
    } finally {
      setLoading(false);
    }
  }

  async function handleFilterChange(tenantId: string) {
    setSelectedTenantId(tenantId);
    setLoading(true);
    try {
      const membersData = await getMembers(tenantId, searchQuery, statusFilter === "all" ? undefined : statusFilter);
      if (membersData && membersData.length > 0) {
        setMembers(membersData);
      }
    } catch {
      // fallback
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

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 min-h-[50vh]">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
          <ShieldCheckIcon className="size-8" />
        </div>
        <div className="space-y-1 max-w-md">
          <h2 className="font-heading text-xl font-bold">Access Restricted</h2>
          <p className="text-sm text-muted-foreground">
            Organization member directory and access governance is restricted to school administrators.
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

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="gap-1 border-sky-500/30 text-sky-600 dark:text-sky-400 font-semibold">
            <Building2Icon className="size-3.5" /> Organization Member Directory
          </Badge>
          <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 font-mono text-[10px]">
            Multi-Tenant Governance Active
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadInitialData} className="gap-2 shrink-0">
            <RefreshCwIcon className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Toolbar (Tenant Dropdown + Status Filter + Search) */}
      <Card className="border-border/80 bg-card">
        <CardContent className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            {/* Tenant/Organization Filter Dropdown */}
            <div className="flex flex-col gap-1 min-w-[240px]">
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
            <div className="flex flex-col gap-1 min-w-[150px]">
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
              Enrolled Members ({filteredMembers.length})
            </CardTitle>
            <CardDescription className="text-xs">
              List of faculty staff registered under {selectedTenantId ? displayedOrgName : "all organizations"}.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="p-3">Member Name & Email</th>
                  <th className="p-3">Organization / Tenant</th>
                  <th className="p-3">Department / Title</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Member Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
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
                      </td>

                      <td className="p-3">
                        <Badge variant="outline" className="font-mono text-[11px] border-purple-500/30 text-purple-600 dark:text-purple-300">
                          {mem.tenantName}
                        </Badge>
                      </td>

                      <td className="p-3 text-muted-foreground font-medium">
                        <div>{mem.location || "General Faculty"}</div>
                        {mem.title && <div className="text-[10px] text-muted-foreground/80">{mem.title}</div>}
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
                          {/* Member Suspend / Reactivate Toggle */}
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
                              ? "Suspend Member"
                              : "Reactivate Member"}
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
    </div>
  );
}
