"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGoogleLogin, useMicrosoftLogin } from "@/hooks/use-auth";
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
  const microsoftMutation = useMicrosoftLogin();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState(false);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const microsoftClientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID;

  // Load Google Identity Services script
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
        const result = await googleMutation.mutateAsync(response.credential);
        toast.success("Welcome back!", {
          description: result.isNewUser
            ? "Your new academic account was provisioned with 1,500 free credits."
            : "Successfully signed in with Google.",
        });
        router.push("/dashboard");
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
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      googleClientId
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=id_token&scope=openid%20profile%20email&nonce=${nonce}`;

    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      authUrl,
      "GoogleLogin",
      `width=${width},height=${height},top=${top},left=${left},toolbar=no,menubar=no`
    );

    if (!popup) {
      setIsGoogleLoading(false);
      toast.error("Popup blocked", {
        description: "Please allow popups for localhost to authenticate with Google.",
      });
      return;
    }

    // Listen for OAuth token callback from popup
    const messageListener = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "GOOGLE_AUTH_SUCCESS" && event.data?.token) {
        window.removeEventListener("message", messageListener);
        popup?.close();

        try {
          const result = await googleMutation.mutateAsync(event.data.token);
          toast.success("Welcome back!", {
            description: result.isNewUser
              ? "Your new academic account was provisioned with 1,500 free credits."
              : "Successfully signed in with Google.",
          });
          router.push("/dashboard");
        } catch (err) {
          toast.error("Google Sign-In Failed", { description: getApiErrorMessage(err) });
        } finally {
          setIsGoogleLoading(false);
        }
      } else if (event.data?.type === "GOOGLE_AUTH_ERROR") {
        window.removeEventListener("message", messageListener);
        popup?.close();
        setIsGoogleLoading(false);
        toast.error("Google Sign-In Failed", {
          description: event.data.error || "Authentication was cancelled or denied.",
        });
      }
    };

    window.addEventListener("message", messageListener);

    // Watch for manual popup close
    const checkClosedInterval = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosedInterval);
        window.removeEventListener("message", messageListener);
        setIsGoogleLoading(false);
      }
    }, 1000);
  }, [googleClientId, googleMutation, router]);

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
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${microsoftClientId}&response_type=id_token&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=openid%20profile%20email&response_mode=fragment&nonce=${nonce}`;

    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      authUrl,
      "MicrosoftLogin",
      `width=${width},height=${height},top=${top},left=${left},toolbar=no,menubar=no`
    );

    if (!popup) {
      setIsMicrosoftLoading(false);
      toast.error("Popup blocked", {
        description: "Please allow popups for localhost to authenticate with Microsoft.",
      });
      return;
    }

    // Listen for OAuth token callback from popup
    const messageListener = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "MS_AUTH_SUCCESS" && event.data?.token) {
        window.removeEventListener("message", messageListener);
        popup?.close();

        try {
          const result = await microsoftMutation.mutateAsync(event.data.token);
          toast.success("Welcome back!", {
            description: result.isNewUser
              ? "Your new academic account was provisioned with 1,500 free credits."
              : "Successfully signed in with Microsoft.",
          });
          router.push("/dashboard");
        } catch (err) {
          toast.error("Microsoft Sign-In Failed", { description: getApiErrorMessage(err) });
        } finally {
          setIsMicrosoftLoading(false);
        }
      }
    };

    window.addEventListener("message", messageListener);
  }, [microsoftClientId, microsoftMutation, router]);

  return {
    triggerGoogleLogin,
    triggerMicrosoftLogin,
    isGoogleLoading,
    isMicrosoftLoading,
  };
}
