import { anomaliesSchema, anomalySchema } from './anomaly.schema';

const apiBase = '';

export const fetchAnomalies = async () => {
  const res = await fetch(`${apiBase}/api/anomalies`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch anomalies');
  }
  const data = await res.json();
  return anomaliesSchema.parse(data);
};

export const deploySquad = async (id: string) => {
  const res = await fetch(`${apiBase}/api/anomalies/capture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = typeof errorData?.error === 'string' ? errorData.error : 'Capture failed';
    throw new Error(message);
  }
  const data = await res.json();
  return anomalySchema.parse(data);
};
