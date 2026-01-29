import { configure, getConsoleSink } from "@logtape/logtape";
import { env } from "@/lib/env";

let configured = false;

export async function setupLogger() {
  if (configured) return;

  await configure({
    sinks: {
      console: getConsoleSink(),
    },
    loggers: [
      {
        category: ["voyage-ui"],
        lowestLevel: env.NODE_ENV === "development" ? "debug" : "warning",
        sinks: ["console"],
      },
    ],
  });

  configured = true;
}
