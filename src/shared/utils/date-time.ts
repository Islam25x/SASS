const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const DATE_TIME_WITHOUT_ZONE_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/;

const HAS_EXPLICIT_TIMEZONE_PATTERN = /(Z|[+-]\d{2}:\d{2})$/i;

function buildUtcDate(
  year: number,
  month: number,
  day: number,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
): Date | null {
  const candidate = new Date(
    Date.UTC(
      year,
      month - 1,
      day,
      hours,
      minutes,
      seconds,
      milliseconds,
    ),
  );

  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day ||
    candidate.getUTCHours() !== hours ||
    candidate.getUTCMinutes() !== minutes ||
    candidate.getUTCSeconds() !== seconds ||
    candidate.getUTCMilliseconds() !== milliseconds
  ) {
    return null;
  }

  return candidate;
}

function buildLocalDate(
  year: number,
  month: number,
  day: number,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
): Date | null {
  const candidate = new Date(
    year,
    month - 1,
    day,
    hours,
    minutes,
    seconds,
    milliseconds,
  );

  if (
    candidate.getFullYear() !== year ||
    candidate.getMonth() !== month - 1 ||
    candidate.getDate() !== day ||
    candidate.getHours() !== hours ||
    candidate.getMinutes() !== minutes ||
    candidate.getSeconds() !== seconds ||
    candidate.getMilliseconds() !== milliseconds
  ) {
    return null;
  }

  return candidate;
}

function padNumber(value: number): string {
  return `${value}`.padStart(2, "0");
}

function isValidDate(value: Date): boolean {
  return !Number.isNaN(value.getTime());
}

function parseDateParts(
  value: string,
  pattern: RegExp,
): RegExpMatchArray | null {
  return value.match(pattern);
}

export function parseBackendTimestamp(
  value?: string | null,
): Date | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return null;
  }

  const dateOnlyMatch = parseDateParts(
    normalizedValue,
    DATE_ONLY_PATTERN,
  );

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;

    return buildUtcDate(
      Number(year),
      Number(month),
      Number(day),
    );
  }

  const noZoneDateTimeMatch = parseDateParts(
    normalizedValue,
    DATE_TIME_WITHOUT_ZONE_PATTERN,
  );

  if (
    noZoneDateTimeMatch &&
    !HAS_EXPLICIT_TIMEZONE_PATTERN.test(normalizedValue)
  ) {
    const [
      ,
      year,
      month,
      day,
      hours,
      minutes,
      seconds = "0",
      milliseconds = "0",
    ] = noZoneDateTimeMatch;

    return buildUtcDate(
      Number(year),
      Number(month),
      Number(day),
      Number(hours),
      Number(minutes),
      Number(seconds),
      Number(milliseconds.padEnd(3, "0")),
    );
  }

  const parsed = new Date(normalizedValue);

  if (!isValidDate(parsed)) {
    return null;
  }

  return parsed;
}

export function parseLocalDateTimeInput(
  value?: string | null,
): Date | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return null;
  }

  const dateOnlyMatch = parseDateParts(
    normalizedValue,
    DATE_ONLY_PATTERN,
  );

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;

    return buildLocalDate(
      Number(year),
      Number(month),
      Number(day),
    );
  }

  const localDateTimeMatch = parseDateParts(
    normalizedValue,
    DATE_TIME_WITHOUT_ZONE_PATTERN,
  );

  if (localDateTimeMatch) {
    const [
      ,
      year,
      month,
      day,
      hours,
      minutes,
      seconds = "0",
      milliseconds = "0",
    ] = localDateTimeMatch;

    return buildLocalDate(
      Number(year),
      Number(month),
      Number(day),
      Number(hours),
      Number(minutes),
      Number(seconds),
      Number(milliseconds.padEnd(3, "0")),
    );
  }

  const parsed = new Date(normalizedValue);

  if (!isValidDate(parsed)) {
    return null;
  }

  return parsed;
}

export function formatDateForDateTimeLocal(
  date: Date,
): string {
  return `${date.getFullYear()}-${padNumber(
    date.getMonth() + 1,
  )}-${padNumber(date.getDate())}T${padNumber(
    date.getHours(),
  )}:${padNumber(date.getMinutes())}`;
}

export function formatNowForDateTimeLocal(): string {
  return formatDateForDateTimeLocal(new Date());
}

export function formatBackendTimestampForDateTimeLocalInput(
  value?: string | null,
): string {
  const parsedDate = parseBackendTimestamp(value);

  if (!parsedDate) {
    return formatNowForDateTimeLocal();
  }

  return formatDateForDateTimeLocal(parsedDate);
}

export function toMonthKeyFromBackendTimestamp(
  value?: string | null,
): string {
  const parsed = parseBackendTimestamp(value);

  if (!parsed) {
    return "";
  }

  return `${parsed.getFullYear()}-${padNumber(
    parsed.getMonth() + 1,
  )}`;
}

export const localDateTimeFormatter =
  new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

export function formatBackendTimestampForDisplay(
  value?: string | null,
): string {
  const parsed = parseBackendTimestamp(value);

  if (!parsed) {
    return "N/A";
  }

  const adjustedDate = new Date(
    parsed.getTime() + 2 * 60 * 60 * 1000,
  );

  return localDateTimeFormatter.format(adjustedDate);
}