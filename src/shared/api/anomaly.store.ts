import { anomaliesMock } from './mocks/anomalies';
import type { Anomaly } from './anomaly.schema';

type AnomalyRecord = Anomaly;

let anomalies: AnomalyRecord[] = anomaliesMock;
let nextSpawnAt = Date.now() + Math.floor(Math.random() * 11_000) + 7_000;
let anomalyCounter = anomalies.length;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const computeThreatLevel = (energy: number): AnomalyRecord['threatLevel'] => {
  if (energy >= 90) return 'critical';
  if (energy >= 70) return 'high';
  if (energy >= 40) return 'medium';
  return 'low';
};

const driftEnergy = (anomaly: AnomalyRecord) => {
  if (anomaly.status === 'captured') {
    anomaly.energyLevel = clamp(anomaly.energyLevel - 4, 0, 100);
    anomaly.threatLevel = computeThreatLevel(anomaly.energyLevel);
    return;
  }

  const delta = Math.floor(Math.random() * 11) - 5; // -5..+5
  const nextEnergy = clamp(anomaly.energyLevel + delta, 5, 100);
  if (nextEnergy !== anomaly.energyLevel) {
    anomaly.energyLevel = nextEnergy;
    anomaly.lastSeenAt = new Date().toISOString();
    anomaly.threatLevel = computeThreatLevel(nextEnergy);
  }
};

const removeAfterDelay = (id: string, delayMs: number) => {
  setTimeout(() => {
    anomalies = anomalies.filter((item) => item.id !== id);
  }, delayMs);
};

const districts = ['Shinjuku', 'Shibuya', 'Sumida', 'Nakano', 'Meguro', 'Chiyoda', 'Setagaya'];
const codenames = [
  'Glass-Eyed Oni',
  'Neon Wisp',
  'Lantern Wraith',
  'Chrome Tengu',
  'Whispering Kappa',
  'Signal Kitsune',
  'Pulse Bakeneko',
];

const spawnAnomaly = (now: number) => {
  const energyLevel = clamp(Math.floor(Math.random() * 80) + 20, 5, 100);
  const threatLevel = computeThreatLevel(energyLevel);
  const name = codenames[Math.floor(Math.random() * codenames.length)];
  const district = districts[Math.floor(Math.random() * districts.length)];
  anomalyCounter += 1;
  const id = `knd-${(anomalyCounter + 100).toString().padStart(3, '0')}`;

  const anomaly: AnomalyRecord = {
    id,
    name,
    district,
    energyLevel,
    threatLevel,
    status: 'active',
    lastSeenAt: new Date(now).toISOString(),
  };

  anomalies = [anomaly, ...anomalies];
  nextSpawnAt = now + Math.floor(Math.random() * 11_000) + 7_000; // 7-18 seconds
};

export const listAnomalies = async (): Promise<AnomalyRecord[]> => {
  const now = Date.now();
  anomalies = anomalies.filter(
    (item) => !item.resolvedAt || now - new Date(item.resolvedAt).getTime() < 20_000,
  );
  if (now >= nextSpawnAt) {
    spawnAnomaly(now);
  }
  anomalies.forEach(driftEnergy);
  return anomalies;
};

export const deploySquadToAnomaly = async (id: string): Promise<AnomalyRecord | null> => {
  const target = anomalies.find((item) => item.id === id);
  if (!target) return null;

  if (Math.random() < 0.3) {
    throw new Error('Sensor mesh link failed — squad dispatch aborted');
  }

  target.status = 'captured';
  target.resolvedAt = new Date().toISOString();
  removeAfterDelay(id, 20_000);

  return target;
};

export const updateAnomalyStatus = async (
  id: string,
  status: AnomalyRecord['status'],
): Promise<AnomalyRecord | null> => {
  const target = anomalies.find((item) => item.id === id);
  if (!target) return null;

  target.status = status;
  if (status === 'captured') {
    target.resolvedAt = new Date().toISOString();
    removeAfterDelay(id, 20_000);
  } else {
    delete target.resolvedAt;
  }

  // Recompute threat to reflect current energy.
  target.threatLevel = computeThreatLevel(target.energyLevel);
  return target;
};

export const randomThreatPulse = (): AnomalyRecord | null => {
  if (!anomalies.length) return null;
  const index = Math.floor(Math.random() * anomalies.length);
  const target = anomalies[index];
  if (!target) return null;

  const delta = Math.floor(Math.random() * 30) - 10; // -10..+19
  target.energyLevel = clamp(target.energyLevel + delta, 5, 100);
  target.threatLevel = computeThreatLevel(target.energyLevel);
  target.lastSeenAt = new Date().toISOString();
  return target;
};
