import { useRef, type FC } from 'react';

import {
  TICKET_DECORATOR_CONFIG,
  TICKET_DECORATOR_FILL,
  TICKET_DECORATOR_STROKE,
  TICKET_DECORATOR_STROKE_WIDTH,
  TICKET_DECORATOR_TEAR_DASH,
} from './ticket.config';
import {
  buildTicketStubPath,
  getStubTearLineX,
  svgViewBoxAttr,
} from './ticket.shape';
import styles from './TicketStubShape.module.css';
import { useTicketSurfaceSize } from './useTicketSurfaceSize';

const TicketStubShape: FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { width, height } = useTicketSurfaceSize(rootRef);

  if (width <= 0 || height <= 0) {
    return <div ref={rootRef} className={styles.root} aria-hidden />;
  }

  const config = TICKET_DECORATOR_CONFIG;
  const path = buildTicketStubPath(width, height, config);
  const tearX = getStubTearLineX(width);
  const viewBox = svgViewBoxAttr(width, height, config);
  const tearPad = config.borderRadius + 8;
  const notchR = config.notchRadius;

  return (
    <div ref={rootRef} className={styles.root} aria-hidden>
      <svg className={styles.svg} viewBox={viewBox} preserveAspectRatio="none">
        <path
          d={path}
          fill={TICKET_DECORATOR_FILL}
          stroke={TICKET_DECORATOR_STROKE}
          strokeWidth={TICKET_DECORATOR_STROKE_WIDTH}
        />
        <line
          x1={tearX}
          y1={tearPad}
          x2={tearX}
          y2={height - tearPad}
          stroke={TICKET_DECORATOR_STROKE}
          strokeWidth={1.5}
          strokeDasharray={TICKET_DECORATOR_TEAR_DASH}
          opacity={0.7}
        />
        <path
          d={`M ${tearX} ${notchR} A ${notchR} ${notchR} 0 0 0 ${tearX - notchR} 0`}
          fill={TICKET_DECORATOR_FILL}
          stroke={TICKET_DECORATOR_STROKE}
          strokeWidth={1}
        />
        <path
          d={`M ${tearX} ${height - notchR} A ${notchR} ${notchR} 0 0 1 ${tearX - notchR} ${height}`}
          fill={TICKET_DECORATOR_FILL}
          stroke={TICKET_DECORATOR_STROKE}
          strokeWidth={1}
        />
      </svg>
    </div>
  );
};

export default TicketStubShape;
