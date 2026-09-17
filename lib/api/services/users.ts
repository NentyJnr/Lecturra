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

export async function getCurrentUserProfile(): Promise<AuthUser> {
  const { data } = await api.get<UserProfileResponse>("/api/v1/users/me");
  if (data && data.data) {
    return data.data;
  }
  throw new Error(data.message || "Failed to fetch user profile");
}

export async function updateUserProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
  const { data } = await api.put<UserProfileResponse>("/api/v1/users/profile", payload);
  if (data && data.data) {
    return data.data;
  }
  throw new Error(data.message || "Failed to update user profile");
}
