# Voyage UI MVP 実装計画

## 概要
フライト検索機能を持つGenerative UI旅行計画エージェントのMVP実装

## 技術スタック
- Next.js 16.1.4 (App Router)
- React 19.2.3
- Vercel AI SDK (`ai`, `@ai-sdk/rsc`, `@ai-sdk/anthropic`)
- Tailwind CSS 4
- Zod (バリデーション)
- Vitest (テスト)
- Bun (パッケージマネージャー)

---

## ディレクトリ構成

```
app/
├── page.tsx              # チャットUI (Client Component)
├── layout.tsx            # RootLayout + AI Provider
├── actions.tsx           # Server Actions (continueConversation)
├── ai.tsx                # createAI設定
├── globals.css
└── favicon.ico
lib/
├── tools/
│   ├── flight.ts         # フライト検索ツール定義
│   └── flight.test.ts    # ツールのテスト
├── services/
│   ├── flight-api.ts     # 実API/モック切り替えロジック
│   ├── flight-api.test.ts
│   └── mock-data.ts      # モックデータ
└── types.ts              # 共通型定義
components/
├── chat/
│   ├── chat-input.tsx    # 入力フォーム
│   └── message-list.tsx  # メッセージ一覧
├── flight/
│   ├── flight-card.tsx   # フライトカード
│   └── flight-list.tsx   # フライト一覧
└── ui/
    └── spinner.tsx       # ローディング
```

---

## 実装タスク

### Phase 1: プロジェクト基盤 (依存関係・設定)

**Task 1.1: 依存パッケージのインストール**
```bash
bun add ai @ai-sdk/rsc @ai-sdk/anthropic zod
bun add -d vitest @testing-library/react @vitejs/plugin-react happy-dom
```

**Task 1.2: 環境変数設定**
- `.env.local` (gitignore済み)
- `.env.example` (テンプレート)

```env
ANTHROPIC_API_KEY=your_key
USE_MOCK_API=true  # true: モック, false: 実API
```

**Task 1.3: Vitest設定**
- `vitest.config.ts` 作成

---

### Phase 2: 型定義・サービス層

**Task 2.1: 型定義 (`lib/types.ts`)**
```typescript
export interface Flight {
  id: string;
  airline: string;
  price: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
}

export interface FlightSearchResult {
  destination: string;
  flights: Flight[];
}

export interface ServerMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClientMessage {
  id: string;
  role: 'user' | 'assistant';
  display: React.ReactNode;
}
```

**Task 2.2: モックデータ (`lib/services/mock-data.ts`)**
- 目的地ごとのサンプルフライトデータ

**Task 2.3: フライトAPIサービス (`lib/services/flight-api.ts`)**
- `USE_MOCK_API` 環境変数で切り替え
- モック: `mock-data.ts` から返却
- 実API: Google Flights API等 (将来実装用のインターフェース)

---

### Phase 3: AI SDK統合

**Task 3.1: ツール定義 (`lib/tools/flight.ts`)**
```typescript
export const searchFlightsTool = {
  description: '指定した目的地へのフライトを検索します',
  parameters: z.object({
    destination: z.string().describe('目的地の都市名'),
  }),
};
```

**Task 3.2: createAI設定 (`app/ai.tsx`)**
- AIState / UIState の型定義
- `continueConversation` アクションの登録

**Task 3.3: Server Action (`app/actions.tsx`)**
- `streamUI` でLLMと対話
- `searchFlights` ツールでフライト検索
- ローディング → 結果UIをストリーミング

---

### Phase 4: UIコンポーネント

**Task 4.1: Spinner (`components/ui/spinner.tsx`)**
- ローディング表示

**Task 4.2: FlightCard (`components/flight/flight-card.tsx`)**
- 航空会社、価格、時間を表示

**Task 4.3: FlightList (`components/flight/flight-list.tsx`)**
- FlightCardの一覧表示

**Task 4.4: ChatInput (`components/chat/chat-input.tsx`)**
- 入力フォーム

**Task 4.5: MessageList (`components/chat/message-list.tsx`)**
- 会話履歴表示

**Task 4.6: メインページ (`app/page.tsx`)**
- `useUIState`, `useActions` で状態管理
- ChatInput + MessageList 統合

**Task 4.7: レイアウト更新 (`app/layout.tsx`)**
- AI Provider でラップ

---

### Phase 5: テスト

**Task 5.1: サービス層テスト**
- `lib/services/flight-api.test.ts`
- モック/実API切り替えロジック

**Task 5.2: ツールテスト**
- `lib/tools/flight.test.ts`
- パラメータバリデーション

**Task 5.3: コンポーネントテスト**
- FlightCard, Spinner の描画テスト

---

## 検証方法

1. **開発サーバー起動**
   ```bash
   bun dev
   ```

2. **動作確認**
   - `http://localhost:3000` にアクセス
   - 「京都へのフライトを探して」と入力
   - ローディング → フライト一覧が表示されることを確認

3. **テスト実行**
   ```bash
   bun test
   ```

4. **モック/実API切り替え確認**
   - `USE_MOCK_API=true` → モックデータ
   - `USE_MOCK_API=false` → 実API (未実装時はエラー)

---

## 変更対象ファイル一覧

### 新規作成
- `lib/types.ts`
- `lib/services/mock-data.ts`
- `lib/services/flight-api.ts`
- `lib/services/flight-api.test.ts`
- `lib/tools/flight.ts`
- `lib/tools/flight.test.ts`
- `app/ai.tsx`
- `app/actions.tsx`
- `components/ui/spinner.tsx`
- `components/flight/flight-card.tsx`
- `components/flight/flight-list.tsx`
- `components/chat/chat-input.tsx`
- `components/chat/message-list.tsx`
- `.env.example`
- `vitest.config.ts`

### 修正
- `app/page.tsx` (全面書き換え)
- `app/layout.tsx` (AI Provider追加)
- `package.json` (依存追加)

---

## 注意事項

1. **API Key管理**: `ANTHROPIC_API_KEY` は `.env.local` に設定し、gitにコミットしない
2. **Vercel制限**: サーバーレス関数のタイムアウト (10秒) を考慮
3. **AI SDK RSC**: 実験的機能のため、将来的にAPIが変更される可能性あり
