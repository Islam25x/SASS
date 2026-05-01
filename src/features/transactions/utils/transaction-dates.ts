import {
  formatBackendTimestampForDateTimeLocalInput,
  formatDateForDateTimeLocal,
  formatNowForDateTimeLocal,
  parseBackendTimestamp,
  parseLocalDateTimeInput,
  toMonthKeyFromBackendTimestamp,
} from "../../../shared/utils/date-time";

export function parseTransactionDate(value?: string | null): Date | null {
  return parseBackendTimestamp(value);
}

export function parseTransactionDateTimeLocalInput(value?: string | null): Date | null {
  return parseLocalDateTimeInput(value);
}

export function parseDateTimeLocalValue(value: string): string {
  return formatBackendTimestampForDateTimeLocalInput(value);
}

export { formatDateForDateTimeLocal, formatNowForDateTimeLocal };

export function toTransactionMonthKey(value?: string): string {
  return toMonthKeyFromBackendTimestamp(value);
}

export function formatTransactionMonthKeyFromDate(date: Date): string {
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}`;
}
