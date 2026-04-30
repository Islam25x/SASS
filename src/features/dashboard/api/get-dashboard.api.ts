import { getAppApiBaseUrl } from "../../../infrastructure/api/api-config";
import { requestJson } from "../../../infrastructure/api/http";
import type { DateRangeValue } from "../../../shared/ui/DateRangeSelector";

export async function getDashboardApi(
  period: DateRangeValue,
  options?: { signal?: AbortSignal },
): Promise<unknown> {
  const params = new URLSearchParams({
    Period: period,
  });

  return requestJson<unknown>(`/api/Dashboard?${params.toString()}`, {
    method: "GET",
    signal: options?.signal,
    baseUrl: getAppApiBaseUrl(),
    withAuth: true,
  });
}
