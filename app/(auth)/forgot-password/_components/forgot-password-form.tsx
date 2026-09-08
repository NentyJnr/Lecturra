"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheckIcon, Loader2Icon, OctagonXIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForgotPassword } from "@/hooks/use-auth";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validations/auth";

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
        <CardDescription>Enter your account email and we&apos;ll send a reset link.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((v) => forgotPassword.mutate(v))}
          className="flex flex-col gap-4"
          noValidate
        >
          {forgotPassword.isError && (
            <Alert variant="destructive">
              <OctagonXIcon />
              <AlertTitle>Request failed</AlertTitle>
              <AlertDescription>{getApiErrorMessage(forgotPassword.error)}</AlertDescription>
            </Alert>
          )}
          {forgotPassword.isSuccess && (
            <Alert>
              <CircleCheckIcon />
              <AlertTitle>Check your inbox</AlertTitle>
              <AlertDescription>
                If an account exists for that email, a reset link is on its way.
              </AlertDescription>
            </Alert>
          )}
          <FieldGroup>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@unilag.edu.ng"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>
          </FieldGroup>
          <Button type="submit" className="w-full" disabled={forgotPassword.isPending}>
            {forgotPassword.isPending && <Loader2Icon className="animate-spin" />}
            {forgotPassword.isPending ? "Sending..." : "Send reset link"}
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
