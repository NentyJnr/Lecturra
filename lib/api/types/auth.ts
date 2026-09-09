export const AUTH_ENDPOINTS = {
  register: "/api/v1/auth/register",
  login: "/api/v1/auth/login",
  verifyEmail: "/api/v1/auth/verify-email",
  forgotPassword: "/api/v1/auth/forgot-password",
  resetPassword: "/api/v1/auth/reset-password",
  refreshToken: "/api/v1/auth/refresh-token",
} as const;

/** Provider types for login. Email/password = 1. */
export enum ProviderType {
  Email = 1,
}

export interface RegisterPayload {
  title: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  location: string;
  profileImageUrl?: string;
  // Optional backend onboarding fields (see API spec)
  institutionName?: string;
  facultyEmail?: string;
  facultyAccessCode?: string;
  referredByReferralCode?: string;
}

export interface LoginPayload {
  email: string;
  passwordOrToken: string;
  providerType: ProviderType;
}

export interface VerifyEmailParams {
  token: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  newPassword: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  title?: string;
  phoneNumber?: string;
  location?: string;
  profileImageUrl?: string;
  role?: string;
  accountType?: number;
  institutionName?: string;
  facultyAccessCode?: string;
  tenantId?: string;
  remainingQuota?: number;
  monthlyQuotaLimit?: number;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: AuthUser | null;
  expiresAt?: string;
}

/** Backend may return the session raw or wrapped in { data } / { succeeded, data, message }. */
export type RawAuthResponse =
  | AuthSession
  | { data: AuthSession; message?: string }
  | { succeeded: boolean; data: AuthSession; message?: string };

export interface ApiMessage {
  message?: string;
  succeeded?: boolean;
}
