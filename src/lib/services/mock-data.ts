import type { Flight } from "@/lib/types";

const destinations: Record<string, Flight[]> = {
  京都: [
    {
      id: "KYO-001",
      airline: "ANA",
      price: 25000,
      departureTime: "08:00",
      arrivalTime: "09:15",
      duration: "1時間15分",
    },
    {
      id: "KYO-002",
      airline: "JAL",
      price: 28000,
      departureTime: "10:30",
      arrivalTime: "11:45",
      duration: "1時間15分",
    },
    {
      id: "KYO-003",
      airline: "スカイマーク",
      price: 18000,
      departureTime: "14:00",
      arrivalTime: "15:20",
      duration: "1時間20分",
    },
  ],
  大阪: [
    {
      id: "OSA-001",
      airline: "ANA",
      price: 22000,
      departureTime: "07:00",
      arrivalTime: "08:10",
      duration: "1時間10分",
    },
    {
      id: "OSA-002",
      airline: "JAL",
      price: 24000,
      departureTime: "09:30",
      arrivalTime: "10:40",
      duration: "1時間10分",
    },
    {
      id: "OSA-003",
      airline: "Peach",
      price: 12000,
      departureTime: "12:00",
      arrivalTime: "13:15",
      duration: "1時間15分",
    },
  ],
  札幌: [
    {
      id: "SPK-001",
      airline: "ANA",
      price: 35000,
      departureTime: "06:30",
      arrivalTime: "08:20",
      duration: "1時間50分",
    },
    {
      id: "SPK-002",
      airline: "JAL",
      price: 38000,
      departureTime: "11:00",
      arrivalTime: "12:50",
      duration: "1時間50分",
    },
    {
      id: "SPK-003",
      airline: "エアドゥ",
      price: 25000,
      departureTime: "15:30",
      arrivalTime: "17:25",
      duration: "1時間55分",
    },
  ],
  福岡: [
    {
      id: "FUK-001",
      airline: "ANA",
      price: 30000,
      departureTime: "08:00",
      arrivalTime: "10:00",
      duration: "2時間",
    },
    {
      id: "FUK-002",
      airline: "JAL",
      price: 32000,
      departureTime: "12:00",
      arrivalTime: "14:00",
      duration: "2時間",
    },
    {
      id: "FUK-003",
      airline: "スターフライヤー",
      price: 22000,
      departureTime: "16:00",
      arrivalTime: "18:05",
      duration: "2時間5分",
    },
  ],
  沖縄: [
    {
      id: "OKA-001",
      airline: "ANA",
      price: 45000,
      departureTime: "07:00",
      arrivalTime: "09:45",
      duration: "2時間45分",
    },
    {
      id: "OKA-002",
      airline: "JAL",
      price: 48000,
      departureTime: "10:00",
      arrivalTime: "12:50",
      duration: "2時間50分",
    },
    {
      id: "OKA-003",
      airline: "ソラシドエア",
      price: 32000,
      departureTime: "14:00",
      arrivalTime: "16:50",
      duration: "2時間50分",
    },
  ],
};

const defaultFlights: Flight[] = [
  {
    id: "DEF-001",
    airline: "ANA",
    price: 30000,
    departureTime: "09:00",
    arrivalTime: "11:00",
    duration: "2時間",
  },
  {
    id: "DEF-002",
    airline: "JAL",
    price: 32000,
    departureTime: "13:00",
    arrivalTime: "15:00",
    duration: "2時間",
  },
];

export function getMockFlights(destination: string): Flight[] {
  const normalizedDest = destination.trim();

  for (const [key, flights] of Object.entries(destinations)) {
    if (normalizedDest.includes(key) || key.includes(normalizedDest)) {
      return flights;
    }
  }

  return defaultFlights;
}
