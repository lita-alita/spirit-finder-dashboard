import { NextResponse } from 'next/server';
import { anomalySchema } from '@/shared/api/anomaly.schema';
import { randomThreatPulse } from '@/shared/api/anomaly.store';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const push = () => {
        const updated = randomThreatPulse();
        if (!updated) return;
        const payload = JSON.stringify(anomalySchema.parse(updated));
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
      };

      push();
      const interval = setInterval(push, 5_000);

      const close = () => {
        clearInterval(interval);
        controller.close();
      };

      controller.enqueue(encoder.encode(': connected\n\n'));
      const timer = setTimeout(() => {
        controller.enqueue(encoder.encode(': keep-alive\n\n'));
      }, 30_000);

      const abortHandler = () => {
        clearTimeout(timer);
        close();
      };

      req.signal.addEventListener('abort', abortHandler);
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
