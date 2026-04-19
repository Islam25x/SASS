import { ApiError } from "../../../shared/api/api-error";
import { deleteTransactionApi } from "../api/delete-transaction.api";

export async function deleteTransactionUseCase(
  transactionId: string,
  options?: { signal?: AbortSignal },
): Promise<void> {
  const normalizedTransactionId = transactionId.trim();

  if (!normalizedTransactionId) {
    throw new ApiError("Transaction id is required.", 400, "INVALID_RESPONSE");
  }

  await deleteTransactionApi(normalizedTransactionId, options);
}
