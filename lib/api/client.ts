import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { AUTH_ENDPOINTS } from "@/lib/api/types/auth";
import { getApiBaseUrl } from "@/lib/api/base-url";

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { "Content-Type": "application/json" },
});

// Attach auth token only on the client — server requests carry auth explicitly per-call.
if (globalThis.window !== undefined) {
  api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
      const status = error.response?.status;
      const url: string = originalRequest?.url ?? "";
      const isRefreshCall = url.includes(AUTH_ENDPOINTS.refreshToken);

      if (status === 401 && originalRequest && !originalRequest._retry && !isRefreshCall) {
        originalRequest._retry = true;
        try {
          await useAuthStore.getState().refreshToken();
          const token = useAuthStore.getState().accessToken;
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api.request(originalRequest);
        } catch {
          useAuthStore.getState().logout();
        }
      }
      return Promise.reject(error);
    },
  );
}
