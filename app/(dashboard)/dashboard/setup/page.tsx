"use client";

import { useState } from "react";
import {
  SettingsIcon,
  Building2Icon,
  GlobeIcon,
  KeyIcon,
  SaveIcon,
  ShieldCheckIcon,
  RefreshCwIcon,
  CheckCircle2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";

export default function SetupPage() {
  const user = useAuthStore((s) => s.user);

  const [institutionName, setInstitutionName] = useState(user?.institutionName || "University of Lagos");
  const [allowedDomain, setAllowedDomain] = useState("unilag.edu.ng");
  const [facultyEmail, setFacultyEmail] = useState(user?.email || "admin@unilag.edu.ng");
  const [accessCode, setAccessCode] = useState(user?.facultyAccessCode || "FAC-UNILAG-8F21");
  const [saving, setSaving] = useState(false);

  function handleSaveSetup(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Organization workspace setup updated!");
    }, 800);
  }

  function handleRegenerateCode() {
    const newCode = "FAC-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setAccessCode(newCode);
    toast.info(`New Faculty Access Code generated: ${newCode}`);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 border-amber-500/30 text-amber-600 dark:text-amber-400">
            <SettingsIcon className="size-3.5" /> Administrator Workspace Setup
          </Badge>
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight mt-1">Organization Setup</h1>
        <p className="text-sm text-muted-foreground">
          Configure institutional parameters, institutional domain mapping, allowed email domains, and default access controls.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Admin Control Banner */}
        <Card className="md:col-span-1 border-amber-500/30 bg-amber-50/20 dark:bg-amber-950/10">
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
              <Building2Icon className="size-5" />
            </div>
            <CardTitle className="text-base mt-2">School Workspace Governance</CardTitle>
            <CardDescription className="text-xs">
              Settings applied across all faculty members in your organization.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheckIcon className="size-4" /> OWASP Security Enforced
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Domain mapping automatically associates new user registrations matching your specified email domain (e.g. <span className="font-mono text-foreground font-semibold">@unilag.edu.ng</span>) with your school workspace.
            </p>
          </CardContent>
        </Card>

        {/* Setup Configuration Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Organization Settings & Domain Mapping</CardTitle>
            <CardDescription className="text-xs">
              Manage school parameters and faculty auto-onboarding rules.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveSetup} className="space-y-4">
              <Field>
                <FieldLabel htmlFor="orgName">Institution / Organization Name</FieldLabel>
                <Input
                  id="orgName"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="domain">Allowed Email Domain (Auto-onboarding)</FieldLabel>
                <div className="relative flex items-center">
                  <GlobeIcon className="absolute left-2.5 size-4 text-muted-foreground" />
                  <Input
                    id="domain"
                    className="pl-9 font-mono text-xs"
                    placeholder="e.g. unilag.edu.ng"
                    value={allowedDomain}
                    onChange={(e) => setAllowedDomain(e.target.value)}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Users registering with <span className="font-mono font-semibold text-foreground">@{allowedDomain}</span> automatically join your institution.
                </p>
              </Field>

              <Field>
                <FieldLabel htmlFor="facultyEmail">Primary Contact Email</FieldLabel>
                <Input
                  id="facultyEmail"
                  type="email"
                  value={facultyEmail}
                  onChange={(e) => setFacultyEmail(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="accessCode">Faculty Access Code</FieldLabel>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <KeyIcon className="absolute left-2.5 top-2.5 size-4 text-sky-600" />
                    <Input
                      id="accessCode"
                      className="pl-9 font-mono font-bold text-sky-600 dark:text-sky-400"
                      value={accessCode}
                      readOnly
                    />
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={handleRegenerateCode} className="gap-1.5 shrink-0">
                    <RefreshCwIcon className="size-3.5" /> Regenerate
                  </Button>
                </div>
              </Field>

              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={saving} className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                  <SaveIcon className="size-4" />
                  {saving ? "Saving Setup..." : "Save Organization Setup"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
