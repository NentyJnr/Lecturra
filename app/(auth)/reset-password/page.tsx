import { ResetPasswordForm } from "./_components/reset-password-form";
import { AuthShell } from "@/components/auth-shell";

export const metadata = { title: "Reset password — Lecturra" };

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <ResetPasswordForm />
    </AuthShell>
  );
}
