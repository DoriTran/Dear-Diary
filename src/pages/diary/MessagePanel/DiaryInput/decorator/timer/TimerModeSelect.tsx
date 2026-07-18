import type { FC } from 'react';

import clsx from 'clsx';

import type { TimerMode } from '@/store/diary/type';

import { AdSelect } from '@/packages/base';

import type { ComposerContext } from '../charms/charm.types';

import { setTimerMode } from './timer.utils';
import styles from './timerCharms.module.css';

const MODE_OPTIONS = [
  { value: 'timer', label: 'Countdown' },
  { value: 'countup', label: 'Countup' },
  { value: 'datetime', label: 'Datetime' },
];

type TimerModeSelectProps = {
  decoratorIndex: number;
  ctx: ComposerContext;
};

const TimerModeSelect: FC<TimerModeSelectProps> = ({ decoratorIndex, ctx }) => {
  if (!ctx.composing) {
    return null;
  }

  const decoration = ctx.decorators[decoratorIndex];
  if (!decoration || decoration.type !== 'timer') {
    return null;
  }

  const timer = decoration;

  return (
    <AdSelect
      data={MODE_OPTIONS}
      value={timer.mode}
      classNames={{
        input: clsx(styles.composerPill, styles.modeSelect),
      }}
      onChange={(value) => {
        if (!value) {
          return;
        }

        ctx.updateDecorator(
          decoratorIndex,
          setTimerMode(timer, value as TimerMode),
        );
      }}
    />
  );
};

export default TimerModeSelect;
