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
      setSession: (session) =>
        set({
          accessToken: session.accessToken,
          refreshTokenValue: session.refreshToken,
          user: session.user,
          isAuthenticated: true,
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
    },
  ),
);
