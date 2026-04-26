import { getAuthApiBaseUrl } from "../../auth/api/auth.api";
import { requestJson } from "../../../shared/api/http";
import type { DateRangeValue } from "../../../shared/ui/DateRangeSelector";

export async function getDashboardApi(
  period: DateRangeValue,
  options?: { signal?: AbortSignal; accessToken?: string },
): Promise<unknown> {
  const params = new URLSearchParams({
    Period: period,
  });

  return requestJson<unknown>(`/api/Dashboard?${params.toString()}`, {
    method: "GET",
    signal: options?.signal,
    baseUrl: getAuthApiBaseUrl(),
    withAuth: true,
    accessToken: options?.accessToken,
  });
}
