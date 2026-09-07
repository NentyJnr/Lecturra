export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface UserProfileDto {
  id: string;
  email: string;
  title?: string;
  fullName: string;
  role: string;
  tenantId?: string;
  tenantName?: string;
  phoneNumber?: string;
  location?: string;
  profileImageUrl?: string;
  isEmailVerified: boolean;
  createdAt?: string;
}

export interface JwtTokenResultDto {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: UserProfileDto;
}

export interface LoginCommand {
  email: string;
  password: string;
}

export interface RegisterUserCommand {
  title?: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  location?: string;
  profileImageUrl?: string;
}

export interface ForgotPasswordCommand {
  email: string;
}

export interface ResetPasswordCommand {
  email: string;
  token: string;
  newPassword: string;
}

export interface RefreshTokenCommand {
  token: string;
  refreshToken: string;
}
