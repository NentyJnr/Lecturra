import { Suspense } from "react";
import { RegisterForm } from "./_components/register-form";

export const metadata = { title: "Create account — Lecturra" };

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background" />}>
      <RegisterForm />
    </Suspense>
  );
}
