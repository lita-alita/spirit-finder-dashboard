import { z } from 'zod';

export const sensorPingSchema = z.object({
  status: z.enum(['online', 'degraded', 'offline']),
  latencyMs: z.number().int().nonnegative(),
  refreshedAt: z.string().datetime(),
  refreshedCount: z.number().int().nonnegative(),
});

export type SensorPing = z.infer<typeof sensorPingSchema>;
