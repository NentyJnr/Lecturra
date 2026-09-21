import { api } from "@/lib/api/client";

export interface TenantLookup {
  id: string;
  name: string;
  institutionName: string;
  email: string;
  facultyAccessCode: string;
  allowedDomain: string;
  isQuotaLocked: boolean;
  monthlyQuotaLimit: number;
  remainingQuota: number;
}

export const tenantsService = {
  async getAllTenants(): Promise<TenantLookup[]> {
    try {
      const res = await api.get<{ success: boolean; data: TenantLookup[] }>("/api/v1/tenants");
      return res.data?.data || [];
    } catch {
      return [];
    }
  },

  async toggleTenantStatus(tenantId: string, isQuotaLocked: boolean): Promise<boolean> {
    const res = await api.put<{ success: boolean; message: string; data: boolean }>(`/api/v1/tenants/${tenantId}/status`, {
      isQuotaLocked,
    });
    return res.data?.success || false;
  },
};
