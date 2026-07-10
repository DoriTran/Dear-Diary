import { type FC, type ReactNode, useEffect, useRef, useState } from 'react';

import type { TicketShapeConfig } from './config';
import type { BackgroundMode, ObservedSize } from './types';

import { computeNotchLayout, formatNotchDebugLabel } from './notch.utils';
import styles from './TicketShapeStage.module.css';

type TicketShapeStageProps = {
  backgroundMode: BackgroundMode;
  showGrid: boolean;
  config: TicketShapeConfig;
  children: (size: ObservedSize) => ReactNode;
};

const TicketShapeStage: FC<TicketShapeStageProps> = ({
  backgroundMode,
  showGrid,
  config,
  children,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<ObservedSize>({ width: 0, height: 0 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      setSize({ width: Math.round(width), height: Math.round(height) });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const notchLayout =
    size.height > 0 ? computeNotchLayout(size.height, config) : null;
  const notchLabel = notchLayout ? formatNotchDebugLabel(notchLayout) : '—';

  return (
    <section className={styles.root}>
      <div className={styles.stageWrap}>
        <div
          ref={stageRef}
          className={styles.stage}
          data-bg={backgroundMode}
          data-grid={showGrid || undefined}
        >
          <div className={styles.stageInner}>{children(size)}</div>
        </div>
      </div>

      <dl className={styles.debug}>
        <div>
          <dt>width</dt>
          <dd>{size.width}px</dd>
        </div>
        <div>
          <dt>height</dt>
          <dd>{size.height}px</dd>
        </div>
        <div>
          <dt>notch pattern</dt>
          <dd>{notchLabel}</dd>
        </div>
      </dl>
    </section>
  );
};

export default TicketShapeStage;
