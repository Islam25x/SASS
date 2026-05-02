import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";

export async function invalidateTransactionDomainQueries(
  queryClient: QueryClient,
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: queryKeys.transactions.all,
    }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.dashboard.all,
    }),
  ]);
}
