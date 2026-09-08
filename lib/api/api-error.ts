import axios from "axios";

const FALLBACK = "Something went wrong. Please try again.";

interface ErrorBody {
  message?: unknown;
  title?: unknown;
  errors?: unknown;
}

/** Extract a human-readable message from an API error (ASP.NET ProblemDetails or { message }). */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const raw: unknown = error.response?.data;
    const status = error.response?.status;

    if (typeof raw === "string") {
      const trimmed = raw.trim();
      if (trimmed.startsWith("<") || trimmed.includes("<!DOCTYPE") || trimmed.includes("<html")) {
        if (status === 404) return "API endpoint or server route not found (404).";
        if (status === 500) return "Internal server error (500). Please try again later.";
        if (status === 502 || status === 503 || status === 504) return "Server is temporarily unavailable. Please try again later.";
        return error.response?.statusText || FALLBACK;
      }
      return trimmed || FALLBACK;
    }

    if (typeof raw === "object" && raw !== null) {
      const data = raw as ErrorBody;
      if (typeof data.message === "string" && data.message) return data.message;
      // RFC 7807 ProblemDetails shape
      if (typeof data.title === "string" && data.title) {
        const fieldErrors =
          typeof data.errors === "object" && data.errors !== null
            ? Object.values(data.errors as Record<string, unknown>).flat()
            : [];
        const messages = fieldErrors.filter((e): e is string => typeof e === "string" && !!e);
        return messages.length ? messages.join(" ") : data.title;
      }
    }

    if (error.message === "Network Error") {
      return "Cannot reach the server. Check your connection and try again.";
    }
    if (error.message) return error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return FALLBACK;
}
