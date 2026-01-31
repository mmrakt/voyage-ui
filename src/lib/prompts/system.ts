function formatCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[now.getDay()];
  return `${year}年${month}月${day}日（${weekday}）`;
}

function getSystemPromptWithTools(currentDate: string): string {
  return `あなたは旅行計画をサポートするAIアシスタントです。
今日の日付は${currentDate}です。
ユーザーがフライトを探している場合は、searchFlightsツールを使用してフライト情報を検索してください。
フライト検索後は、検索結果について簡潔にコメントしてください。
日本語で応答してください。`;
}

function getSystemPromptWithoutTools(currentDate: string): string {
  return `あなたは旅行計画をサポートするAIアシスタントです。
今日の日付は${currentDate}です。
現在使用中のモデルではフライト検索機能が利用できません。
旅行に関する一般的なアドバイスや質問にはお答えできます。
日本語で応答してください。`;
}

export function getSystemPrompt(supportsTools: boolean): string {
  const currentDate = formatCurrentDate();
  return supportsTools
    ? getSystemPromptWithTools(currentDate)
    : getSystemPromptWithoutTools(currentDate);
}
