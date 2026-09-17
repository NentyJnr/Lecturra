import { api } from "@/lib/api/client";

export interface IngestedDocumentDto {
  documentId: string;
  fileName: string;
  contentType: string;
  fileSizeBytes: number;
  isProcessed: boolean;
  createdAt: string;
  title?: string;
  courseCode?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const documentsApi = {
  async getDocuments(): Promise<IngestedDocumentDto[]> {
    try {
      const res = await api.get<ApiResponse<IngestedDocumentDto[]>>("/api/v1/documents");
      return res.data?.data || [];
    } catch {
      return [];
    }
  },

  async uploadDocument(file: File, docName: string, courseCode: string): Promise<IngestedDocumentDto> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", docName);
    formData.append("docName", docName);
    formData.append("courseCode", courseCode);

    const res = await api.post<ApiResponse<IngestedDocumentDto>>("/api/v1/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!res.data || !res.data.success) {
      throw new Error(res.data?.message || "Failed to upload document");
    }

    return res.data.data;
  },

  async deleteDocument(documentId: string): Promise<void> {
    await api.delete(`/api/v1/documents/${documentId}`);
  },
};
