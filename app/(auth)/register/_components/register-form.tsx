"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, OctagonXIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRegister } from "@/hooks/use-auth";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  function onSubmit(values: RegisterValues) {
    const profileImageUrl = values.profileImageUrl?.trim();
    registerMutation.mutate(
      { ...values, profileImageUrl: profileImageUrl ? profileImageUrl : undefined },
      {
        onSuccess: () => {
          toast.success("Account created! Check your email to verify it.");
          router.push("/login");
        },
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Get 5,000 free credits to start generating questions.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          {registerMutation.isError && (
            <Alert variant="destructive">
              <OctagonXIcon />
              <AlertTitle>Registration failed</AlertTitle>
              <AlertDescription>{getApiErrorMessage(registerMutation.error)}</AlertDescription>
            </Alert>
          )}
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.title}>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  placeholder="Dr."
                  autoComplete="honorific-prefix"
                  aria-invalid={!!errors.title}
                  {...register("title")}
                />
                {errors.title && <FieldError>{errors.title.message}</FieldError>}
              </Field>
              <Field data-invalid={!!errors.fullName}>
                <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                <Input
                  id="fullName"
                  placeholder="Jane Doe"
                  autoComplete="name"
                  aria-invalid={!!errors.fullName}
                  {...register("fullName")}
                />
                {errors.fullName && <FieldError>{errors.fullName.message}</FieldError>}
              </Field>
            </div>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@unilag.edu.ng"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && <FieldError>{errors.password.message}</FieldError>}
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.phoneNumber}>
                <FieldLabel htmlFor="phoneNumber">Phone</FieldLabel>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+2348012345678"
                  autoComplete="tel"
                  aria-invalid={!!errors.phoneNumber}
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && <FieldError>{errors.phoneNumber.message}</FieldError>}
              </Field>
              <Field data-invalid={!!errors.location}>
                <FieldLabel htmlFor="location">Location</FieldLabel>
                <Input
                  id="location"
                  placeholder="Lagos, Nigeria"
                  autoComplete="address-level2"
                  aria-invalid={!!errors.location}
                  {...register("location")}
                />
                {errors.location && <FieldError>{errors.location.message}</FieldError>}
              </Field>
            </div>
            <Field data-invalid={!!errors.profileImageUrl}>
              <FieldLabel htmlFor="profileImageUrl">Profile image URL (optional)</FieldLabel>
              <Input
                id="profileImageUrl"
                type="url"
                placeholder="https://..."
                autoComplete="url"
                aria-invalid={!!errors.profileImageUrl}
                {...register("profileImageUrl")}
              />
              {errors.profileImageUrl && <FieldError>{errors.profileImageUrl.message}</FieldError>}
            </Field>
          </FieldGroup>
          <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
            {registerMutation.isPending && <Loader2Icon className="animate-spin" />}
            {registerMutation.isPending ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="text-primary underline-offset-4 hover:underline">
            Log in
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
