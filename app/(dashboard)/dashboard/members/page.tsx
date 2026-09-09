"use client";

import { useState } from "react";
import {
  UsersIcon,
  CopyIcon,
  CheckIcon,
  UserPlusIcon,
  Building2Icon,
  SearchIcon,
  ShieldCheckIcon,
  MailIcon,
  CheckCircle2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface MemberItem {
  id: string;
  name: string;
  email: string;
  department: string;
  role: "InstitutionAdmin" | "Lecturer";
  status: "Active" | "Pending";
  joinedDate: string;
}

const mockMembers: MemberItem[] = [
  {
    id: "mem-1",
    name: "Dr. Jane Doe",
    email: "j.doe@unilag.edu.ng",
    department: "Physics & Astronomy",
    role: "InstitutionAdmin",
    status: "Active",
    joinedDate: "2026-09-01",
  },
  {
    id: "mem-2",
    name: "Prof. Olumide Falase",
    email: "o.falase@unilag.edu.ng",
    department: "Computer Sciences",
    role: "Lecturer",
    status: "Active",
    joinedDate: "2026-09-03",
  },
  {
    id: "mem-3",
    name: "Engr. Fatima Bello",
    email: "f.bello@unilag.edu.ng",
    department: "Electrical Engineering",
    role: "Lecturer",
    status: "Active",
    joinedDate: "2026-09-05",
  },
];

import Link from "next/link";
import { isAdminUser } from "@/lib/api/types/auth";

export default function MembersPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = isAdminUser(user);

  const [members] = useState<MemberItem[]>(mockMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 min-h-[50vh]">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
          <ShieldCheckIcon className="size-8" />
        </div>
        <div className="space-y-1 max-w-md">
          <h2 className="font-heading text-xl font-bold">Access Restricted</h2>
          <p className="text-sm text-muted-foreground">
            Organization member directory and Faculty Access Code management is restricted to school administrators.
          </p>
        </div>
        <Button render={<Link href="/dashboard" />}>Return to Overview</Button>
      </div>
    );
  }


  const accessCode = user?.facultyAccessCode || "FAC-UNILAG-8F21";
  const institutionName = user?.institutionName || "University of Lagos Workspace";

  function handleCopyAccessCode() {
    navigator.clipboard.writeText(accessCode);
    setCopied(true);
    toast.success("Faculty Access Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 border-sky-500/30 text-sky-600 dark:text-sky-400">
              <Building2Icon className="size-3.5" /> Organization Member Directory
            </Badge>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight mt-1">Organization Members</h1>
          <p className="text-sm text-muted-foreground">
            Manage enrolled faculty members, department lecturers, and staff onboarding access codes for {institutionName}.
          </p>
        </div>

        <Button className="gap-2">
          <UserPlusIcon className="size-4" /> Invite Faculty Member
        </Button>
      </div>

      {/* Faculty Access Code Highlight Card */}
      <Card className="border-sky-500/30 bg-gradient-to-r from-sky-50/50 via-background to-blue-50/50 dark:from-sky-950/30 dark:to-blue-950/30">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-xs font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider">
              School Faculty Access Code
            </p>
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-extrabold text-sky-600 dark:text-sky-400 tracking-wider">
                {accessCode}
              </span>
              <Button size="xs" variant="outline" onClick={handleCopyAccessCode} className="gap-1.5 border-sky-300">
                {copied ? <CheckIcon className="size-3.5 text-emerald-500" /> : <CopyIcon className="size-3.5 text-sky-600" />}
                {copied ? "Copied" : "Copy Code"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground max-w-xl">
              Share this code with lecturers and department heads in your school. During registration, entering this code automatically links them to your organization workspace.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Members Directory Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">Enrolled Members ({filteredMembers.length})</CardTitle>
            <CardDescription className="text-xs">
              List of faculty staff registered under {institutionName}.
            </CardDescription>
          </div>

          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search member, email, dept..."
              className="pl-8 text-xs h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="p-3">Member Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredMembers.map((mem) => (
                  <tr key={mem.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-semibold text-foreground">
                      <div>{mem.name}</div>
                      <div className="text-[10px] text-muted-foreground font-normal">{mem.email}</div>
                    </td>
                    <td className="p-3 text-muted-foreground font-medium">{mem.department}</td>
                    <td className="p-3">
                      {mem.role === "InstitutionAdmin" ? (
                        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30">
                          Institution Admin
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Lecturer</Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                        <CheckCircle2Icon className="size-3" /> Active
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">{mem.joinedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
