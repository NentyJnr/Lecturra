import { api } from "@/lib/api/client";
import { ApiResponse } from "@/lib/api/types/api";

export interface WorkspaceItem {
  id: string;
  name: string;
  credits: number;
  role: string;
  isPersonal: boolean;
  inviteCode?: string;
  memberCount: number;
}

export interface InvitePreview {
  organizationId: string;
  name: string;
  inviteCode: string;
  allowedDomain?: string;
  memberCount: number;
}

export interface InviteLinkResult {
  organizationId: string;
  organizationName: string;
  inviteCode: string;
  inviteLink: string;
  token: string;
}

export interface JoinOrganizationResult {
  organizationId: string;
  name: string;
  sharedCredits: number;
  role: string;
}

export const organizationsService = {
  async getMyWorkspaces(): Promise<WorkspaceItem[]> {
    const res = await api.get<ApiResponse<WorkspaceItem[]>>("/api/v1/organizations/my-workspaces");
    return res.data.data || [];
  },

  async getInvitePreview(code: string): Promise<InvitePreview> {
    const res = await api.get<ApiResponse<InvitePreview>>(`/api/v1/organizations/invite-preview?code=${encodeURIComponent(code)}`);
    if (!res.data.data) {
      throw new Error(res.data.message || "Failed to load invite preview.");
    }
    return res.data.data;
  },

  async generateInviteLink(orgId: string, targetEmail?: string): Promise<InviteLinkResult> {
    const res = await api.post<ApiResponse<InviteLinkResult>>(`/api/v1/organizations/${orgId}/invite-link`, {
      targetEmail: targetEmail || null,
    });
    if (!res.data.data) {
      throw new Error(res.data.message || "Failed to generate invite link.");
    }
    return res.data.data;
  },

  async joinOrganization(inviteCode: string): Promise<JoinOrganizationResult> {
    const res = await api.post<ApiResponse<JoinOrganizationResult>>("/api/v1/organizations/join", {
      inviteCode,
    });
    if (!res.data.data) {
      throw new Error(res.data.message || "Failed to join organization.");
    }
    return res.data.data;
  },

  async removeMember(orgId: string, userId: string): Promise<boolean> {
    const res = await api.post<ApiResponse<boolean>>(`/api/v1/organizations/${orgId}/members/remove`, {
      userId,
    });
    return res.data.success;
  },

  async createOrganization(payload: { name: string; allowedDomain?: string; initialCredits?: number }) {
    const res = await api.post<ApiResponse<any>>("/api/v1/organizations", payload);
    return res.data.data;
  },
};
