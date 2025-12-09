import type { Anomaly } from '../anomaly.schema';

export const anomaliesMock = [
  {
    id: 'knd-001',
    name: 'Neon Wisp Cluster',
    district: 'Shinjuku',
    energyLevel: 72,
    threatLevel: 'medium',
    status: 'active',
    lastSeenAt: '2024-12-08T22:14:00Z',
  },
  {
    id: 'knd-014',
    name: 'Glass-Eyed Oni',
    district: 'Shibuya',
    energyLevel: 91,
    threatLevel: 'high',
    status: 'deploying',
    lastSeenAt: '2024-12-08T22:09:00Z',
  },
  {
    id: 'knd-019',
    name: 'Whistling Kappa',
    district: 'Sumida',
    energyLevel: 54,
    threatLevel: 'medium',
    status: 'active',
    lastSeenAt: '2024-12-08T21:57:00Z',
  },
  {
    id: 'knd-025',
    name: 'Shadowed Kitsune',
    district: 'Nakano',
    energyLevel: 35,
    threatLevel: 'low',
    status: 'contained',
    lastSeenAt: '2024-12-08T21:45:00Z',
  },
  {
    id: 'knd-031',
    name: 'Pale Lantern Drake',
    district: 'Meguro',
    energyLevel: 64,
    threatLevel: 'medium',
    status: 'deploying',
    lastSeenAt: '2024-12-08T21:35:00Z',
  },
] satisfies Anomaly[];
