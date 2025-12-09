'use client';

import { AnomalyMeta } from './anomaly-meta';
import type { Anomaly } from '../model/types';
import styles from './anomaly-card.module.scss';

type Props = {
  anomaly: Anomaly;
};

const threatCopy: Record<Anomaly['threatLevel'], string> = {
  low: 'Low',
  medium: 'Elevated',
  high: 'High',
  critical: 'Critical',
};

export const AnomalyCard = ({ anomaly }: Props) => {
  const threatColor = styles[`threat-${anomaly.threatLevel}`] ?? styles['threat-low'];

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>#{anomaly.id}</p>
          <span className={`${styles.badge} ${threatColor}`}>{threatCopy[anomaly.threatLevel]}</span>
        </div>
        <h3 className={styles.title}>{anomaly.name}</h3>
      </header>

      <AnomalyMeta anomaly={anomaly} className={styles.meta} />

      <div className={styles.energyRow}>
        <span>Energy flux</span>
        <strong>{anomaly.energyLevel}%</strong>
      </div>
      <div className={styles.energyMeter}>
        <span className={styles.energyFill} style={{ width: `${anomaly.energyLevel}%` }} />
      </div>
    </article>
  );
};
