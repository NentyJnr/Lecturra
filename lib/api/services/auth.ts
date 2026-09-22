import { api } from "@/lib/api/client";
import {
  AUTH_ENDPOINTS,
  type ApiMessage,
  type AuthSession,
  type ForgotPasswordPayload,
  type LoginPayload,
  type RawAuthResponse,
  type RegisterPayload,
  type ResetPasswordPayload,
  type RefreshTokenPayload,
  type VerifyEmailParams,
} from "@/lib/api/types/auth";

/** Normalize raw / wrapped backend responses into a flat AuthSession. */
export function normalizeSession(raw: RawAuthResponse): AuthSession {
  if ("accessToken" in raw) {
    // SAFETY: "accessToken" discriminant proves raw is AuthSession per RawAuthResponse union
    return raw as AuthSession;
  }
  if ("data" in raw && raw.data) {
    // SAFETY: "data" discriminant proves raw is wrapped { data: AuthSession }
    return (raw as { data: AuthSession }).data;
  }
  throw new Error("Unexpected auth response shape");
}

export async function register(payload: RegisterPayload): Promise<AuthSession> {
  const { data } = await api.post<RawAuthResponse>(AUTH_ENDPOINTS.register, payload);
  return normalizeSession(data);
}

export async function login(payload: LoginPayload): Promise<AuthSession> {
  const { data } = await api.post<RawAuthResponse>(AUTH_ENDPOINTS.login, payload);
  return normalizeSession(data);
}

export async function verifyEmail(params: VerifyEmailParams): Promise<ApiMessage> {
  const { data } = await api.get<ApiMessage>(AUTH_ENDPOINTS.verifyEmail, {
    params: { token: params.token },
  });
  return data;
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<ApiMessage> {
  const { data } = await api.post<ApiMessage>(AUTH_ENDPOINTS.forgotPassword, payload);
  return data;
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<ApiMessage> {
  const { data } = await api.post<ApiMessage>(AUTH_ENDPOINTS.resetPassword, payload);
  return data;
}

export async function refreshToken(payload: RefreshTokenPayload): Promise<AuthSession> {
  const { data } = await api.post<RawAuthResponse>(AUTH_ENDPOINTS.refreshToken, payload);
  return normalizeSession(data);
}
