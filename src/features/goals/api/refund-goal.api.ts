import { getAuthApiBaseUrl } from "../../auth/api/auth.api";
import { requestJson } from "../../../infrastructure/api/http";

export async function refundGoalApi(
  goalId: string,
  options?: { signal?: AbortSignal },
): Promise<void> {
  await requestJson<unknown>(`/api/Goal/${encodeURIComponent(goalId)}/refund`, {
    method: "POST",
    signal: options?.signal,
    baseUrl: getAuthApiBaseUrl(),
    withAuth: true,
  });
}
