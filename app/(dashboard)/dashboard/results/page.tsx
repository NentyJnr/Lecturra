"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart3Icon,
  FileDownIcon,
  SearchIcon,
  GraduationCapIcon,
  CheckCircle2Icon,
  XCircleIcon,
  AwardIcon,
  Loader2Icon,
  InboxIcon,
  ShieldCheckIcon,
  FilterIcon,
  Building2Icon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { assessmentsApi, tenantsApi, TenantLookupDto, StudentSubmissionItemDto } from "@/lib/api/services/assessments";
import { useAuthStore } from "@/stores/auth-store";

export default function ResultStationPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "SystemAdmin" || user?.role === "InstitutionAdmin" || user?.email?.toLowerCase() === "neotroltd@gmail.com";

  const [tenants, setTenants] = useState<TenantLookupDto[]>([]);
  const [selectedTenantFilter, setSelectedTenantFilter] = useState<string>("");

  const [results, setResults] = useState<StudentSubmissionItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All");

  const fetchResults = useCallback(async (filterTenantId?: string) => {
    setIsLoading(true);
    try {
      const data = await assessmentsApi.getSubmissionsReport({
        pageSize: 100,
        filterTenantId,
      });
      setResults(data?.items || []);
    } catch (err: any) {
      console.error("Error fetching submission results:", err);
      toast.error(err?.response?.data?.message || "Failed to load student submission results.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      tenantsApi.getAllTenants().then((tList) => setTenants(tList));
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchResults(selectedTenantFilter);
  }, [fetchResults, selectedTenantFilter]);

  // Extract Unique Available Course Codes
  const availableCourses = Array.from(
    new Set(results.map((r) => r.courseCode).filter(Boolean))
  );

  // Filter Logic
  const filteredResults = results.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.matricNumber && r.matricNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.assessmentTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse === "All" || r.courseCode === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  // Dynamic KPI Metrics Calculation
  const totalSubmissions = results.length;
  const passedCount = results.filter((r) => r.percentage >= 50).length;
  const passRate = totalSubmissions > 0 ? ((passedCount / totalSubmissions) * 100).toFixed(1) : "0.0";
  const avgClassScore =
    totalSubmissions > 0
      ? (results.reduce((acc, r) => acc + r.percentage, 0) / totalSubmissions).toFixed(1)
      : "0.0";

  const highestSubmission =
    results.length > 0
      ? results.reduce((max, r) => (r.percentage > max.percentage ? r : max), results[0])
      : null;

  // Export CSV Report
  function exportResultCsv() {
    if (filteredResults.length === 0) {
      toast.error("No submission records available to export!");
      return;
    }

    const headers = isAdmin
      ? "Institution / Tenant,Student Name,Matric Number,Email,Course,Assessment,Score,Max Score,Percentage,Grade,Submitted At\n"
      : "Student Name,Matric Number,Email,Course,Assessment,Score,Max Score,Percentage,Grade,Submitted At\n";

    const rows = filteredResults
      .map((r) => {
        const base = `"${r.studentName}","${r.matricNumber || "N/A"}","${r.studentEmail || "N/A"}","${r.courseCode}","${r.assessmentTitle}",${r.totalScore},${r.maxScore},${r.percentage}%,"${r.grade || (r.percentage >= 50 ? "Passed" : "Failed")}","${new Date(r.submittedAt).toLocaleString()}"`;
        return isAdmin ? `"${r.tenantName || "Lectura Workspace"}",${base}` : base;
      })
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Lectura_Test_Results_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    toast.success("CSV report downloaded successfully!");
  }

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      {isAdmin ? (
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/40">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="gap-1 border-purple-500/40 text-purple-600 dark:text-purple-400 font-semibold">
              <ShieldCheckIcon className="size-3.5" /> Platform Global Audit
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Tenant Filter Dropdown for Admin */}
            <div className="flex items-center gap-2">
              <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <FilterIcon className="size-3.5 text-purple-500" /> Filter Tenant:
              </Label>
              <select
                value={selectedTenantFilter}
                onChange={(e) => setSelectedTenantFilter(e.target.value)}
                className="h-9 rounded-lg border border-purple-500/30 bg-background px-3 text-xs outline-none focus:border-purple-500 font-medium"
              >
                <option value="">-- All Institutions & Tenants --</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.institutionName || t.email})
                  </option>
                ))}
              </select>
            </div>

            <Button onClick={exportResultCsv} disabled={results.length === 0} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
              <FileDownIcon className="size-4" /> Export CSV Report
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              <BarChart3Icon className="size-3.5" /> Assessment Analytics Engine
            </Badge>
          </div>

          <Button onClick={exportResultCsv} disabled={results.length === 0} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
            <FileDownIcon className="size-4" /> Export CSV Report
          </Button>
        </div>
      )}

      {/* Summary Dynamic KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-emerald-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Total Submissions</CardTitle>
            <GraduationCapIcon className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{totalSubmissions}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Recorded across all tests</p>
          </CardContent>
        </Card>

        <Card className="border-sky-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Class Pass Rate</CardTitle>
            <AwardIcon className="size-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{passRate}%</div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Passing score threshold: 50%</p>
          </CardContent>
        </Card>

        <Card className="border-indigo-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Average Class Score</CardTitle>
            <BarChart3Icon className="size-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{avgClassScore}%</div>
            <p className="text-[11px] text-muted-foreground mt-1">Mean performance index</p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Highest Score</CardTitle>
            <CheckCircle2Icon className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">
              {highestSubmission ? `${highestSubmission.totalScore} / ${highestSubmission.maxScore}` : "0 / 0"}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {highestSubmission ? `${highestSubmission.percentage.toFixed(1)}% Top mark` : "No submissions yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Result Submissions Table Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">Student Test Submissions ({filteredResults.length})</CardTitle>
            <CardDescription className="text-xs">
              Extracted live results from completed online and CBT assessments.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              className="h-9 rounded-lg border border-input bg-background px-3 text-xs outline-none font-medium"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="All">All Courses ({availableCourses.length})</option>
              {availableCourses.map((cCode) => (
                <option key={cCode} value={cCode}>
                  {cCode}
                </option>
              ))}
            </select>

            <div className="relative w-full sm:w-60">
              <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search student or matric..."
                className="pl-8 text-xs h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  {isAdmin && <th className="p-3">Institution / Tenant</th>}
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Matric Number</th>
                  <th className="p-3">Assessment Title</th>
                  <th className="p-3">Course</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Percentage</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={isAdmin ? 9 : 8} className="p-12 text-center">
                      <Loader2Icon className="size-6 animate-spin text-emerald-600 mx-auto mb-2" />
                      <span className="text-xs text-muted-foreground font-medium">Loading live student submissions...</span>
                    </td>
                  </tr>
                ) : filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 9 : 8} className="p-12 text-center text-muted-foreground">
                      <InboxIcon className="size-10 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="font-semibold text-foreground text-sm">No Student Submissions Recorded Yet</p>
                      <p className="text-xs mt-1">
                        {isAdmin
                          ? "No student submission records found for the selected tenant filter."
                          : "Generate shareable student links in the Questionbank and send them to your students to start gathering live results."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((row) => {
                    const isPassed = row.percentage >= 50;
                    return (
                      <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                        {isAdmin && (
                          <td className="p-3 font-medium text-foreground">
                            <div className="flex items-center gap-1.5">
                              <Building2Icon className="size-3.5 text-purple-500 shrink-0" />
                              <span className="truncate max-w-[160px] font-semibold">{row.tenantName || "Lectura Workspace"}</span>
                            </div>
                          </td>
                        )}
                        <td className="p-3 font-semibold text-foreground">
                          <div>{row.studentName}</div>
                          {row.studentEmail && (
                            <div className="text-[10px] text-muted-foreground font-normal">{row.studentEmail}</div>
                          )}
                        </td>
                        <td className="p-3 font-mono font-medium">{row.matricNumber || "N/A"}</td>
                        <td className="p-3 font-medium text-foreground">{row.assessmentTitle}</td>
                        <td className="p-3">
                          <Badge variant="secondary" className="font-mono text-[10px]">
                            {row.courseCode}
                          </Badge>
                        </td>
                        <td className="p-3 font-bold text-foreground">
                          {row.totalScore} / {row.maxScore}
                        </td>
                        <td className="p-3 font-semibold">
                          <span className={isPassed ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}>
                            {row.percentage}%
                          </span>
                        </td>
                        <td className="p-3">
                          {isPassed ? (
                            <Badge className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                              <CheckCircle2Icon className="size-3" /> {row.grade || "Passed"}
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="gap-1">
                              <XCircleIcon className="size-3" /> {row.grade || "Failed"}
                            </Badge>
                          )}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {new Date(row.submittedAt).toLocaleDateString()} {new Date(row.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
