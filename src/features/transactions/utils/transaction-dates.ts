import {
  formatBackendTimestampForDateTimeInput,
  formatDateForDateTimeLocal,
  formatNowForDateTimeLocal,
  getCairoMonthKey,
  parseBackendTimestamp,
  parseLocalDateTimeInput,
} from "../../../shared/utils/date-time";

export function parseTransactionDate(value?: string | null): Date | null {
  return parseBackendTimestamp(value);
}

export function parseTransactionDateTimeLocalInput(value?: string | null): Date | null {
  return parseLocalDateTimeInput(value);
}

export function parseDateTimeLocalValue(value: string): string {
  return formatBackendTimestampForDateTimeInput(value);
}

export { formatDateForDateTimeLocal, formatNowForDateTimeLocal };

export function toTransactionMonthKey(value?: string): string {
  return getCairoMonthKey(value);
}
