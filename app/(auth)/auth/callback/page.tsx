"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon, AlertCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { microsoftLogin, googleLogin } from "@/lib/api/services/auth";
import { useAuthStore } from "@/stores/auth-store";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { Button } from "@/components/ui/button";

export default function AuthCallbackPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Extract tokens and errors from BOTH hash fragment (#id_token=...) and query string (?id_token=...)
    const hash = window.location.hash.startsWith("#") ? window.location.hash.substring(1) : window.location.hash;
    const hashParams = new URLSearchParams(hash);
    const searchParams = new URLSearchParams(window.location.search);

    const idToken =
      hashParams.get("id_token") ||
      searchParams.get("id_token") ||
      hashParams.get("token") ||
      searchParams.get("token") ||
      hashParams.get("access_token") ||
      searchParams.get("access_token") ||
      hashParams.get("credential") ||
      searchParams.get("credential");

    const rawError = hashParams.get("error") || searchParams.get("error");
    const rawErrorDesc =
      hashParams.get("error_description") ||
      searchParams.get("error_description") ||
      hashParams.get("error_message") ||
      searchParams.get("error_message");

    // Case 1: Error returned by identity provider
    if (rawError) {
      const formattedError = rawErrorDesc ? decodeURIComponent(rawErrorDesc) : rawError;
      
      // If running inside a popup window
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: "MS_AUTH_ERROR", error: formattedError }, window.location.origin);
        window.opener.postMessage({ type: "GOOGLE_AUTH_ERROR", error: formattedError }, window.location.origin);
        window.close();
        return;
      }

      // If running in full-page redirect mode
      setErrorMessage(formattedError);
      toast.error("Authentication failed", { description: formattedError });
      return;
    }

    // Case 2: Token successfully returned
    if (idToken) {
      // If running inside a popup window
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: "MS_AUTH_SUCCESS", token: idToken }, window.location.origin);
        window.opener.postMessage({ type: "GOOGLE_AUTH_SUCCESS", token: idToken }, window.location.origin);
        window.close();
        return;
      }

      // If running in full-page redirect mode (no window.opener)
      const completeRedirectAuth = async () => {
        try {
          // Attempt Microsoft login first, fallback to Google
          let result;
          try {
            result = await microsoftLogin(idToken);
          } catch {
            result = await googleLogin(idToken);
          }

          setSession(result);
          toast.success("Welcome back!", {
            description: result.isNewUser
              ? "Your academic account was provisioned with 1,500 credits."
              : "Successfully signed in.",
          });
          router.replace("/dashboard");
        } catch (err) {
          const msg = getApiErrorMessage(err);
          setErrorMessage(msg);
          toast.error("Single Sign-On Failed", { description: msg });
        }
      };

      completeRedirectAuth();
      return;
    }

    // Case 3: Neither token nor error was found (e.g. invalid URL or cancelled)
    const timer = setTimeout(() => {
      setErrorMessage("No identity credentials were found in the callback request.");
    }, 4000);

    return () => clearTimeout(timer);
  }, [router, setSession]);

  return (
    <div className="flex min-h-svh items-center justify-center p-6 text-center">
      <div className="w-full max-w-sm space-y-4 rounded-xl border border-border/80 bg-card p-6 shadow-sm">
        {errorMessage ? (
          <div className="space-y-3">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircleIcon className="size-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Authentication Unsuccessful</h2>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed break-words">{errorMessage}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => router.replace("/login")}
            >
              Return to Login
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Loader2Icon className="size-6 animate-spin text-primary mx-auto" />
            <p className="text-xs font-medium text-muted-foreground">Completing authentication...</p>
          </div>
        )}
      </div>
    </div>
  );
}
