import { formatBackendTimestampForDisplay } from "../../../shared/utils/date-time";

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatTransactionDate(value?: string) {
  return formatBackendTimestampForDisplay(value);
}
