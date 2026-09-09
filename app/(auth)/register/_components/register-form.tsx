"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, OctagonXIcon, UploadIcon, XIcon, ImageIcon, EyeIcon, EyeOffIcon } from "lucide-react";
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { accountType: 1 },
  });

  const selectedAccountType = watch("accountType");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Profile image must be smaller than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const rawResult = reader.result as string;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_DIM = 200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_DIM) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL("image/jpeg", 0.75);
            setImagePreview(compressed);
            setValue("profileImageUrl", compressed);
          } else {
            setImagePreview(rawResult);
            setValue("profileImageUrl", rawResult);
          }
        };
        img.src = rawResult;
      };
      reader.readAsDataURL(file);
    }
  }

  function removeImage() {
    setImagePreview(null);
    setValue("profileImageUrl", undefined);
  }

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
        <CardDescription>Get 1,500 free credits to start generating questions.</CardDescription>
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
            <Field>
              <FieldLabel>Account Type</FieldLabel>
              <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => setValue("accountType", 1)}
                  className={`py-1.5 px-3 text-xs font-medium rounded-md transition-all ${
                    selectedAccountType === 1
                      ? "bg-background text-foreground shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Individual Lecturer
                </button>
                <button
                  type="button"
                  onClick={() => setValue("accountType", 2)}
                  className={`py-1.5 px-3 text-xs font-medium rounded-md transition-all ${
                    selectedAccountType === 2
                      ? "bg-background text-foreground shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  School / Organization
                </button>
              </div>
              <input type="hidden" {...register("accountType", { valueAsNumber: true })} />
            </Field>

            {selectedAccountType === 2 && (
              <Field data-invalid={!!errors.institutionName}>
                <FieldLabel htmlFor="institutionName">Institution / School Name</FieldLabel>
                <Input
                  id="institutionName"
                  placeholder="e.g. University of Lagos"
                  aria-invalid={!!errors.institutionName}
                  {...register("institutionName")}
                />
                {errors.institutionName && <FieldError>{errors.institutionName.message}</FieldError>}
              </Field>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.title}>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <select
                  id="title"
                  className="h-8 w-full min-w-0 rounded-lg border border-input bg-background px-2.5 py-1 text-sm text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-[#18181b] dark:text-foreground"
                  aria-invalid={!!errors.title}
                  {...register("title")}
                >
                  <option value="" className="dark:bg-[#18181b] dark:text-foreground">Select title</option>
                  <option value="Prof." className="dark:bg-[#18181b] dark:text-foreground">Prof.</option>
                  <option value="Dr." className="dark:bg-[#18181b] dark:text-foreground">Dr.</option>
                  <option value="Mr." className="dark:bg-[#18181b] dark:text-foreground">Mr.</option>
                  <option value="Mrs." className="dark:bg-[#18181b] dark:text-foreground">Mrs.</option>
                  <option value="Ms." className="dark:bg-[#18181b] dark:text-foreground">Ms.</option>
                  <option value="Engr." className="dark:bg-[#18181b] dark:text-foreground">Engr.</option>
                  <option value="Arc." className="dark:bg-[#18181b] dark:text-foreground">Arc.</option>
                  <option value="Pharm." className="dark:bg-[#18181b] dark:text-foreground">Pharm.</option>
                </select>
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
            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative flex items-center">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
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
              <Field data-invalid={!!errors.confirmPassword}>
                <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
                <div className="relative flex items-center">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="pr-9"
                    aria-invalid={!!errors.confirmPassword}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-2.5 text-muted-foreground hover:text-foreground focus:outline-none"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <FieldError>{errors.confirmPassword.message}</FieldError>}
              </Field>
            </div>
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
              <FieldLabel htmlFor="profileImage">Profile photo (optional)</FieldLabel>
              {imagePreview ? (
                <div className="flex items-center gap-3 rounded-lg border border-input p-2 dark:bg-[#18181b]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="h-10 w-10 rounded-full object-cover border border-border"
                  />
                  <span className="text-xs text-muted-foreground truncate flex-1">Image selected</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                    onClick={removeImage}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-primary hover:file:bg-primary/20"
                />
              )}
              {errors.profileImageUrl && <FieldError>{errors.profileImageUrl.message}</FieldError>}
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.facultyAccessCode}>
                <FieldLabel htmlFor="facultyAccessCode">Faculty Code (optional)</FieldLabel>
                <Input
                  id="facultyAccessCode"
                  placeholder="FAC-UNILAG-2026"
                  aria-invalid={!!errors.facultyAccessCode}
                  {...register("facultyAccessCode")}
                />
                {errors.facultyAccessCode && <FieldError>{errors.facultyAccessCode.message}</FieldError>}
              </Field>
              <Field data-invalid={!!errors.referredByReferralCode}>
                <FieldLabel htmlFor="referredByReferralCode">Referral Code (optional)</FieldLabel>
                <Input
                  id="referredByReferralCode"
                  placeholder="REF-8F3B21A0"
                  aria-invalid={!!errors.referredByReferralCode}
                  {...register("referredByReferralCode")}
                />
                {errors.referredByReferralCode && <FieldError>{errors.referredByReferralCode.message}</FieldError>}
              </Field>
            </div>
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
