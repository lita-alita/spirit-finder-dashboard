import { NextResponse } from 'next/server';
import { anomaliesSchema } from '@/shared/api/anomaly.schema';
import { listAnomalies } from '@/shared/api/anomaly.store';

export async function GET() {
  const data = await listAnomalies();
  const validated = anomaliesSchema.parse(data);
  return NextResponse.json(validated);
}
