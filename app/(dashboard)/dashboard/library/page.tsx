"use client";

import { useState } from "react";
import {
  LibraryIcon,
  UploadIcon,
  FileTextIcon,
  SparklesIcon,
  SearchIcon,
  Trash2Icon,
  CheckCircle2Icon,
  ClockIcon,
  AlertCircleIcon,
  PlusIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface MaterialItem {
  id: string;
  title: string;
  courseCode: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  status: "Processed" | "Indexing" | "Failed";
  extractedQuestionsCount: number;
}

const mockMaterials: MaterialItem[] = [
  {
    id: "mat-1",
    title: "PHY 301 - Quantum Mechanics & Atomic Structure Notes.pdf",
    courseCode: "PHY 301",
    fileType: "PDF Document",
    fileSize: "4.2 MB",
    uploadedAt: "2026-09-08 14:20",
    status: "Processed",
    extractedQuestionsCount: 45,
  },
  {
    id: "mat-2",
    title: "CSC 201 - Operating Systems Scheduling Algorithms.pptx",
    courseCode: "CSC 201",
    fileType: "PowerPoint Presentation",
    fileSize: "8.1 MB",
    uploadedAt: "2026-09-07 09:15",
    status: "Processed",
    extractedQuestionsCount: 60,
  },
  {
    id: "mat-3",
    title: "ENG 101 - Academic Essay Writing Principles.docx",
    courseCode: "ENG 101",
    fileType: "Word Document",
    fileSize: "1.5 MB",
    uploadedAt: "2026-09-06 18:40",
    status: "Indexing",
    extractedQuestionsCount: 0,
  },
];

export default function LibraryPage() {
  const [materials, setMaterials] = useState<MaterialItem[]>(mockMaterials);
  const [searchQuery, setSearchQuery] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const filteredMaterials = materials.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleSimulatedUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setTimeout(() => {
      const newMat: MaterialItem = {
        id: `mat-${Date.now()}`,
        title: file.name,
        courseCode: "GEN 101",
        fileType: file.name.endsWith(".pdf")
          ? "PDF Document"
          : file.name.endsWith(".pptx")
          ? "PowerPoint"
          : "Document",
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        status: "Processed",
        extractedQuestionsCount: Math.floor(Math.random() * 30) + 15,
      };
      setMaterials([newMat, ...materials]);
      setUploading(false);
    }, 1500);
  }

  function handleDelete(id: string) {
    setMaterials(materials.filter((m) => m.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 border-sky-500/30 text-sky-600 dark:text-sky-400">
              <LibraryIcon className="size-3.5" /> Course Resource Ingestion
            </Badge>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight mt-1">The Library</h1>
          <p className="text-sm text-muted-foreground">
            Upload course notes, lecture slides, and textbooks for automated AI question bank generation.
          </p>
        </div>

        <div className="relative">
          <input
            type="file"
            id="file-upload-header"
            accept=".pdf,.pptx,.docx,.txt"
            className="hidden"
            onChange={handleSimulatedUpload}
          />
          <Button render={<label htmlFor="file-upload-header" className="cursor-pointer flex items-center gap-2" />}>
            <UploadIcon className="size-4" />
            <span>Upload New Material</span>
          </Button>
        </div>
      </div>

      {/* Upload Drag & Drop Dropzone */}
      <Card className={`border-2 border-dashed transition-all ${dragActive ? "border-primary bg-primary/5" : "border-border/80 bg-muted/20"}`}>
        <CardContent className="p-8 text-center flex flex-col items-center justify-center space-y-3">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 shadow-sm">
            <UploadIcon className="size-6 animate-bounce" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-base font-semibold">
              {uploading ? "Processing and indexing lecture material..." : "Drag and drop lecture files here"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Supported formats: <span className="font-semibold text-foreground">PDF, PPTX, DOCX, TXT</span> (Max file size: 50MB). The AI engine automatically parses chapters, topics, and definitions.
            </p>
          </div>
          <div className="pt-2">
            <input
              type="file"
              id="file-upload-dropzone"
              accept=".pdf,.pptx,.docx,.txt"
              className="hidden"
              onChange={handleSimulatedUpload}
              disabled={uploading}
            />
            <Button
              variant="outline"
              disabled={uploading}
              render={<label htmlFor="file-upload-dropzone" className="cursor-pointer" />}
            >
              {uploading ? "Parsing Document..." : "Browse Local Files"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Materials Search & List Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">Uploaded Lecture Materials ({materials.length})</CardTitle>
            <CardDescription className="text-xs">
              Manage your course materials and trigger AI question generation runs.
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search material or course code..."
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
                  <th className="p-3">Material Title</th>
                  <th className="p-3">Course Code</th>
                  <th className="p-3">File Info</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">AI Questions</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredMaterials.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No lecture materials found. Upload a file above to get started.
                    </td>
                  </tr>
                ) : (
                  filteredMaterials.map((mat) => (
                    <tr key={mat.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">
                        <div className="flex items-center gap-2.5">
                          <FileTextIcon className="size-4 shrink-0 text-sky-500" />
                          <span className="truncate max-w-[280px] font-semibold text-foreground">{mat.title}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="secondary" className="font-mono text-[10px]">
                          {mat.courseCode}
                        </Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        <div>{mat.fileType}</div>
                        <div className="text-[10px] opacity-80">{mat.fileSize} • {mat.uploadedAt}</div>
                      </td>
                      <td className="p-3">
                        {mat.status === "Processed" ? (
                          <Badge className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                            <CheckCircle2Icon className="size-3" /> Processed
                          </Badge>
                        ) : mat.status === "Indexing" ? (
                          <Badge variant="outline" className="gap-1 border-amber-500/30 text-amber-600 dark:text-amber-400 animate-pulse">
                            <ClockIcon className="size-3" /> Indexing
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircleIcon className="size-3" /> Failed
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 font-semibold text-foreground">
                        {mat.extractedQuestionsCount > 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {mat.extractedQuestionsCount} Questions
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Pending</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="xs" variant="outline" className="gap-1 text-primary border-primary/30">
                            <SparklesIcon className="size-3" /> Generate
                          </Button>
                          <Button
                            size="icon-xs"
                            variant="ghost"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(mat.id)}
                          >
                            <Trash2Icon className="size-3.5" />
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
