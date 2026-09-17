import { api } from "@/lib/api/client";

export interface DashboardOverviewData {
  remainingQuota: number;
  monthlyQuotaLimit: number;
  libraryMaterialsCount: number;
  questionBanksCount: number;
  submissionsCount: number;
  totalAssessmentsCount: number;
  institutionName: string;
  facultyAccessCode: string;
  isOrganization: boolean;
}

export interface DashboardOverviewResponse {
  success: boolean;
  message?: string;
  data: DashboardOverviewData;
}

export async function getDashboardOverview(): Promise<DashboardOverviewData> {
  const { data } = await api.get<DashboardOverviewResponse>("/api/v1/dashboard/overview");
  if (data && data.data) {
    return data.data;
  }
  throw new Error(data.message || "Failed to load dashboard overview");
}
