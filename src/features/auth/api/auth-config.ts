const DEFAULT_AUTH_API_BASE_URL = "https://finexa.runasp.net";

export const AUTH_API_BASE_URL =
  import.meta.env.VITE_FINEXA_API_BASE_URL?.trim() || DEFAULT_AUTH_API_BASE_URL;

export function getAuthApiBaseUrl(): string {
  return AUTH_API_BASE_URL;
}
