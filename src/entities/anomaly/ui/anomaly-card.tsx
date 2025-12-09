'use client';

import { AnomalyMeta } from './anomaly-meta';
import type { Anomaly } from '../model/types';
import styles from './anomaly-card.module.scss';

type Props = {
  anomaly: Anomaly;
  onDeploy: (id: string) => void;
  disabled?: boolean;
};

const threatCopy: Record<Anomaly['threatLevel'], string> = {
  low: 'Low',
  medium: 'Elevated',
  high: 'High',
  critical: 'Critical',
};

export const AnomalyCard = ({ anomaly, onDeploy, disabled = false }: Props) => {
  const threatColor = styles[`threat-${anomaly.threatLevel}`] ?? styles['threat-low'];
  const isBusy = disabled || anomaly.status === 'deploying' || anomaly.status === 'contained';

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

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.deployButton}
          disabled={isBusy}
          onClick={() => onDeploy(anomaly.id)}
        >
          {anomaly.status === 'deploying'
            ? 'Deploying...'
            : anomaly.status === 'contained'
              ? 'Contained'
              : 'Deploy strike squad'}
        </button>
      </div>
    </article>
  );
};
