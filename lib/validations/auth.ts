import { z } from "zod";

const email = z.string().trim().min(1, "Email is required").email("Enter a valid email address");
const password = (label = "Password") =>
  z.string().min(1, `${label} is required`).min(8, `${label} must be at least 8 characters`);

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  fullName: z.string().trim().min(1, "Full name is required"),
  email,
  password: password(),
  phoneNumber: z.string().trim().min(1, "Phone number is required"),
  location: z.string().trim().min(1, "Location is required"),
  profileImageUrl: z.string().trim().optional(),
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    email,
    token: z.string().trim().min(1, "Reset token is required"),
    newPassword: password("New password"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
