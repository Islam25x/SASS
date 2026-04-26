import { getAuthApiBaseUrl } from "../../auth/api/auth.api";
import { requestJson } from "../../../shared/api/http";

export async function cancelGoalApi(
  goalId: string,
  options?: { signal?: AbortSignal },
): Promise<void> {
  await requestJson<unknown>(`/api/Goal/${encodeURIComponent(goalId)}/cancel`, {
    method: "POST",
    signal: options?.signal,
    baseUrl: getAuthApiBaseUrl(),
    withAuth: true,
  });
}
