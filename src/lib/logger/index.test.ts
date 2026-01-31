import { configure, type LogRecord } from "@logtape/logtape";
import { beforeEach, describe, expect, it } from "vitest";
import { logLLMResponse } from "./index";

describe("logLLMResponse", () => {
  const logs: LogRecord[] = [];

  beforeEach(async () => {
    logs.length = 0;
    await configure({
      sinks: {
        test: (record: LogRecord) => {
          logs.push(record);
        },
      },
      loggers: [
        {
          category: ["voyage-ui"],
          lowestLevel: "debug",
          sinks: ["test"],
        },
      ],
      reset: true,
    });
  });

  it("logs LLM response with structured data", () => {
    logLLMResponse({
      provider: "claude",
      supportsTools: true,
      input: "test input",
      response: "test response",
      toolResult: null,
    });

    expect(logs).toHaveLength(1);
    expect(logs[0].message).toEqual(["LLM Response"]);
    expect(logs[0].properties).toEqual({
      provider: "claude",
      supportsTools: true,
      input: "test input",
      response: "test response",
      toolResult: null,
    });
  });

  it("logs with flight result when provided", () => {
    const flightResult = {
      destination: "京都",
      departureDate: "2024-03-15",
      flights: [
        {
          id: "1",
          airline: "ANA",
          price: 15000,
          departureTime: "10:00",
          arrivalTime: "11:30",
          duration: "1時間30分",
        },
      ],
    };

    logLLMResponse({
      provider: "gpt",
      supportsTools: true,
      input: "京都へのフライト",
      response: "フライト情報です",
      toolResult: flightResult,
    });

    expect(logs).toHaveLength(1);
    expect(logs[0].properties.toolResult).toEqual(flightResult);
  });
});
