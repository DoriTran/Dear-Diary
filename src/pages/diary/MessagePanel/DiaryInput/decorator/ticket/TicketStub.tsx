import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useRef, type FC } from 'react';

import { AdIcon } from '@/packages/base';

import type { ComposerContext } from '../charms/charm.types';

import {
  TICKET_DECORATOR_CONFIG,
  TICKET_DECORATOR_FILL,
  TICKET_DECORATOR_STROKE,
  TICKET_DECORATOR_STROKE_WIDTH,
} from './ticket.config';
import {
  buildTicketStubPath,
  resolveTicketStubVariant,
  svgViewBoxAttr,
} from './ticket.shape';
import styles from './TicketStub.module.css';
import { useTicketEditorMetrics } from './useTicketEditorMetrics';

type TicketStubProps = {
  decoratorIndex: number;
  ctx: ComposerContext;
};

const TicketStub: FC<TicketStubProps> = ({ decoratorIndex, ctx }) => {
  const columnRef = useRef<HTMLDivElement>(null);
  const { width, height, topOffset, isCompact } =
    useTicketEditorMetrics(columnRef);

  const decoration = ctx.decorators[decoratorIndex];
  if (!decoration || decoration.type !== 'ticket') {
    return <div ref={columnRef} className={styles.column} aria-hidden />;
  }

  const isDone = decoration.state === 'done';
  const disabled = ctx.composing;
  const config = TICKET_DECORATOR_CONFIG;
  const variant = resolveTicketStubVariant(height, config);
  const path =
    width > 0 && height > 0
      ? buildTicketStubPath(width, height, config, variant)
      : '';
  const viewBox =
    width > 0 && height > 0
      ? svgViewBoxAttr(width, height, config, variant)
      : '0 0 0 0';

  return (
    <div ref={columnRef} className={styles.column} aria-hidden={height <= 0}>
      {width > 0 && height > 0 ? (
        <div className={styles.stub} style={{ top: topOffset, height }}>
          <svg
            className={styles.svg}
            viewBox={viewBox}
            preserveAspectRatio="none"
          >
            <path
              d={path}
              fill={TICKET_DECORATOR_FILL}
              stroke={TICKET_DECORATOR_STROKE}
              strokeWidth={TICKET_DECORATOR_STROKE_WIDTH}
            />
          </svg>
          <div
            className={`${styles.tearWrap} ${isCompact ? styles.tearWrapCompact : styles.tearWrapStandard}`}
          >
            <button
              type="button"
              className={`${styles.tearBtn} ${isCompact ? styles.tearBtnCompact : ''} ${disabled ? styles.tearBtnDisabled : ''} ${isDone ? styles.tearBtnDone : ''}`}
              aria-label="Tear to complete"
              disabled={disabled}
              onClick={() => {
                if (disabled) {
                  return;
                }

                ctx.emit({ decorator: 'ticket', action: 'complete' });
              }}
            >
              <AdIcon icon={faCheck} size={isCompact ? 12 : 14} />
              {!isCompact ? (
                <span className={styles.tearLabel}>Tear to complete</span>
              ) : null}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TicketStub;
