import { getAuthApiBaseUrl } from "../../auth/api/auth.api";
import { requestJson } from "../../../infrastructure/api/http";

const GOALS_PAGE_SIZE = 2;

export async function getGoalsApi(
  pageNumber: number,
  options?: { signal?: AbortSignal; accessToken?: string },
): Promise<unknown> {
  const params = new URLSearchParams({
    PageNumber: String(pageNumber),
    PageSize: String(GOALS_PAGE_SIZE),
  });

  console.log({ pageNumber, pageSize: GOALS_PAGE_SIZE });

  return requestJson<unknown>(`/api/Goal/get-goals?${params.toString()}`, {
    method: "GET",
    signal: options?.signal,
    baseUrl: getAuthApiBaseUrl(),
    withAuth: true,
    accessToken: options?.accessToken,
  });
}
