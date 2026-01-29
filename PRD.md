# PRD: Project "Voyage UI" (Unified TS Edition)

## 1. エグゼクティブサマリー

**製品概要:**
Next.jsのエコシステム内で完結する、Generative UI × MCP搭載の旅行計画エージェント。
ユーザーの要望に応じて、地図・ホテルカード・工程表などのReactコンポーネントをストリーミング生成し、シームレスな旅行計画体験を提供する。

**技術的特徴:**

* **Full-Stack TypeScript:** MCPサーバーの実装をRustからNode.js/TypeScriptに変更し、Next.jsプロジェクトとの親和性を最大化。
* **Serverless Ready:** Vercel等のエッジ/サーバーレス環境での動作を想定したアーキテクチャ。

---

## 2. コア機能要件 (変更なし)

* **対話型プランニング:** 自然言語による条件抽出。
* **Generative UI:**
* **Dynamic Map:** Mapbox/Google Mapsを用いた動的ピン留め。
* **Rich Cards:** ホテル・レストランの詳細カード。
* **Itinerary UI:** タイムライン形式の工程表。


* **MCP Integration:** 外部API（Google Places, Booking.com等）への標準化された接続。

---

## 3. 技術アーキテクチャ (Updated Stack)

Rustを排除し、全てをJavaScript/TypeScriptエコシステムで統一しました。

| レイヤー | 技術スタック | 選定理由・役割 |
| --- | --- | --- |
| **Frontend** | **Next.js (App Router)** | アプリケーションの骨格。Server Componentsを活用。 |
| **GenUI** | **Vercel AI SDK (RSC)** | LLMの出力をReactコンポーネントとしてストリーミング配信。 |
| **Client State** | **TanStack Query** | クライアント側での非同期データ取得・キャッシュ管理（地図上のデータ更新など）。 |
| **Orchestration** | **AI SDK Core (`streamUI`)** | LLMとの対話管理およびTool Callingのハンドリング。 |
| **MCP Server** | **Node.js + MCP SDK** | **【変更点】** 公式TypeScript SDK (`@modelcontextprotocol/sdk`) を使用してツールサーバーを構築。 |
| **Communication** | **SSE (Server-Sent Events)** | Next.js APIルートとMCPサーバー間の通信プロトコル（Web標準で扱いやすいため）。 |
| **LLM** | **Claude 3.5 Sonnet** | 複雑なUI生成指示とツール利用に最適なモデル。 |

---

## 4. システム構成図 (概念)

```mermaid
graph TD
    User[User / Browser] <-->|Interactive UI| NextJS[Next.js App Router]
    
    subgraph "Next.js Server Side"
        NextJS <-->|Stream Text & UI| AISDK[Vercel AI SDK]
        AISDK <-->|Tool Call| MCPClient[Internal MCP Client]
    end
    
    subgraph "MCP Layer (TypeScript)"
        MCPClient <-->|SSE / Stdio| TravelMCP[Travel MCP Server (Node.js)]
        TravelMCP <-->|Fetch| APIs[Google Maps / Hotel APIs]
    end

```

---

## 5. 実装のポイント：Next.js中心のアプローチ

バックエンドをNext.js（Node.js）にする場合、MCPサーバーの配置には2つのパターンがあります。今回は開発しやすさを重視した **「パターンA：内部APIルート統合」** を推奨します。

### パターンA: Next.js API Routes as MCP

MCPサーバーロジックをNext.jsのAPIルート（例: `/api/mcp/travel`）として実装し、SSE (Server-Sent Events) で通信します。

* **メリット:** デプロイがVercel一つで完結する。インフラ管理が不要。
* **デメリット:** 実行時間の長い処理（スクレイピング等）はサーバーレス関数のタイムアウト制限に注意が必要。

### パターンB: Monorepo Microservice

Next.jsとは別に、同リポジトリ内の別パッケージとしてExpress/Fastify等のNodeサーバーを立てる。

* **メリット:** 常駐プロセスが必要な重い処理も可能。
* **デメリット:** デプロイ先が別途必要（Railway, Render, VPSなど）。

---

## 6. フェーズ1 (MVP) 実装コード案

