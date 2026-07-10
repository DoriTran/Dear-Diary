import type { FC } from 'react';

import type { ObservedSize } from './types';

import {
  TICKET_BORDER,
  TICKET_BORDER_WIDTH,
  TICKET_FILL,
  type TicketShapeConfig,
} from './config';
import {
  buildTicketPath,
  getTearLineX,
  getTiltTransform,
  svgViewBoxAttr,
} from './notch.utils';
import TicketContent from './TicketContent';
import styles from './TicketShapePreview.module.css';

type TicketShapePreviewProps = {
  config: TicketShapeConfig;
  size: ObservedSize;
};

const TicketShapePreview: FC<TicketShapePreviewProps> = ({ config, size }) => {
  const { width, height } = size;
  const ready = width > 0 && height > 0;
  if (!ready) return null;

  const path = buildTicketPath(width, height, config);
  const tearX = getTearLineX(width, config);
  const viewBox = svgViewBoxAttr(width, height, config);
  const tilt = getTiltTransform(width, height, config);
  const tearPad = config.borderRadius + 8;

  return (
    <div
      className={styles.root}
      style={{
        width,
        height,
        transform: tilt || undefined,
        transformOrigin: `${width / 2}px ${height / 2}px`,
      }}
    >
      <svg
        className={styles.svg}
        viewBox={viewBox}
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d={path}
          fill={TICKET_FILL}
          stroke={TICKET_BORDER}
          strokeWidth={TICKET_BORDER_WIDTH}
        />
        <line
          x1={tearX}
          y1={tearPad}
          x2={tearX}
          y2={height - tearPad}
          stroke={TICKET_BORDER}
          strokeWidth={1.5}
          strokeDasharray="4 4"
          opacity={0.7}
        />
      </svg>
      <div className={styles.contentOverlay}>
        <TicketContent />
      </div>
    </div>
  );
};

export default TicketShapePreview;
