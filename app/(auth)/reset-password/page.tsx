import { Suspense } from "react";
import { ResetPasswordForm } from "./_components/reset-password-form";
import { AuthShell } from "@/components/auth-shell";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reset password — Lecturra" };

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading reset form...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
