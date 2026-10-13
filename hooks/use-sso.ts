"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGoogleLogin } from "@/hooks/use-auth";
import { getApiErrorMessage } from "@/lib/api/api-error";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (callback?: (notification: {
            isNotDisplayed: () => boolean;
            isSkippedMoment: () => boolean;
            isDismissedMoment: () => boolean;
            getNotDisplayedReason?: () => string;
            getSkippedReason?: () => string;
            getDismissedReason?: () => string;
          }) => void) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with";
              width?: number;
            }
          ) => void;
        };
      };
    };
  }
}

export function useSso() {
  const router = useRouter();
  const googleMutation = useGoogleLogin();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState(false);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const microsoftClientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID;

  // Listen for background cross-window/popup auth completion
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "lectura_auth_success" && e.newValue) {
        try {
          const payload = JSON.parse(e.newValue);
          if (payload?.timestamp) {
            router.replace("/dashboard");
          }
        } catch {}
      }
    };

    window.addEventListener("storage", handleStorage);

    let channel: BroadcastChannel | null = null;
    if ("BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel("lecturra_auth_channel");
        channel.onmessage = (event) => {
          if (event.data?.type === "AUTH_SUCCESS") {
            router.replace("/dashboard");
          }
        };
      } catch {}
    }

    return () => {
      window.removeEventListener("storage", handleStorage);
      channel?.close();
    };
  }, [router]);

  // Load Google Identity Services script for One Tap if supported
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!document.getElementById("google-gsi-client")) {
      const script = document.createElement("script");
      script.id = "google-gsi-client";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (googleClientId && window.google?.accounts?.id) {
          try {
            window.google.accounts.id.initialize({
              client_id: googleClientId,
              callback: handleGoogleCredentialResponse,
              auto_select: false,
              cancel_on_tap_outside: true,
            });
          } catch (e) {
            console.error("[Lecturra SSO] Failed to initialize Google SDK:", e);
          }
        }
      };
      document.body.appendChild(script);
    } else if (googleClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      } catch (e) {
        console.error("[Lecturra SSO] Failed to re-initialize Google SDK:", e);
      }
    }
  }, [googleClientId]);

  const handleGoogleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      if (!response?.credential) {
        toast.error("Google authentication failed", {
          description: "No identity token was returned by Google.",
        });
        setIsGoogleLoading(false);
        return;
      }

      setIsGoogleLoading(true);
      try {
        const storedRef = typeof window !== "undefined" ? localStorage.getItem("lectura_referral_code") || undefined : undefined;
        const storedInvite = typeof window !== "undefined" ? localStorage.getItem("lecturra_org_invite") || undefined : undefined;
        const result = await googleMutation.mutateAsync({ idToken: response.credential, referralCode: storedRef, orgInvite: storedInvite });
        if (storedRef && result.isNewUser) {
          localStorage.removeItem("lectura_referral_code");
        }
        if (storedInvite) {
          localStorage.removeItem("lecturra_org_invite");
        }
        toast.success("Welcome back!", {
          description: result.isNewUser
            ? "Your new academic account was provisioned with 1,500 free credits."
            : "Successfully signed in with Google.",
        });
        router.replace("/dashboard");
      } catch (err) {
        const message = getApiErrorMessage(err);
        toast.error("Google Sign-In Failed", { description: message });
      } finally {
        setIsGoogleLoading(false);
      }
    },
    [googleMutation, router]
  );

  const triggerGoogleLogin = useCallback(() => {
    if (!googleClientId) {
      console.warn(
        "[Lecturra SSO] Missing Google Client ID. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your .env.local file."
      );
      toast.warning("Google Client ID is missing", {
        description: "Please configure NEXT_PUBLIC_GOOGLE_CLIENT_ID in your local .env.local file.",
      });
      return;
    }

    setIsGoogleLoading(true);

    const redirectUri = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : "";
    const nonce = Math.random().toString(36).substring(2, 15);
    
    if (typeof window !== "undefined") {
      localStorage.setItem("lectura_sso_provider", "google");
    }

    const storedInvite = typeof window !== "undefined" ? localStorage.getItem("lecturra_org_invite") || "" : "";
    const statePayload = {
      provider: "google",
      orgInvite: storedInvite || undefined,
    };
    let encodedState = "google";
    try {
      encodedState = encodeURIComponent(btoa(JSON.stringify(statePayload)));
    } catch {
      encodedState = "google";
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      googleClientId
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=id_token&scope=openid%20profile%20email&nonce=${nonce}&state=${encodedState}`;

    // Standard OAuth full-page redirect in the main window
    window.location.assign(authUrl);
  }, [googleClientId]);

  const triggerMicrosoftLogin = useCallback(() => {
    if (!microsoftClientId) {
      console.warn(
        "[Lecturra SSO] Missing Microsoft Client ID. Add NEXT_PUBLIC_MICROSOFT_CLIENT_ID to your .env.local file."
      );
      toast.warning("Microsoft Client ID is missing", {
        description: "Please configure NEXT_PUBLIC_MICROSOFT_CLIENT_ID in your local .env.local file.",
      });
      return;
    }

    setIsMicrosoftLoading(true);

    const redirectUri = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : "";
    const nonce = Math.random().toString(36).substring(2, 15);
    const tenant = process.env.NEXT_PUBLIC_MICROSOFT_TENANT_ID || "common";
    
    if (typeof window !== "undefined") {
      localStorage.setItem("lectura_sso_provider", "microsoft");
    }

    const authUrl = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?client_id=${encodeURIComponent(
      microsoftClientId
    )}&response_type=id_token&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=openid%20profile%20email&response_mode=fragment&nonce=${nonce}&state=microsoft`;

    // Standard OAuth full-page redirect in the main window
    window.location.assign(authUrl);
  }, [microsoftClientId]);

  return {
    triggerGoogleLogin,
    triggerMicrosoftLogin,
    isGoogleLoading,
    isMicrosoftLoading,
  };
}
