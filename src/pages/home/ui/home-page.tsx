'use client';

import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAnomalies, useDeploySquad } from '@/entities/anomaly/api';
import { AnomalyCard } from '@/entities/anomaly/ui';
import { pingSensorMesh } from '@/shared/api/sensors';
import styles from '@/app/page.module.scss';

const formatTime = (value: Date | number | string) =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

export const HomePage = () => {
  const { data = [], isPending, dataUpdatedAt, refetch } = useAnomalies();
  const { mutate: deploySquad, isPending: isDeploying } = useDeploySquad();
  const {
    mutate: pingSensors,
    isPending: isPinging,
    data: pingResult,
  } = useMutation({
    mutationFn: pingSensorMesh,
    onSuccess: (result) => {
      setLastPing(new Date(result.refreshedAt).getTime());
      refetch();
    },
  });
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [lastPing, setLastPing] = useState<number | null>(null);
  const [ghostKey, setGhostKey] = useState<number | null>(null);
  const [ghostYOffset, setGhostYOffset] = useState<number>(40);
  const [sortMode, setSortMode] = useState<'recent' | 'threat'>('recent');
  const [notice, setNotice] = useState<{ type: 'error' | 'success'; message: string } | null>(
    null,
  );

  const anomalies = useMemo(() => data, [data]);

  const active = anomalies.filter((item) => item.status === 'active');
  const deploying = anomalies.filter((item) => item.status === 'deploying');
  const critical = anomalies.filter((item) => item.threatLevel === 'critical');
  const highestEnergy = [...anomalies].sort((a, b) => b.energyLevel - a.energyLevel)[0];
  const timeline = [...anomalies].sort(
    (a, b) => new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime(),
  );
  const sortedAnomalies = useMemo(() => {
    if (sortMode === 'threat') {
      const threatOrder: Record<string, number> = {
        critical: 3,
        high: 2,
        medium: 1,
        low: 0,
      };
      return [...anomalies].sort((a, b) => threatOrder[b.threatLevel] - threatOrder[a.threatLevel]);
    }
    return [...anomalies].sort(
      (a, b) => new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime(),
    );
  }, [anomalies, sortMode]);

  const maybeShowGhost = () => {
    if (Math.random() < 0.6) {
      const offset = Math.floor(Math.random() * 60) + 10; // 10-70vh
      setGhostYOffset(offset);
      const key = Date.now();
      setGhostKey(key);
      setTimeout(() => {
        setGhostKey((current) => (current === key ? null : current));
      }, 4200);
    }
  };

  const handleDeploy = (id?: string) => {
    if (!id) return;
    maybeShowGhost();
    setPendingId(id);
    deploySquad(id, {
      onSuccess: () => {
        setNotice({ type: 'success', message: 'Squad deploying to target anomaly.' });
      },
      onError: (error) => {
        setNotice({
          type: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Dispatch failed: sensor mesh unavailable. Try again.',
        });
      },
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

  const isBusy = isDeploying || isPending || isPinging;

  return (
    <div className={styles.page}>
      <div className={styles.ghostLayer} aria-hidden>
        {ghostKey ? (
          <div
            key={ghostKey}
            className={styles.ghost}
            style={{ top: `${ghostYOffset}vh` }}
            aria-hidden
          >
            👻
          </div>
        ) : null}
      </div>
      {notice ? (
        <div
          className={`${styles.notice} ${
            notice.type === 'error' ? styles.noticeError : styles.noticeSuccess
          }`}
          role="status"
        >
          {notice.message}
        </div>
      ) : null}
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
              disabled={isBusy}
              onClick={handleQuickDeploy}
            >
              Deploy strike squad
            </button>
            <button
              className={`${styles.button} ${styles.secondary}`}
              type="button"
              disabled={isBusy}
              onClick={() => pingSensors()}
            >
              {isPinging ? 'Pinging...' : 'Ping sensor mesh'}
            </button>
            {pingResult ? (
              <span className={styles.pingStatus}>
                {pingResult.status === 'online'
                  ? 'Sensors stable'
                  : pingResult.status === 'degraded'
                    ? 'Sensors degraded'
                    : 'Sensors offline'}
                · {pingResult.latencyMs}ms · {pingResult.refreshedCount} nodes
              </span>
            ) : null}
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
            <div className={styles.panelActions}>
              <div className={styles.sortToggle} role="group" aria-label="Sort anomalies">
                <button
                  type="button"
                  className={sortMode === 'recent' ? styles.buttonActive : undefined}
                  onClick={() => setSortMode('recent')}
                >
                  Recent
                </button>
                <button
                  type="button"
                  className={sortMode === 'threat' ? styles.buttonActive : undefined}
                  onClick={() => setSortMode('threat')}
                >
                  Threat
                </button>
              </div>
              <span className={styles.badge}>real-time</span>
            </div>
          </div>

          <div className={styles.anomalyGrid}>
            {sortedAnomalies.map((anomaly) => (
              <AnomalyCard
                key={anomaly.id}
                anomaly={anomaly}
                onDeploy={handleDeploy}
                highlight={
                  lastPing !== null && new Date(anomaly.lastSeenAt).getTime() >= lastPing
                }
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
