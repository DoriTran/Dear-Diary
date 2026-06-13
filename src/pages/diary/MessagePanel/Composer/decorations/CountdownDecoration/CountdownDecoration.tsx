import {
  faPause,
  faPen,
  faStopwatch,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useMemo, useState, type FC, type ReactNode } from 'react';

import type { CountdownDecoration as CountdownDecorationType } from '@/store/diary/type';

import { AdIcon } from '@/packages/base';

import styles from './CountdownDecoration.module.css';

export type CountdownDecorationProps = {
  decoration: CountdownDecorationType;
  composing?: boolean;
  onChange?: (decoration: CountdownDecorationType) => void;
  onPause?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
  children?: ReactNode;
};

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const getCountdownParts = (
  targetDate: string,
  pause: boolean,
): CountdownParts => {
  if (pause) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const partsToTargetDate = (parts: CountdownParts): string => {
  const ms =
    parts.days * 24 * 60 * 60 * 1000 +
    parts.hours * 60 * 60 * 1000 +
    parts.minutes * 60 * 1000 +
    parts.seconds * 1000;

  return new Date(Date.now() + ms).toISOString();
};

const CountdownDecoration: FC<CountdownDecorationProps> = ({
  decoration,
  composing = true,
  onChange,
  onPause,
  onEdit,
  onRemove,
  children,
}) => {
  const [parts, setParts] = useState<CountdownParts>(() =>
    getCountdownParts(decoration.targetDate, decoration.pause),
  );

  useEffect(() => {
    if (composing) {
      setParts(getCountdownParts(decoration.targetDate, decoration.pause));
      return;
    }

    const timer = window.setInterval(() => {
      setParts(getCountdownParts(decoration.targetDate, decoration.pause));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [composing, decoration.pause, decoration.targetDate]);

  const segments = useMemo(
    () => [
      { key: 'days', label: 'Days', value: parts.days },
      { key: 'hours', label: 'Hrs', value: parts.hours },
      { key: 'minutes', label: 'Mins', value: parts.minutes },
      { key: 'seconds', label: 'Secs', value: parts.seconds },
    ],
    [parts],
  );

  const updatePart = (key: keyof CountdownParts, value: number) => {
    const next = { ...parts, [key]: Math.max(0, value) };
    setParts(next);
    onChange?.({
      ...decoration,
      targetDate: partsToTargetDate(next),
    });
  };

  const controlClass = composing ? styles.controlBtn : styles.controlBtnActive;

  return (
    <>
      <div className={styles.header}>
        <AdIcon icon={faStopwatch} size={12} />
        {composing ? (
          <input
            className={styles.titleInput}
            value={decoration.title}
            placeholder="Countdown title"
            aria-label="Countdown title"
            onChange={(event) =>
              onChange?.({ ...decoration, title: event.target.value })
            }
          />
        ) : (
          <span className={styles.titleText}>
            {decoration.title || 'Countdown'}
          </span>
        )}
        <div className={styles.timerGrid}>
          {segments.map((segment) => (
            <div key={segment.key} className={styles.timerSegment}>
              {composing ? (
                <input
                  className={styles.segmentInput}
                  type="number"
                  min={0}
                  value={segment.value}
                  aria-label={segment.label}
                  onChange={(event) =>
                    updatePart(
                      segment.key as keyof CountdownParts,
                      Number(event.target.value) || 0,
                    )
                  }
                />
              ) : (
                <span className={styles.timerValue}>{segment.value}</span>
              )}
              <span className={styles.timerLabel}>{segment.label}</span>
            </div>
          ))}
        </div>
        <div className={styles.controls}>
          <button
            type="button"
            className={controlClass}
            aria-label="Pause countdown"
            disabled={composing}
            onClick={onPause}
          >
            <AdIcon icon={faPause} size={10} />
          </button>
          <button
            type="button"
            className={controlClass}
            aria-label="Edit countdown"
            disabled={composing}
            onClick={onEdit}
          >
            <AdIcon icon={faPen} size={10} />
          </button>
          <button
            type="button"
            className={controlClass}
            aria-label="Remove countdown"
            disabled={composing}
            onClick={onRemove}
          >
            <AdIcon icon={faTrash} size={10} />
          </button>
        </div>
      </div>
      {children ? <div className={styles.body}>{children}</div> : null}
    </>
  );
};

export default CountdownDecoration;
