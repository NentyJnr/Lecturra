import axios from "axios";

const FALLBACK = "Something went wrong. Please try again.";

interface ErrorBody {
  message?: unknown;
  title?: unknown;
  errors?: unknown;
}

// Boundary parser: API error may be AxiosError | Error | stringified payload; parse at call site then branch on domain
/** Extract a human-readable message from an API error (ASP.NET ProblemDetails or { message }). */
export function getApiErrorMessage(error: Error): string {
  if (axios.isAxiosError(error)) {
    const raw: unknown = error.response?.data;
    const status = error.response?.status;

    if (Object.prototype.toString.call(raw) === "[object String]") {
      // SAFETY: string discriminant via Object.prototype.toString.call proves raw is string
      const trimmed = (raw as string).trim();
      if (trimmed.startsWith("<") || trimmed.includes("<!DOCTYPE") || trimmed.includes("<html")) {
        if (status === 404) return "API endpoint or server route not found (404).";
        if (status === 500) return "Internal server error (500). Please try again later.";
        if (status === 502 || status === 503 || status === 504) return "Server is temporarily unavailable. Please try again later.";
        return error.response?.statusText || FALLBACK;
      }
      return trimmed || FALLBACK;
    }

    if (Object.prototype.toString.call(raw) === "[object Object]") {
      // SAFETY: Object.prototype.toString proves raw is Record<string, unknown>, ErrorBody is structural subset
      const data = raw as ErrorBody;
      if (Object.prototype.toString.call(data.message) === "[object String]" && data.message) {
        // SAFETY: string discriminant via Object.prototype.toString
        return data.message as string;
      }
      // RFC 7807 ProblemDetails shape
      if (Object.prototype.toString.call(data.title) === "[object String]" && data.title) {
        // SAFETY: string discriminant via Object.prototype.toString
        const rawTitle = data.title as string;
        // SAFETY: ProblemDetails errors is Record<string, string[]>, validated via isRecord check
        const fieldErrors =
          Object.prototype.toString.call(data.errors) === "[object Object]"
            ? Object.values(data.errors as Record<string, string[]>).flat()
            : [];
        const messages = fieldErrors.filter(
          (e): e is string => Object.prototype.toString.call(e) === "[object String]" && !!e,
        );
        return messages.length ? messages.join(" ") : rawTitle;
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
