import { faCheck, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { useRef, type FC } from 'react';

import { AdIcon } from '@/packages/base';

import type { ComposerContext } from '../charms/charm.types';

import {
  TICKET_DECORATOR_CONFIG,
  TICKET_DECORATOR_FILL,
  TICKET_DECORATOR_GHOST_FILL,
  TICKET_DECORATOR_GHOST_STROKE,
  TICKET_DECORATOR_STROKE,
  TICKET_DECORATOR_STROKE_WIDTH,
} from './ticket.config';
import { buildTicketStubPath, svgViewBoxAttr } from './ticket.shape';
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
  const isDone = decoration?.type === 'ticket' && decoration.state === 'done';

  if (!decoration || decoration.type !== 'ticket') {
    return <div ref={columnRef} className={styles.column} aria-hidden />;
  }

  const disabled = ctx.composing;
  const config = TICKET_DECORATOR_CONFIG;
  const variant = isCompact ? 'compact' : 'standard';
  const path =
    width > 0 && height > 0
      ? buildTicketStubPath(width, height, config, variant)
      : '';
  const viewBox =
    width > 0 && height > 0
      ? svgViewBoxAttr(width, height, config, variant)
      : '0 0 0 0';

  const toggle = () => {
    ctx.emit({ decorator: 'ticket', action: 'complete' });
  };

  return (
    <div ref={columnRef} className={styles.column} aria-hidden={height <= 0}>
      {width > 0 && height > 0 ? (
        <div
          className={styles.stub}
          style={{ top: topOffset, height }}
          data-done={isDone || undefined}
        >
          <div className={styles.tearLayer}>
            <svg
              className={styles.svg}
              viewBox={viewBox}
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                d={path}
                fill={TICKET_DECORATOR_FILL}
                stroke={TICKET_DECORATOR_STROKE}
                strokeWidth={TICKET_DECORATOR_STROKE_WIDTH}
              />
            </svg>
            <button
              type="button"
              className={`${styles.hitBtn} ${isCompact ? styles.hitBtnCompact : styles.hitBtnStandard} ${disabled ? styles.hitBtnDisabled : ''}`}
              aria-label="Tear to complete"
              aria-hidden={isDone}
              tabIndex={isDone ? -1 : undefined}
              disabled={disabled}
              onClick={(event) => {
                if (disabled) {
                  return;
                }

                event.currentTarget.blur();
                toggle();
              }}
            >
              <AdIcon icon={faCheck} size={isCompact ? 12 : 14} />
              {!isCompact ? (
                <span className={styles.tearLabel}>Tear to complete</span>
              ) : null}
            </button>
          </div>

          <div className={styles.undoLayer}>
            <div className={styles.undoGhost}>
              <svg
                className={styles.svg}
                viewBox={viewBox}
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d={path}
                  fill={TICKET_DECORATOR_GHOST_FILL}
                  stroke={TICKET_DECORATOR_GHOST_STROKE}
                  strokeWidth={TICKET_DECORATOR_STROKE_WIDTH}
                />
              </svg>
              <button
                type="button"
                className={`${styles.hitBtn} ${isCompact ? styles.hitBtnCompact : styles.hitBtnStandard}`}
                aria-label="Undo"
                aria-hidden={!isDone}
                tabIndex={isDone ? undefined : -1}
                onClick={(event) => {
                  event.currentTarget.blur();
                  toggle();
                }}
              >
                <AdIcon icon={faRotateLeft} size={isCompact ? 12 : 14} />
                {!isCompact ? (
                  <span className={styles.tearLabel}>Undo</span>
                ) : null}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TicketStub;
