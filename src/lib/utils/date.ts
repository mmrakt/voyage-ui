import dayjs from "dayjs";

/**
 * 明日の日付をYYYY-MM-DD形式で取得
 */
export function getTomorrowDate(): string {
  return dayjs().add(1, "day").format("YYYY-MM-DD");
}

/**
 * ISO 8601形式の日時をHH:mm形式に変換
 */
export function formatTime(isoDateTime: string): string {
  return dayjs(isoDateTime).format("HH:mm");
}

/**
 * ISO 8601 duration形式（PT2H30M）を日本語形式に変換
 */
export function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return isoDuration;

  const hours = match[1] ? `${match[1]}時間` : "";
  const minutes = match[2] ? `${match[2]}分` : "";

  return `${hours}${minutes}` || isoDuration;
}
