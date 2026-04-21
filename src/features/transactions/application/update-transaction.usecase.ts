import { ApiError } from "../../../shared/api/api-error";
import type { AddTransactionInput } from "../types/add-transaction.types";
import { updateTransactionApi } from "../api/update-transaction.api";
import { mapTransactionInputToPayload } from "./add-transaction.usecase";

export async function updateTransactionUseCase(
  transactionId: string,
  input: AddTransactionInput,
  options?: { signal?: AbortSignal },
): Promise<void> {
  const normalizedTransactionId = transactionId.trim();

  if (!normalizedTransactionId) {
    throw new ApiError("Transaction id is required.", 400, "INVALID_RESPONSE");
  }

  await updateTransactionApi(normalizedTransactionId, mapTransactionInputToPayload(input), options);
}
