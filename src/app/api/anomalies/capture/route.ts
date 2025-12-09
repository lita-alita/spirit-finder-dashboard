import { NextResponse } from 'next/server';
import { z } from 'zod';
import { anomalySchema } from '@/shared/api/anomaly.schema';
import { deploySquadToAnomaly, listAnomalies } from '@/shared/api/anomaly.store';

const bodySchema = z.object({
  id: z.string(),
});

export async function POST(request: Request) {
  const json = await request.json();
  const { id } = bodySchema.parse(json);

  try {
    await deploySquadToAnomaly(id);
    const updatedItem = (await listAnomalies()).find((item) => item.id === id);
    if (!updatedItem) {
      return NextResponse.json({ error: 'Anomaly not found' }, { status: 404 });
    }
    const validated = anomalySchema.parse(updatedItem);
    return NextResponse.json(validated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
