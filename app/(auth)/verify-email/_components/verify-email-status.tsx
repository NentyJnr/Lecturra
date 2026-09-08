"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CircleCheckIcon, Loader2Icon, OctagonXIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useVerifyEmail } from "@/hooks/use-auth";
import { getApiErrorMessage } from "@/lib/api/api-error";

function VerifyEmailStatusInner() {
  const token = useSearchParams().get("token");
  const verification = useVerifyEmail(token);

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
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2Icon className="animate-spin" /> Verifying...
          </div>
        )}
        {token && verification.isSuccess && (
          <Alert>
            <CircleCheckIcon />
            <AlertTitle>Email verified</AlertTitle>
            <AlertDescription>
              {verification.data.message ?? "Your email has been verified. You can log in now."}
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
          <Button type="button" className="w-full" onClick={() => (window.location.href = "/login")}>
            Continue to login
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
