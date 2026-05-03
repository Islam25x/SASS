import { formatTransactionTimestampForDisplay } from "./transaction-dates";

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatTransactionDate(
  value?: string | null,
  options?: Intl.DateTimeFormatOptions,
) {
  return formatTransactionTimestampForDisplay(value, options);
}
