"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, OctagonXIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useResetPassword } from "@/hooks/use-auth";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/validations/auth";

function ResetPasswordFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPassword = useResetPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      token: searchParams.get("token") ?? "",
    },
  });

  function onSubmit(values: ResetPasswordValues) {
    resetPassword.mutate(
      { email: values.email, token: values.token, newPassword: values.newPassword },
      {
      onSuccess: () => {
        toast.success("Password reset! Log in with your new password.");
        router.push("/login");
      },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>Enter the token from your email and choose a new password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          {resetPassword.isError && (
            <Alert variant="destructive">
              <OctagonXIcon />
              <AlertTitle>Reset failed</AlertTitle>
              <AlertDescription>{getApiErrorMessage(resetPassword.error)}</AlertDescription>
            </Alert>
          )}
          <FieldGroup>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>
            <Field data-invalid={!!errors.token}>
              <FieldLabel htmlFor="token">Reset token</FieldLabel>
              <Input
                id="token"
                autoComplete="one-time-code"
                aria-invalid={!!errors.token}
                {...register("token")}
              />
              {errors.token && <FieldError>{errors.token.message}</FieldError>}
            </Field>
            <Field data-invalid={!!errors.newPassword}>
              <FieldLabel htmlFor="newPassword">New password</FieldLabel>
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.newPassword}
                {...register("newPassword")}
              />
              {errors.newPassword && <FieldError>{errors.newPassword.message}</FieldError>}
            </Field>
            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="confirmPassword">Confirm new password</FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && <FieldError>{errors.confirmPassword.message}</FieldError>}
            </Field>
          </FieldGroup>
          <Button type="submit" className="w-full" disabled={resetPassword.isPending}>
            {resetPassword.isPending && <Loader2Icon className="animate-spin" />}
            {resetPassword.isPending ? "Resetting..." : "Reset password"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm">
        <a href="/login" className="text-primary underline-offset-4 hover:underline">
          Back to login
        </a>
      </CardFooter>
    </Card>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense>
      <ResetPasswordFormInner />
    </Suspense>
  );
}
