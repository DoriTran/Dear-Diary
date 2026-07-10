import type { FC } from 'react';

import type { ObservedSize } from './types';

import {
  TICKET2_BORDER,
  TICKET2_BORDER_WIDTH,
  TICKET2_FILL,
  type TicketShape2Config,
} from './config';
import {
  buildTicket2Path,
  getTearLineX,
  getTiltTransform,
  svgViewBoxAttr,
} from './ticket.shape';
import TicketContent from './TicketContent';
import styles from './TicketShapePreview.module.css';

type TicketShapePreviewProps = {
  config: TicketShape2Config;
  size: ObservedSize;
};

const TicketShapePreview: FC<TicketShapePreviewProps> = ({ config, size }) => {
  const { width, height } = size;
  if (width <= 0 || height <= 0) return null;

  const path = buildTicket2Path(width, height, config);
  const tearX = getTearLineX(width, config);
  const viewBox = svgViewBoxAttr(width, height, config);
  const tilt = getTiltTransform(config);
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
          fill={TICKET2_FILL}
          stroke={TICKET2_BORDER}
          strokeWidth={TICKET2_BORDER_WIDTH}
        />
        <line
          x1={tearX}
          y1={tearPad}
          x2={tearX}
          y2={height - tearPad}
          stroke={TICKET2_BORDER}
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
