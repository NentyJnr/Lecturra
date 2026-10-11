import { VerifyEmailStatus } from "./_components/verify-email-status";
import { AuthShell } from "@/components/auth-shell";

export const metadata = { title: "Verify email — Lecturra" };

export default function VerifyEmailPage() {
  return (
    <AuthShell>
      <VerifyEmailStatus />
    </AuthShell>
  );
}
