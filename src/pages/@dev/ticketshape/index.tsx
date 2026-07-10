import { type FC, useState } from 'react';

import type { BackgroundMode } from './types';

import { DEFAULT_TICKET_CONFIG, type TicketShapeConfig } from './config';
import styles from './index.module.css';
import TicketShapePreview from './TicketShapePreview';
import TicketShapeStage from './TicketShapeStage';

const TicketShapeDev: FC = () => {
  const [config, setConfig] = useState<TicketShapeConfig>({
    ...DEFAULT_TICKET_CONFIG,
  });
  const [backgroundMode, setBackgroundMode] =
    useState<BackgroundMode>('gradient');
  const [showGrid, setShowGrid] = useState(false);

  const update = (patch: Partial<TicketShapeConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  return (
    <div className={styles.root}>
      <header className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Ticket Decoration Shape</h2>
        <p className={styles.pageIntro}>
          Dynamic SVG path renderer. Drag the corner of the preview to resize
          and test responsiveness against different backgrounds.
        </p>
      </header>

      <TicketShapeStage
        backgroundMode={backgroundMode}
        showGrid={showGrid}
        config={config}
      >
        {(size) => <TicketShapePreview config={config} size={size} />}
      </TicketShapeStage>

      <section className={styles.controls}>
        <h3 className={styles.controlsTitle}>Shape controls</h3>

        <div className={styles.controlsRow}>
          <label className={styles.field}>
            Notch radius (r)
            <input
              type="number"
              min={4}
              max={32}
              value={config.notchRadius}
              onChange={(e) =>
                update({ notchRadius: Number(e.target.value) || 12 })
              }
            />
          </label>
          <label className={styles.field}>
            Notch spacing (s)
            <input
              type="number"
              min={16}
              max={64}
              value={config.notchSpacing}
              onChange={(e) =>
                update({ notchSpacing: Number(e.target.value) || 32 })
              }
            />
          </label>
          <label className={styles.field}>
            Tear offset (right)
            <input
              type="number"
              min={32}
              max={120}
              value={config.tearOffset}
              onChange={(e) =>
                update({ tearOffset: Number(e.target.value) || 56 })
              }
            />
          </label>
          <label className={styles.field}>
            Border radius
            <input
              type="number"
              min={0}
              max={32}
              value={config.borderRadius}
              onChange={(e) =>
                update({ borderRadius: Number(e.target.value) || 12 })
              }
            />
          </label>
          <label className={styles.field}>
            Tilt (deg)
            <input
              type="number"
              min={0}
              max={15}
              step={0.5}
              value={config.tiltDeg}
              onChange={(e) => update({ tiltDeg: Number(e.target.value) || 0 })}
            />
          </label>
        </div>

        <div className={styles.controlsRow}>
          <div className={styles.field}>
            Background test
            <div className={styles.bgButtons}>
              {(['solid', 'gradient', 'image'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={styles.bgButton}
                  data-active={backgroundMode === mode || undefined}
                  onClick={() => setBackgroundMode(mode)}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <label className={styles.checkboxField}>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
            />
            Show background grid
          </label>
        </div>
      </section>
    </div>
  );
};

export default TicketShapeDev;