最もシンプルな「パターンA」構成で、**「ユーザーが質問すると、裏でMCPツールが動き、結果がリッチなUIで返ってくる」** サンプルです。

### 構成

1. `app/utils/weather-tool.ts`: 疑似的なMCPツールロジック
2. `app/actions.tsx`: Server ActionでAIと対話し、UIを生成 (GenUI)
3. `app/page.tsx`: クライアントUI

#### 1. ツール定義 (疑似MCPレイヤー)

本来はMCP SDKを使いますが、MVPとしてNext.js内部で直接関数として定義し、AI SDKに渡す形が最も早いです。（MCPの思想である「ツール分離」は保ちつつ実装を簡略化）

```typescript
// app/utils/tools.ts
import { z } from 'zod';

// これが実質的なMCPツールの実体
export const getFlightInfo = async (destination: string) => {
  // 実際はここで外部APIを叩く
  await new Promise(resolve => setTimeout(resolve, 1000)); // 疑似レイテンシ
  
  return {
    destination,
    flights: [
      { id: 'ANA123', price: 25000, time: '10:00', airline: 'ANA' },
      { id: 'JAL456', price: 28000, time: '11:30', airline: 'JAL' },
    ]
  };
};

export const flightToolDefinition = {
  description: '指定した目的地のフライト情報を検索します',
  parameters: z.object({
    destination: z.string().describe('目的地の都市名'),
  }),
};

```

#### 2. GenUIの実装 (Server Actions)

```typescript
// app/actions.tsx
'use server';

import { createStreamableUI } from 'ai/rsc';
import { streamUI } from 'ai/rsc';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { getFlightInfo } from './utils/tools';

// UIコンポーネント
import { FlightCard } from '@/components/flight-card'; // クライアントコンポーネント
import { Spinner } from '@/components/spinner';

export async function continueConversation(input: string) {
  const ui = createStreamableUI();

  const result = await streamUI({
    model: anthropic('claude-3-5-sonnet-20240620'),
    system: 'あなたは親切な旅行代理店です。ユーザーの要望に応じてプランを提案してください。',
    messages: [{ role: 'user', content: input }],
    text: ({ content, done }) => {
      if (done) ui.done();
      return <div>{content}</div>;
    },
    tools: {
      searchFlights: {
        description: 'フライトを検索する',
        parameters: z.object({
          destination: z.string().describe('目的地'),
        }),
        generate: async ({ destination }) => {
          // 1. UIをローディング状態にする
          ui.update(<Spinner message={`${destination}へのフライトを検索中...`} />);
          
          // 2. ツール(MCPロジック)実行
          const data = await getFlightInfo(destination);
          
          // 3. 結果に基づきリッチUIをレンダリング
          return (
            <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-lg">{data.destination}行きの便</h3>
              <div className="grid gap-3">
                {data.flights.map((flight) => (
                  // ここにリッチなコンポーネントを配置
                  <FlightCard key={flight.id} {...flight} />
                ))}
              </div>
            </div>
          );
        },
      },
    },
  });

  return {
    id: Date.now(),
    display: result.value,
  };
}

```

#### 3. クライアントサイド (Page)

```typescript
// app/page.tsx
'use client';

import { useState } from 'react';
import { continueConversation } from './actions';
import { useActions, useUIState } from 'ai/rsc';

export default function Home() {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useUIState(); // 会話の状態管理

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="space-y-4 mb-4">
        {conversation.map((message: any) => (
          <div key={message.id}>
            {message.display}
          </div>
        ))}
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setInput('');
          // ユーザーのメッセージを表示に追加
          setConversation((current: any) => [
            ...current,
            { id: Date.now(), display: <div className="bg-blue-100 p-2 rounded">{input}</div> },
          ]);
          
          // Server Actionを呼び出し
          const response = await continueConversation(input);
          setConversation((current: any) => [...current, response]);
        }}
        className="flex gap-2"
      >
        <input
          className="border p-2 flex-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="例: 京都へのフライトを探して"
        />
        <button className="bg-blue-600 text-white p-2 rounded">送信</button>
      </form>
    </div>
  );
}

```
