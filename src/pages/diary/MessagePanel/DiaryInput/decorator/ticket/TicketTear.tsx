import type { FC } from 'react';

import { faCheck } from '@fortawesome/free-solid-svg-icons';

import { AdIcon } from '@/packages/base';

import type { ComposerContext } from '../charms/charm.types';

import styles from './ticketCharms.module.css';

type TicketTearProps = {
  decoratorIndex: number;
  ctx: ComposerContext;
};

const TicketTear: FC<TicketTearProps> = ({ decoratorIndex, ctx }) => {
  const decoration = ctx.decorators[decoratorIndex];
  if (!decoration || decoration.type !== 'ticket') {
    return null;
  }

  const isDone = decoration.state === 'done';
  const disabled = ctx.composing;

  return (
    <button
      type="button"
      className={`${styles.tearBtn} ${disabled ? styles.tearBtnDisabled : ''} ${isDone ? styles.tearBtnDone : ''}`}
      aria-label="Tear to complete"
      disabled={disabled}
      onClick={() => {
        if (disabled) {
          return;
        }

        ctx.emit({ decorator: 'ticket', action: 'complete' });
      }}
    >
      <AdIcon icon={faCheck} size={14} />
      <span className={styles.tearLabel}>Tear to complete</span>
    </button>
  );
};

export default TicketTear;
