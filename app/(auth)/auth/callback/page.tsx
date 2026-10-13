"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon, AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { toast } from "sonner";
import { microsoftLogin, googleLogin, type SsoAuthResult } from "@/lib/api/services/auth";
import { useAuthStore } from "@/stores/auth-store";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { Button } from "@/components/ui/button";

export default function AuthCallbackPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Extract tokens, state, and errors from BOTH hash fragment (#id_token=...) and query string (?id_token=...)
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

    const stateParam = (hashParams.get("state") || searchParams.get("state") || "").toLowerCase();
    const issParam = (hashParams.get("iss") || searchParams.get("iss") || "").toLowerCase();
    const storedProvider = localStorage.getItem("lectura_sso_provider") || "";

    const isGoogle =
      stateParam.includes("google") ||
      issParam.includes("google") ||
      issParam.includes("accounts.google.com") ||
      storedProvider === "google";

    const isMicrosoft =
      stateParam.includes("microsoft") ||
      issParam.includes("microsoft") ||
      issParam.includes("login.microsoftonline.com") ||
      storedProvider === "microsoft";

    const rawError = hashParams.get("error") || searchParams.get("error");
    const rawErrorDesc =
      hashParams.get("error_description") ||
      searchParams.get("error_description") ||
      hashParams.get("error_message") ||
      searchParams.get("error_message");

    // Case 1: Error returned by identity provider
    if (rawError) {
      const formattedError = rawErrorDesc ? decodeURIComponent(rawErrorDesc) : rawError;
      
      // Notify parent/opener if opened via popup
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({ type: "MS_AUTH_ERROR", error: formattedError }, window.location.origin);
          window.opener.postMessage({ type: "GOOGLE_AUTH_ERROR", error: formattedError }, window.location.origin);
          window.close();
          return;
        }
      } catch {}

      setErrorMessage(formattedError);
      toast.error("Authentication failed", { description: formattedError });
      return;
    }

    // Case 2: Token successfully returned
    if (idToken) {
      const completeAuth = async () => {
        try {
          const storedRef = localStorage.getItem("lectura_referral_code") || undefined;
          
          let orgInviteFromState: string | undefined = undefined;
          const rawState = hashParams.get("state") || searchParams.get("state");
          if (rawState) {
            try {
              const decoded = JSON.parse(atob(decodeURIComponent(rawState)));
              if (decoded?.orgInvite) {
                orgInviteFromState = decoded.orgInvite;
              }
            } catch {}
          }
          const storedInvite = orgInviteFromState || localStorage.getItem("lecturra_org_invite") || undefined;

          let result: SsoAuthResult;

          // Route to the correct provider endpoint directly to avoid false 500/400 errors
          if (isMicrosoft) {
            result = await microsoftLogin(idToken, storedRef);
          } else if (isGoogle) {
            result = await googleLogin(idToken, storedRef, storedInvite);
          } else {
            // If provider is undetermined, inspect or try Google first, then Microsoft
            try {
              result = await googleLogin(idToken, storedRef, storedInvite);
            } catch {
              result = await microsoftLogin(idToken, storedRef);
            }
          }

          if (storedRef && result.isNewUser) {
            localStorage.removeItem("lectura_referral_code");
          }
          if (storedInvite) {
            localStorage.removeItem("lecturra_org_invite");
          }
          localStorage.removeItem("lectura_sso_provider");

          // Save session to global store and local storage
          setSession(result);
          setIsSuccess(true);

          // Broadcast to any other open tabs (e.g. login tab)
          try {
            if ("BroadcastChannel" in window) {
              const channel = new BroadcastChannel("lecturra_auth_channel");
              channel.postMessage({ type: "AUTH_SUCCESS", session: result });
              channel.close();
            }
          } catch {}

          try {
            localStorage.setItem(
              "lectura_auth_success",
              JSON.stringify({ timestamp: Date.now(), userId: result.user?.id })
            );
          } catch {}

          // Check if running inside a popup
          const isPopup =
            typeof window !== "undefined" &&
            (window.opener !== null ||
              window.name === "GoogleLogin" ||
              window.name === "MicrosoftLogin" ||
              (window.innerWidth < 650 && window.innerHeight < 750));

          if (isPopup) {
            // Attempt to message opener and close popup
            try {
              if (window.opener && !window.opener.closed) {
                window.opener.postMessage({ type: "GOOGLE_AUTH_SUCCESS", token: idToken }, window.location.origin);
                window.opener.postMessage({ type: "MS_AUTH_SUCCESS", token: idToken }, window.location.origin);
                window.opener.postMessage({ type: "AUTH_SUCCESS", session: result }, window.location.origin);
              }
            } catch {}

            try {
              window.close();
            } catch {}

            // If popup was NOT closed by browser (e.g. COOP restriction), navigate to dashboard
            setTimeout(() => {
              toast.success("Welcome back!", {
                description: result.isNewUser
                  ? "Your academic account was provisioned with 1,500 credits."
                  : "Successfully signed in.",
              });
              router.replace("/dashboard");
            }, 600);
            return;
          }

          // Main window standard redirect
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

      completeAuth();
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
        ) : isSuccess ? (
          <div className="space-y-3">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-[#00B578]/10 text-[#00B578]">
              <CheckCircle2Icon className="size-5" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">Authentication Successful</h2>
            <p className="text-xs text-muted-foreground">Redirecting to your academic workspace...</p>
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
