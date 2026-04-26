import { getAuthApiBaseUrl } from "../../auth/api/auth.api";
import { requestJson } from "../../../shared/api/http";

export async function contributeGoalApi(
  goalId: string,
  payload: { amount: number },
  options?: { signal?: AbortSignal },
): Promise<void> {
  await requestJson<unknown>(`/api/Goal/${encodeURIComponent(goalId)}/contribute`, {
    method: "POST",
    body: JSON.stringify(payload),
    signal: options?.signal,
    baseUrl: getAuthApiBaseUrl(),
    withAuth: true,
  });
}
