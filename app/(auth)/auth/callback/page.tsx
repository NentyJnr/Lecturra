"use client";

import { useEffect } from "react";

export default function AuthCallbackPage() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Parse id_token from hash fragment (#id_token=...)
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const idToken = params.get("id_token");

    if (idToken && window.opener) {
      window.opener.postMessage(
        { type: "GOOGLE_AUTH_SUCCESS", token: idToken },
        window.location.origin
      );
      window.opener.postMessage(
        { type: "MS_AUTH_SUCCESS", token: idToken },
        window.location.origin
      );
      window.close();
    } else if (params.get("error") && window.opener) {
      const errorMsg = params.get("error_description") || "Authentication failed";
      window.opener.postMessage(
        { type: "GOOGLE_AUTH_ERROR", error: errorMsg },
        window.location.origin
      );
      window.opener.postMessage(
        { type: "MS_AUTH_ERROR", error: errorMsg },
        window.location.origin
      );
      window.close();
    }
  }, []);

  return (
    <div className="flex min-h-svh items-center justify-center p-6 text-center">
      <div className="space-y-2">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
        <p className="text-sm font-medium text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
}
