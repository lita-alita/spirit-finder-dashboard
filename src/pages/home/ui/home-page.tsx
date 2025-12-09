'use client';

import { useMemo, useState } from 'react';
import { useAnomalies, useDeploySquad } from '@/entities/anomaly/api';
import { AnomalyCard } from '@/entities/anomaly/ui';
import styles from '@/app/page.module.scss';

const formatTime = (value: Date | number | string) =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

export const HomePage = () => {
  const { data = [], isPending, dataUpdatedAt, refetch } = useAnomalies();
  const { mutate: deploySquad, isPending: isDeploying } = useDeploySquad();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const anomalies = useMemo(() => data, [data]);

  const active = anomalies.filter((item) => item.status === 'active');
  const deploying = anomalies.filter((item) => item.status === 'deploying');
  const critical = anomalies.filter((item) => item.threatLevel === 'critical');
  const highestEnergy = [...anomalies].sort((a, b) => b.energyLevel - a.energyLevel)[0];
  const timeline = [...anomalies].sort(
    (a, b) => new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime(),
  );

  const handleDeploy = (id?: string) => {
    if (!id) return;
    setPendingId(id);
    deploySquad(id, {
      onSettled: () => {
        setPendingId(null);
        refetch();
      },
    });
  };

  const handleQuickDeploy = () => {
    const target = active[0] ?? anomalies[0];
    handleDeploy(target?.id);
  };

  return (
    <div className={styles.page}>
      <section className={`${styles.shell} ${styles.masthead}`}>
        <div className={styles.masthead__top}>
          <div className={styles.brand}>
            <div className={styles.title}>
              <div className={styles.titleLine}>
                <span className={styles.pulse} aria-hidden />
                <h1>Spirits Finder Ops</h1>
              </div>
              <span className={styles.subtitle}>Live anomaly telemetry — Tokyo grid</span>
            </div>
          </div>
          <div className={styles.ctaRow}>
            <button
              className={styles.button}
              type="button"
              disabled={isDeploying || isPending}
              onClick={handleQuickDeploy}
            >
              Deploy strike squad
            </button>
            <button className={`${styles.button} ${styles.secondary}`} type="button">
              Ping sensor mesh
            </button>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Active anomalies</p>
            <div className={styles.statValue}>
              {active.length}
              <span className={styles.statDelta}>+2 new</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Deploying squads</p>
            <div className={styles.statValue}>
              {deploying.length}
              <span className={styles.statDelta}>ETA 08:00</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Critical alerts</p>
            <div className={styles.statValue}>
              {critical.length}
              <span className={styles.statDelta}>Holding perimeter</span>
            </div>
          </div>
          {highestEnergy ? (
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Highest energy</p>
              <div className={styles.statValue}>
                {highestEnergy.energyLevel}%
                <span className={styles.statDelta}>{highestEnergy.district}</span>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <div className={styles.layout}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <h2>Live anomaly board</h2>
              <span>Validated by Zod · Synced via TanStack Query pipeline</span>
            </div>
            <span className={styles.badge}>real-time</span>
          </div>

          <div className={styles.anomalyGrid}>
            {anomalies.map((anomaly) => (
              <AnomalyCard
                key={anomaly.id}
                anomaly={anomaly}
                onDeploy={handleDeploy}
                disabled={pendingId !== null && pendingId !== anomaly.id}
              />
            ))}
            {anomalies.length === 0 && <p className={styles.empty}>All clear. Sensors on standby.</p>}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <h2>Rapid response queue</h2>
              <span>Last updated {dataUpdatedAt ? formatTime(dataUpdatedAt) : '—'}</span>
            </div>
            <span className={styles.badge}>ops queue</span>
          </div>

          <div className={styles.timeline}>
            {timeline.map((entry) => (
              <div key={entry.id} className={styles.timelineItem}>
                <div className={styles.timelineMeta}>
                  <strong>{entry.name}</strong>
                  <span>
                    {entry.district} · {formatTime(entry.lastSeenAt)}
                  </span>
                </div>
                <span className={styles.status}>{entry.status}</span>
              </div>
            ))}
          </div>
          <p className={styles.footerNote}>Ops hub · Sensors calibrated to +/- 0.2 keV</p>
        </section>
      </div>
    </div>
  );
};
