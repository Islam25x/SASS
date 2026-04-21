import { getAuthApiBaseUrl } from "../../auth/api/auth.api";
import { requestJson } from "../../../shared/api/http";
import type { AddTransactionType } from "../types/add-transaction.types";

interface CreateCategoryRequestDto {
  name: string;
  type: AddTransactionType;
}

export async function createCategoryApi(
  payload: CreateCategoryRequestDto,
  options?: { signal?: AbortSignal },
): Promise<unknown> {
  return requestJson<unknown>("/api/Category/create-category", {
    method: "POST",
    body: JSON.stringify(payload),
    signal: options?.signal,
    baseUrl: getAuthApiBaseUrl(),
    withAuth: true,
  });
}
