import { ForgotPasswordForm } from "./_components/forgot-password-form";
import { AuthShell } from "@/components/auth-shell";

export const metadata = { title: "Forgot password — Lecturra" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <ForgotPasswordForm />
    </AuthShell>
  );
}
