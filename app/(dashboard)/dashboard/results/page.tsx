"use client";

import { useState } from "react";
import {
  BarChart3Icon,
  FileDownIcon,
  SearchIcon,
  GraduationCapIcon,
  CheckCircle2Icon,
  XCircleIcon,
  FilterIcon,
  CalendarIcon,
  AwardIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ResultRow {
  id: string;
  studentName: string;
  matricNumber: string;
  studentEmail: string;
  assessmentTitle: string;
  courseCode: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  submittedAt: string;
  status: "Passed" | "Failed";
}

const mockResults: ResultRow[] = [
  {
    id: "sub-01",
    studentName: "Adewale Taiwo",
    matricNumber: "190407012",
    studentEmail: "t.adewale@unilag.edu.ng",
    assessmentTitle: "PHY 301 Mid-Semester CBT Exam",
    courseCode: "PHY 301",
    totalScore: 42,
    maxScore: 50,
    percentage: 84.0,
    submittedAt: "2026-09-08 16:30",
    status: "Passed",
  },
  {
    id: "sub-02",
    studentName: "Oluwaseun Bakare",
    matricNumber: "190407045",
    studentEmail: "o.bakare@unilag.edu.ng",
    assessmentTitle: "PHY 301 Mid-Semester CBT Exam",
    courseCode: "PHY 301",
    totalScore: 38,
    maxScore: 50,
    percentage: 76.0,
    submittedAt: "2026-09-08 16:45",
    status: "Passed",
  },
  {
    id: "sub-03",
    studentName: "Chinedu Okonkwo",
    matricNumber: "190407089",
    studentEmail: "c.okonkwo@unilag.edu.ng",
    assessmentTitle: "CSC 201 Operating Systems Test",
    courseCode: "CSC 201",
    totalScore: 21,
    maxScore: 50,
    percentage: 42.0,
    submittedAt: "2026-09-07 11:20",
    status: "Failed",
  },
];

export default function ResultStationPage() {
  const [results] = useState<ResultRow[]>(mockResults);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All");

  const filteredResults = results.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.matricNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.assessmentTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse === "All" || r.courseCode === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  function exportResultCsv() {
    const headers = "Student Name,Matric Number,Email,Course,Assessment,Score,Max Score,Percentage,Status,Submitted At\n";
    const rows = filteredResults
      .map(
        (r) =>
          `"${r.studentName}","${r.matricNumber}","${r.studentEmail}","${r.courseCode}","${r.assessmentTitle}",${r.totalScore},${r.maxScore},${r.percentage}%,"${r.status}","${r.submittedAt}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Lectura_Test_Results_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
  }

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              <BarChart3Icon className="size-3.5" /> Assessment Analytics Engine
            </Badge>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight mt-1">Result Station</h1>
          <p className="text-sm text-muted-foreground">
            Extract test result reports, view student assessment scores, and export spreadsheet reports.
          </p>
        </div>

        <Button onClick={exportResultCsv} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
          <FileDownIcon className="size-4" /> Export CSV Report
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-emerald-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Total Submissions</CardTitle>
            <GraduationCapIcon className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{results.length}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Recorded across all tests</p>
          </CardContent>
        </Card>

        <Card className="border-sky-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Class Pass Rate</CardTitle>
            <AwardIcon className="size-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">66.7%</div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Passing score threshold: 50%</p>
          </CardContent>
        </Card>

        <Card className="border-indigo-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Average Class Score</CardTitle>
            <BarChart3Icon className="size-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">67.3%</div>
            <p className="text-[11px] text-muted-foreground mt-1">Mean performance index</p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Highest Score</CardTitle>
            <CheckCircle2Icon className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">42 / 50</div>
            <p className="text-[11px] text-muted-foreground mt-1">84.0% Top mark</p>
          </CardContent>
        </Card>
      </div>

      {/* Result Submissions Table Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">Student Test Submissions ({filteredResults.length})</CardTitle>
            <CardDescription className="text-xs">
              Extracted results from completed online and CBT assessments.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              className="h-9 rounded-lg border border-input bg-background px-3 text-xs outline-none"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="All">All Courses</option>
              <option value="PHY 301">PHY 301</option>
              <option value="CSC 201">CSC 201</option>
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
                {filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      No result records found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((row) => (
                    <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-semibold text-foreground">
                        <div>{row.studentName}</div>
                        <div className="text-[10px] text-muted-foreground font-normal">{row.studentEmail}</div>
                      </td>
                      <td className="p-3 font-mono font-medium">{row.matricNumber}</td>
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
                        <span className={row.percentage >= 50 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}>
                          {row.percentage}%
                        </span>
                      </td>
                      <td className="p-3">
                        {row.status === "Passed" ? (
                          <Badge className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                            <CheckCircle2Icon className="size-3" /> Passed
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <XCircleIcon className="size-3" /> Failed
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 text-muted-foreground">{row.submittedAt}</td>
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
