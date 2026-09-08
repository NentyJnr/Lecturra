/** Backend root, e.g. https://localhost:7001 — endpoints already include /api/v1/.... */
export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/$/, "");
  }
  return "https://localhost:7001";
}
