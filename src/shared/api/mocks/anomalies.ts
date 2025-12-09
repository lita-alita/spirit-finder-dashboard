import type { Anomaly } from '../anomaly.schema';

export const anomaliesMock = [
  {
    id: 'knd-001',
    name: 'Neon Wisp Cluster',
    district: 'Shinjuku',
    energyLevel: 72,
    threatLevel: 'medium' as const,
    status: 'active' as const,
    lastSeenAt: '2024-12-08T22:14:00Z',
  },
  {
    id: 'knd-014',
    name: 'Glass-Eyed Oni',
    district: 'Shibuya',
    energyLevel: 91,
    threatLevel: 'high' as const,
    status: 'active' as const,
    lastSeenAt: '2024-12-08T22:09:00Z',
  },
  {
    id: 'knd-019',
    name: 'Whistling Kappa',
    district: 'Sumida',
    energyLevel: 54,
    threatLevel: 'medium' as const,
    status: 'active' as const,
    lastSeenAt: '2024-12-08T21:57:00Z',
  },
  {
    id: 'knd-025',
    name: 'Shadowed Kitsune',
    district: 'Nakano',
    energyLevel: 35,
    threatLevel: 'low' as const,
    status: 'captured' as const,
    lastSeenAt: '2024-12-08T21:45:00Z',
  },
  {
    id: 'knd-031',
    name: 'Pale Lantern Drake',
    district: 'Meguro',
    energyLevel: 64,
    threatLevel: 'medium' as const,
    status: 'active' as const,
    lastSeenAt: '2024-12-08T21:35:00Z',
  },
] satisfies Anomaly[];
