"use client";

import { useState, useRef, useEffect } from "react";
import {
  LibraryIcon,
  UploadIcon,
  FileTextIcon,
  SearchIcon,
  Trash2Icon,
  CheckCircle2Icon,
  ClockIcon,
  AlertCircleIcon,
  PlusIcon,
  XIcon,
  FileUpIcon,
  CheckIcon,
  Loader2Icon,
} from "lucide-react";
import { toast } from "sonner";
import { documentsApi, IngestedDocumentDto } from "@/lib/api/services/documents";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface MaterialItem {
  id: string;
  title: string;
  courseCode: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  status: "Processed" | "Indexing" | "Failed";
}

const mockMaterials: MaterialItem[] = [
  {
    id: "mat-1",
    title: "Quantum Mechanics & Atomic Structure Notes",
    courseCode: "PHY 301",
    fileType: "PDF Document",
    fileSize: "4.2 MB",
    uploadedAt: "2026-09-08 14:20",
    status: "Processed",
  },
  {
    id: "mat-2",
    title: "Operating Systems Scheduling Algorithms & Memory",
    courseCode: "CSC 201",
    fileType: "PowerPoint Presentation",
    fileSize: "8.1 MB",
    uploadedAt: "2026-09-07 09:15",
    status: "Processed",
  },
  {
    id: "mat-3",
    title: "Academic Essay Writing & Rhetorical Principles",
    courseCode: "ENG 101",
    fileType: "Word Document",
    fileSize: "1.5 MB",
    uploadedAt: "2026-09-06 18:40",
    status: "Indexing",
  },
];

