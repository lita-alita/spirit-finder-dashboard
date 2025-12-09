import type { Anomaly } from '../model/types';
import styles from './anomaly-card.module.scss';

type Props = {
  anomaly: Anomaly;
  className?: string;
};

const formatTime = (value: string) =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

export const AnomalyMeta = ({ anomaly, className }: Props) => {
  const metaClass = className ? `${styles.meta} ${className}` : styles.meta;

  return (
    <div className={metaClass}>
      <div>
        <dt>District</dt>
        <dd>{anomaly.district}</dd>
      </div>
      <div>
        <dt>Status</dt>
        <dd className={styles.status}>{anomaly.status}</dd>
      </div>
      <div>
        <dt>Last seen</dt>
        <dd>{formatTime(anomaly.lastSeenAt)}</dd>
      </div>
    </div>
  );
};
