const ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseISODateLocal(dateStr: string): Date | null {
  const match = ISO_DATE_REGEX.exec(dateStr);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(year, month - 1, day);
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function normalizeISODate(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  return parseISODateLocal(dateStr) ? dateStr : undefined;
}

export function formatISODateDisplay(
  dateStr: string,
  locale = "ja-JP",
): string | null {
  const date = parseISODateLocal(dateStr);
  if (!date) return null;

  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}
