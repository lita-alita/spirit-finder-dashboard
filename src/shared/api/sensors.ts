import { sensorPingSchema } from './sensors.schema';

export const pingSensorMesh = async () => {
  const latencyMs = Math.floor(Math.random() * 120) + 30; // 30-150ms
  const statusRoll = Math.random();
  const status =
    statusRoll > 0.9 ? 'degraded' : statusRoll > 0.97 ? 'offline' : ('online' as const);

  const payload = {
    status,
    latencyMs,
    refreshedAt: new Date().toISOString(),
    refreshedCount: Math.floor(Math.random() * 4) + 1, // 1-4 nodes replied
  };

  const validated = sensorPingSchema.parse(payload);
  await new Promise((resolve) => setTimeout(resolve, latencyMs));
  return validated;
};