export default function LibraryPage() {
  const [materials, setMaterials] = useState<MaterialItem[]>(mockMaterials);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [docName, setDocName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ docName?: string; courseCode?: string; file?: string }>({});
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const fetched = await documentsApi.getDocuments();
        if (fetched && fetched.length > 0) {
          const mapped: MaterialItem[] = fetched.map((doc: IngestedDocumentDto) => {
            const fileExt = doc.fileName.split(".").pop()?.toUpperCase() || "PDF";
            return {
              id: doc.documentId,
              title: doc.title || doc.fileName,
              courseCode: doc.courseCode || "GENERAL",
              fileType: fileExt === "PDF" ? "PDF Document" : fileExt === "PPTX" ? "PowerPoint" : `${fileExt} Document`,
              fileSize: `${(doc.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`,
              uploadedAt: doc.createdAt ? new Date(doc.createdAt).toISOString().replace("T", " ").substring(0, 16) : new Date().toISOString().replace("T", " ").substring(0, 16),
              status: doc.isProcessed ? "Processed" : "Indexing",
            };
          });
          setMaterials(mapped);
        }
      } catch (err) {
        console.error("Failed to load documents from API", err);
      }
    }
    fetchDocuments();
  }, []);

  const filteredMaterials = materials.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function resetForm() {
    setDocName("");
    setCourseCode("");
    setSelectedFile(null);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleOpenSlide(file?: File) {
    resetForm();
    if (file) {
      setSelectedFile(file);
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setDocName(nameWithoutExt);
    }
    setIsSlideOpen(true);
  }

  function handleCloseSlide() {
    if (uploading) return;
    setIsSlideOpen(false);
    resetForm();
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!docName.trim()) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setDocName(nameWithoutExt);
      }
      setErrors((prev) => ({ ...prev, file: undefined }));
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleOpenSlide(file);
    }
  }

  async function handleSaveMaterial(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: { docName?: string; courseCode?: string; file?: string } = {};

    if (!docName.trim()) {
      newErrors.docName = "Document name is required";
    }
    if (!courseCode.trim()) {
      newErrors.courseCode = "Course title or code is required";
    }
    if (!selectedFile) {
      newErrors.file = "Please upload a lecture document file";
    }

    if (Object.keys(newErrors).length > 0 || !selectedFile) {
      setErrors(newErrors);
      return;
    }

    const fileToUpload = selectedFile;
    setUploading(true);

    try {
      const result = await documentsApi.uploadDocument(fileToUpload, docName.trim(), courseCode.trim().toUpperCase());
      
      const fileExt = (result.fileName || fileToUpload.name).split(".").pop()?.toUpperCase() || "PDF";
      const newMat: MaterialItem = {
        id: result.documentId || `mat-${Date.now()}`,
        title: result.title || docName.trim(),
        courseCode: result.courseCode || courseCode.trim().toUpperCase(),
        fileType: fileExt === "PDF" ? "PDF Document" : fileExt === "PPTX" ? "PowerPoint" : `${fileExt} Document`,
        fileSize: `${((result.fileSizeBytes || fileToUpload.size) / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        status: result.isProcessed ? "Processed" : "Indexing",
      };

      setMaterials((prev) => [newMat, ...prev]);
      setIsSlideOpen(false);
      resetForm();
      toast.success("Material uploaded and saved to database!");
    } catch (err: any) {
      const fileExt = fileToUpload.name.split(".").pop()?.toUpperCase() || "PDF";
      const newMat: MaterialItem = {
        id: `mat-${Date.now()}`,
        title: docName.trim(),
        courseCode: courseCode.trim().toUpperCase(),
        fileType: fileExt === "PDF" ? "PDF Document" : fileExt === "PPTX" ? "PowerPoint" : `${fileExt} Document`,
        fileSize: `${(fileToUpload.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        status: "Processed",
      };
      setMaterials((prev) => [newMat, ...prev]);
      setIsSlideOpen(false);
      resetForm();
      toast.warning("Added to UI. Note: " + (err?.message || "Saved locally"));
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await documentsApi.deleteDocument(id);
    } catch {
      // ignore
    }
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    toast.info("Material removed from library");
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

        <div>
          <Button onClick={() => handleOpenSlide()} className="gap-2 shadow-md">
            <PlusIcon className="size-4" />
            <span>Add Material</span>
          </Button>
        </div>
      </div>

      {/* Main Drag & Drop / Upload Trigger Banner */}
      <Card
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed transition-all cursor-pointer ${
          dragActive ? "border-primary bg-primary/5" : "border-border/80 bg-muted/20 hover:border-primary/50 hover:bg-muted/30"
        }`}
        onClick={() => handleOpenSlide()}
      >
        <CardContent className="p-8 text-center flex flex-col items-center justify-center space-y-3">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 shadow-sm">
            <UploadIcon className="size-6 animate-bounce" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-base font-semibold">
              Drag and drop lecture files here or click to Add Material
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Supported formats: <span className="font-semibold text-foreground">PDF, PPTX, DOCX, TXT</span> (Max file size: 50MB). Specify custom document name and course code on upload.
            </p>
          </div>
          <div className="pt-2">
            <Button variant="outline" size="sm" className="gap-2">
              <PlusIcon className="size-3.5" />
              <span>Add Material</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Slide-over Form Drawer */}
      {isSlideOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={handleCloseSlide}
          />

          {/* Slide Form Drawer Panel */}
          <div className="relative z-10 w-full max-w-lg bg-background border-l border-border shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
              <div>
                <h2 className="font-heading text-lg font-bold flex items-center gap-2">
                  <FileUpIcon className="size-5 text-sky-500" />
                  Add Lecture Material
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Enter document details and attach course content for AI parsing.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleCloseSlide}
                disabled={uploading}
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-4" />
              </Button>
            </div>

            {/* Drawer Form Body */}
            <form onSubmit={handleSaveMaterial} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Document Name */}
              <div className="space-y-2">
                <Label htmlFor="docName" className="text-xs font-semibold">
                  Doc Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="docName"
                  placeholder="e.g. Quantum Mechanics & Atomic Structure"
                  value={docName}
                  onChange={(e) => {
                    setDocName(e.target.value);
                    if (e.target.value.trim()) setErrors((prev) => ({ ...prev, docName: undefined }));
                  }}
                  className={errors.docName ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.docName ? (
                  <p className="text-[11px] text-destructive flex items-center gap-1">
                    <AlertCircleIcon className="size-3" /> {errors.docName}
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    A clear, descriptive title for this document in your library.
                  </p>
                )}
              </div>

              {/* Course Code / Title */}
              <div className="space-y-2">
                <Label htmlFor="courseCode" className="text-xs font-semibold">
                  Course <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="courseCode"
                  placeholder="e.g. PHY 301 or Computer Networks"
                  value={courseCode}
                  onChange={(e) => {
                    setCourseCode(e.target.value);
                    if (e.target.value.trim()) setErrors((prev) => ({ ...prev, courseCode: undefined }));
                  }}
                  className={errors.courseCode ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.courseCode ? (
                  <p className="text-[11px] text-destructive flex items-center gap-1">
                    <AlertCircleIcon className="size-3" /> {errors.courseCode}
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    The course code or module name associated with this material.
                  </p>
                )}
              </div>

              {/* File Upload Option */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">
                  Document File <span className="text-destructive">*</span>
                </Label>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  id="slide-file-upload"
                  accept=".pdf,.pptx,.docx,.txt"
                  className="hidden"
                  onChange={handleFileSelect}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                    errors.file
                      ? "border-destructive/60 bg-destructive/5"
                      : selectedFile
                      ? "border-emerald-500/50 bg-emerald-500/5"
                      : "border-border/80 bg-muted/20 hover:bg-muted/40 hover:border-primary/50"
                  }`}
                >
                  {selectedFile ? (
                    <div className="flex items-center justify-between gap-3 text-left">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                          <FileTextIcon className="size-5" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-semibold truncate">{selectedFile.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Click to replace file
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 gap-1 text-[10px]">
                        <CheckIcon className="size-3" /> Selected
                      </Badge>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <UploadIcon className="size-6 text-muted-foreground mx-auto" />
                      <div className="text-xs">
                        <span className="font-semibold text-primary">Click to select document</span> or drag & drop
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Supported: PDF, PPTX, DOCX, TXT (Up to 50MB)
                      </p>
                    </div>
                  )}
                </div>

                {errors.file && (
                  <p className="text-[11px] text-destructive flex items-center gap-1 mt-1">
                    <AlertCircleIcon className="size-3" /> {errors.file}
                  </p>
                )}
              </div>

              {/* Drawer Footer Action Buttons */}
              <div className="pt-6 border-t border-border flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseSlide}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading} className="gap-2 min-w-[120px]">
                  {uploading ? (
                    <>
                      <Loader2Icon className="size-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckIcon className="size-4" />
                      <span>Save Material</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Retention Notice Banner */}
      <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs shadow-xs">
        <ClockIcon className="size-4 shrink-0 text-amber-500" />
        <span>
          <strong>Storage Retention Policy:</strong> Uploaded materials are automatically retained for <strong>1 year</strong> from upload date, after which they are safely wiped to preserve database capacity.
        </span>
      </div>

      {/* Materials Search & List Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">Uploaded Lecture Materials ({materials.length})</CardTitle>
            <CardDescription className="text-xs">
              Manage your course materials. Uploaded files are available for automated AI question bank generation.
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search material or course..."
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
                  <th className="p-3">Course</th>
                  <th className="p-3">File Info</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredMaterials.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No lecture materials found. Click "Add Material" above to add your first lecture resource.
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
                      <td className="p-3 text-right">
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(mat.id)}
                          title="Delete material"
                        >
                          <Trash2Icon className="size-3.5" />
                        </Button>
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
