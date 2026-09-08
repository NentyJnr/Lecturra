"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, OctagonXIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLogin } from "@/hooks/use-auth";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { ProviderType } from "@/lib/api/types/auth";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  function onSubmit(values: LoginValues) {
    login.mutate(
      { email: values.email, passwordOrToken: values.password, providerType: ProviderType.Email },
      {
        onSuccess: () => {
          toast.success("Welcome back!");
          router.push("/");
        },
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log in to Lecturra</CardTitle>
        <CardDescription>Enter your credentials to access your workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          {login.isError && (
            <Alert variant="destructive">
              <OctagonXIcon />
              <AlertTitle>Login failed</AlertTitle>
              <AlertDescription>{getApiErrorMessage(login.error)}</AlertDescription>
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
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative flex items-center">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="pr-9"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2.5 text-muted-foreground hover:text-foreground focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <FieldError>{errors.password.message}</FieldError>}
            </Field>
          </FieldGroup>
          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending && <Loader2Icon className="animate-spin" />}
            {login.isPending ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2 text-center text-sm">
        <a href="/forgot-password" className="text-primary underline-offset-4 hover:underline">
          Forgot your password?
        </a>
        <p className="text-muted-foreground">
          No account yet?{" "}
          <a href="/register" className="text-primary underline-offset-4 hover:underline">
            Create one
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
