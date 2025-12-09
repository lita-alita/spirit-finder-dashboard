import { z } from 'zod';

export const anomalySchema = z.object({
  id: z.string(),
  name: z.string(),
  district: z.string(),
  energyLevel: z.number().int().nonnegative(),
  threatLevel: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['active', 'contained', 'deploying']),
  lastSeenAt: z.string().datetime(),
});

export const anomaliesSchema = z.array(anomalySchema);

export type Anomaly = z.infer<typeof anomalySchema>;
