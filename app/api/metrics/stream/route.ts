import { auth } from "@/auth";
import { currentValue, type MetricName } from "@/lib/data/system";

export const dynamic = "force-dynamic";

const METRIC_NAMES: MetricName[] = ["CPU", "MEMORY", "LATENCY_P50", "LATENCY_P95", "ERROR_RATE", "REQUESTS_PER_MIN"];

function jitter(base: number, spread: number) {
  return Math.max(0, base + (Math.random() - 0.5) * spread);
}

export async function GET() {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const encoder = new TextEncoder();
  let interval: ReturnType<typeof setInterval>;

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      send({ type: "connected" });

      interval = setInterval(() => {
        const tick = Object.fromEntries(
          METRIC_NAMES.map((name) => {
            const base = currentValue(name);
            const spread = name === "ERROR_RATE" ? 0.3 : name === "REQUESTS_PER_MIN" ? 900 : base * 0.12 + 2;
            return [name, Math.round(jitter(base, spread) * 100) / 100];
          })
        );
        send({ type: "tick", timestamp: new Date().toISOString(), values: tick });
      }, 2500);
    },
    cancel() {
      clearInterval(interval);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
