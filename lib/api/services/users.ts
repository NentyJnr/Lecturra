import { api } from "@/lib/api/client";
import { AuthUser } from "@/lib/api/types/auth";

export interface UpdateProfilePayload {
  title?: string;
  fullName?: string;
  phoneNumber?: string;
  location?: string;
  profileImageUrl?: string;
}

export interface UserProfileResponse {
  success: boolean;
  message?: string;
  data: AuthUser;
}

export interface MemberItem {
  id: string;
  tenantId: string;
  tenantName: string;
  fullName: string;
  email: string;
  title: string;
  location: string;
  roleName: string;
  isActive: boolean;
  isTenantSuspended: boolean;
  createdAt: string;
}

export async function getCurrentUserProfile(): Promise<AuthUser | null> {
  try {
    const { data } = await api.get<UserProfileResponse>("/api/v1/users/me");
    if (data && data.data) {
      return data.data;
    }
    return null;
  } catch {
    return null;
  }
}

export async function updateUserProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
  const { data } = await api.put<UserProfileResponse>("/api/v1/users/profile", payload);
  if (data && data.data) {
    return data.data;
  }
  throw new Error(data.message || "Failed to update user profile");
}

export async function getMembers(
  filterTenantId?: string,
  searchQuery?: string,
  status?: string
): Promise<MemberItem[]> {
  try {
    const params: Record<string, string> = {};
    if (filterTenantId) params.filterTenantId = filterTenantId;
    if (searchQuery) params.searchQuery = searchQuery;
    if (status) params.status = status;

    const res = await api.get<{ success: boolean; data: MemberItem[] }>("/api/v1/users/members", { params });
    return res.data?.data || [];
  } catch {
    return [];
  }
}

export async function toggleUserStatus(userId: string, isActive: boolean): Promise<boolean> {
  const res = await api.put<{ success: boolean; message: string; data: boolean }>(`/api/v1/users/${userId}/status`, {
    isActive,
  });
  return res.data?.success || false;
}
