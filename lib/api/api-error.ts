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

    if (typeof raw === "string") {
      return raw || FALLBACK;
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
