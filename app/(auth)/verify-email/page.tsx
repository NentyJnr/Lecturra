import { Suspense } from "react";
import { VerifyEmailStatus } from "./_components/verify-email-status";
import { AuthShell } from "@/components/auth-shell";

export const dynamic = "force-dynamic";
export const metadata = { title: "Verify email — Lecturra" };

export default function VerifyEmailPage() {
  return (
    <AuthShell>
      <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading verification...</div>}>
        <VerifyEmailStatus />
      </Suspense>
    </AuthShell>
  );
}
