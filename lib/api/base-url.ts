/** Backend root, e.g. https://api.lecturra.com — endpoints already include /api/v1/.... */
export function getApiBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
}
