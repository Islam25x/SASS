import { requestJson } from "../../../infrastructure/api/http";
import { getAuthApiBaseUrl } from "../../auth/api/auth.api";

export type AdjustBalancePayload = {
  targetBalance: number;
};

export type AdjustBalanceResponse = {
  message?: string;
};

export async function adjustBalanceApi(
  payload: AdjustBalancePayload,
  options?: { signal?: AbortSignal },
): Promise<AdjustBalanceResponse> {
  return requestJson<AdjustBalanceResponse>("/api/Transaction/adjust-balance", {
    method: "POST",
    body: JSON.stringify(payload),
    signal: options?.signal,
    baseUrl: getAuthApiBaseUrl(),
    withAuth: true,
  });
}
