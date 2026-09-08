"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CircleCheckIcon, Loader2Icon, OctagonXIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useVerifyEmail } from "@/hooks/use-auth";
import { getApiErrorMessage } from "@/lib/api/api-error";

function VerifyEmailStatusInner() {
  const router = useRouter();
  const token = useSearchParams().get("token");
  const verification = useVerifyEmail(token);

  useEffect(() => {
    if (verification.isSuccess) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [verification.isSuccess, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>Confirming your email address with Lecturra.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!token && (
          <Alert variant="destructive">
            <OctagonXIcon />
            <AlertTitle>Missing token</AlertTitle>
            <AlertDescription>
              This verification link is incomplete. Check the full link from your email.
            </AlertDescription>
          </Alert>
        )}
        {token && verification.isPending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <Loader2Icon className="animate-spin text-primary h-5 w-5" /> Verifying account token...
          </div>
        )}
        {token && verification.isSuccess && (
          <Alert className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CircleCheckIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <AlertTitle>Email verified successfully!</AlertTitle>
            <AlertDescription>
              {verification.data.message ?? "Your email has been verified. Redirecting to login..."}
            </AlertDescription>
          </Alert>
        )}
        {token && verification.isError && (
          <Alert variant="destructive">
            <OctagonXIcon />
            <AlertTitle>Verification failed</AlertTitle>
            <AlertDescription>{getApiErrorMessage(verification.error)}</AlertDescription>
          </Alert>
        )}
        {token && verification.isSuccess && (
          <Button type="button" className="w-full" onClick={() => router.push("/login")}>
            Continue to login now &rarr;
          </Button>
        )}
      </CardContent>
      <CardFooter className="justify-center text-sm">
        <a href="/login" className="text-primary underline-offset-4 hover:underline">
          Back to login
        </a>
      </CardFooter>
    </Card>
  );
}

export function VerifyEmailStatus() {
  return (
    <Suspense
      fallback={
        <Card>
          <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2Icon className="animate-spin" /> Loading...
          </CardContent>
        </Card>
      }
    >
      <VerifyEmailStatusInner />
    </Suspense>
  );
}
