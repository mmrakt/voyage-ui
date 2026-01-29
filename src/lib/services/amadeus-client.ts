import Amadeus from "amadeus";
import { env } from "@/lib/env";

let amadeusClient: Amadeus | null = null;

export function getAmadeusClient(): Amadeus {
  if (!amadeusClient) {
    amadeusClient = new Amadeus({
      clientId: env.AMADEUS_CLIENT_ID,
      clientSecret: env.AMADEUS_CLIENT_SECRET,
      hostname: env.AMADEUS_HOSTNAME,
    });
  }
  return amadeusClient;
}

// 日本の主要空港コードマッピング
const AIRPORT_CODES: Record<string, string> = {
  東京: "TYO",
  成田: "NRT",
  羽田: "HND",
  大阪: "OSA",
  関西: "KIX",
  伊丹: "ITM",
  京都: "KIX", // 京都は関西空港を使用
  名古屋: "NGO",
  中部: "NGO",
  福岡: "FUK",
  札幌: "CTS",
  新千歳: "CTS",
  那覇: "OKA",
  沖縄: "OKA",
  神戸: "UKB",
  広島: "HIJ",
  仙台: "SDJ",
  鹿児島: "KOJ",
  熊本: "KMJ",
  長崎: "NGS",
  宮崎: "KMI",
  松山: "MYJ",
  高松: "TAK",
  小松: "KMQ",
  金沢: "KMQ", // 金沢は小松空港を使用
  新潟: "KIJ",
  富山: "TOY",
  // 海外主要都市
  ニューヨーク: "NYC",
  ロサンゼルス: "LAX",
  サンフランシスコ: "SFO",
  ロンドン: "LON",
  パリ: "PAR",
  ソウル: "ICN",
  台北: "TPE",
  香港: "HKG",
  シンガポール: "SIN",
  バンコク: "BKK",
  ハワイ: "HNL",
  ホノルル: "HNL",
  グアム: "GUM",
  上海: "SHA",
  北京: "PEK",
  シドニー: "SYD",
};

export function getAirportCode(cityName: string): string | null {
  // 完全一致を先にチェック
  if (AIRPORT_CODES[cityName]) {
    return AIRPORT_CODES[cityName];
  }

  // 部分一致をチェック
  for (const [city, code] of Object.entries(AIRPORT_CODES)) {
    if (cityName.includes(city)) {
      return code;
    }
  }

  return null;
}

export interface AmadeusFlightOffer {
  id: string;
  price: {
    total: string;
    currency: string;
  };
  itineraries: {
    duration: string;
    segments: {
      departure: {
        iataCode: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        at: string;
      };
      carrierCode: string;
      operating?: {
        carrierCode: string;
      };
    }[];
  }[];
  validatingAirlineCodes: string[];
}

// 航空会社コードから名前へのマッピング
const AIRLINE_NAMES: Record<string, string> = {
  NH: "ANA",
  JL: "JAL",
  BC: "スカイマーク",
  MM: "Peach",
  JW: "バニラエア",
  "7G": "スターフライヤー",
  NU: "ジャパントランスオーシャン",
  GK: "ジェットスター・ジャパン",
  DJ: "エアアジア・ジャパン",
  FW: "アイベックスエアラインズ",
  HD: "エア・ドゥ",
  SN: "ソラシドエア",
  AA: "アメリカン航空",
  UA: "ユナイテッド航空",
  DL: "デルタ航空",
  BA: "ブリティッシュ・エアウェイズ",
  AF: "エールフランス",
  KE: "大韓航空",
  OZ: "アシアナ航空",
  CI: "チャイナエアライン",
  BR: "エバー航空",
  CX: "キャセイパシフィック",
  SQ: "シンガポール航空",
  TG: "タイ国際航空",
  CA: "中国国際航空",
  MU: "中国東方航空",
  QF: "カンタス航空",
};

export function getAirlineName(carrierCode: string): string {
  return AIRLINE_NAMES[carrierCode] || carrierCode;
}

// 日付ユーティリティを再エクスポート
export {
  formatDuration,
  formatTime,
  getTomorrowDate,
} from "@/lib/utils/date";
