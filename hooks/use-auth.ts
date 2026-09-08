import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import {
  forgotPassword,
  login,
  refreshToken as refreshTokenService,
  register,
  resetPassword,
  verifyEmail,
} from "@/lib/api/services/auth";
import type {
  ForgotPasswordPayload,
  LoginPayload,
  RefreshTokenPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "@/lib/api/types/auth";

export const authKeys = {
  all: ["auth"] as const,
  verifyEmail: (token: string | null) => ["auth", "verify-email", token] as const,
};

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: (session) => setSession(session),
  });
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (session) => setSession(session),
  });
}

export function useVerifyEmail(token: string | null) {
  return useQuery({
    queryKey: authKeys.verifyEmail(token),
    queryFn: () => verifyEmail({ token: token as string }),
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPassword(payload),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
  });
}

export function useRefreshToken() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (payload: RefreshTokenPayload) => refreshTokenService(payload),
    onSuccess: (session) => setSession(session),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);
  return () => {
    logout();
    queryClient.clear();
  };
}
