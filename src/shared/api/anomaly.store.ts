import { anomaliesMock } from './mocks/anomalies';
import type { Anomaly } from './anomaly.schema';

type AnomalyRecord = Anomaly & {
  resolvedAt?: string;
};

let anomalies: AnomalyRecord[] = anomaliesMock;

const removeAfterDelay = (id: string, delayMs: number) => {
  setTimeout(() => {
    anomalies = anomalies.filter((item) => item.id !== id);
  }, delayMs);
};

export const listAnomalies = async (): Promise<AnomalyRecord[]> => {
  const now = Date.now();
  anomalies = anomalies.filter(
    (item) => !item.resolvedAt || now - new Date(item.resolvedAt).getTime() < 20_000,
  );
  return anomalies;
};

export const deploySquadToAnomaly = async (id: string): Promise<AnomalyRecord | null> => {
  const target = anomalies.find((item) => item.id === id);
  if (!target) return null;

  target.status = 'deploying';

  setTimeout(() => {
    const found = anomalies.find((item) => item.id === id);
    if (!found) return;
    found.status = 'contained';
    found.resolvedAt = new Date().toISOString();
    removeAfterDelay(id, 20_000);
  }, 5_000);

  return target;
};
