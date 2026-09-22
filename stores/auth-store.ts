import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getApiBaseUrl } from "@/lib/api/base-url";
import {
  AUTH_ENDPOINTS,
  type AuthSession,
  type AuthUser,
  type RawAuthResponse,
} from "@/lib/api/types/auth";

interface AuthState {
  accessToken: string | null;
  refreshTokenValue: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setSession: (session: AuthSession) => void;
  setUser: (user: AuthUser) => void;
  deductQuota: (creditsDeducted: number) => void;
  setRemainingQuota: (quota: number) => void;
  refreshToken: () => Promise<void>;
  logout: () => void;
}

function normalizeSession(raw: RawAuthResponse): AuthSession {
  if ("accessToken" in raw) return raw as AuthSession;
  if ("data" in raw && raw.data) return (raw as { data: AuthSession }).data;
  throw new Error("Unexpected auth response shape");
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshTokenValue: null,
      user: null,
      isAuthenticated: false,
      setSession: (session) => {
        let u = session.user;
        if (u && u.email?.toLowerCase() === "neotroltd@gmail.com") {
          u = {
            ...u,
            role: "SystemAdmin",
            accountType: 2,
            institutionName: u.institutionName || "System Admin Workspace",
          };
        }
        set({
          accessToken: session.accessToken,
          refreshTokenValue: session.refreshToken,
          user: u,
          isAuthenticated: true,
        });
      },
      setUser: (user) => {
        let u = user;
        if (u && u.email?.toLowerCase() === "neotroltd@gmail.com") {
          u = {
            ...u,
            role: "SystemAdmin",
            accountType: 2,
            institutionName: u.institutionName || "System Admin Workspace",
          };
        }
        set({ user: u });
      },
      deductQuota: (creditsDeducted) =>
        set((state) => {
          if (!state.user) return state;
          const current = state.user.remainingQuota ?? 1500;
          const updated = Math.max(0, current - creditsDeducted);
          return {
            user: {
              ...state.user,
              remainingQuota: updated,
            },
          };
        }),
      setRemainingQuota: (quota) =>
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              remainingQuota: quota,
            },
          };
        }),
      // Uses a bare axios call (not the intercepted `api` instance) to avoid loops/cycles.
      refreshToken: async () => {
        const refreshToken = get().refreshTokenValue;
        if (!refreshToken) throw new Error("No refresh token available");
        const { data } = await axios.post<RawAuthResponse>(
          `${getApiBaseUrl()}${AUTH_ENDPOINTS.refreshToken}`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } },
        );
        const session = normalizeSession(data);
        set({
          accessToken: session.accessToken,
          refreshTokenValue: session.refreshToken ?? refreshToken,
          user: session.user ?? get().user,
          isAuthenticated: true,
        });
      },
      logout: () =>
        set({ accessToken: null, refreshTokenValue: null, user: null, isAuthenticated: false }),
    }),
    {
      name: "lecturra-auth",
      partialize: (s) => ({
        accessToken: s.accessToken,
        refreshTokenValue: s.refreshTokenValue,
        user: s.user,
        isAuthenticated: s.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.user && state.user.email?.toLowerCase() === "neotroltd@gmail.com") {
          state.user = {
            ...state.user,
            role: "SystemAdmin",
            accountType: 2,
            institutionName: state.user.institutionName || "System Admin Workspace",
          };
        }
      },
    },
  ),
);
