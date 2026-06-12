import type { HTMLAttributes, FC } from 'react';

import clsx from 'clsx';

import styles from './AdChip.module.css';

const buildTagBackground = (color: string) =>
  `color-mix(in srgb, ${color} 26%, var(--surface))`;

export type AdChipProps = {
  label: string;
  color?: string;
  count?: number;
  onRemove?: () => void;
  reorderProps?: HTMLAttributes<HTMLElement>;
  className?: string;
  'data-tag-measure'?: boolean;
};

const AdChip: FC<AdChipProps> = ({
  label,
  color,
  count,
  onRemove,
  reorderProps,
  className,
  'data-tag-measure': dataTagMeasure,
}) => {
  const showCount = count !== undefined && count > 0;
  const display = showCount ? `${count} #${label}` : `#${label}`;

  return (
    <span
      {...reorderProps}
      className={clsx(styles.root, onRemove && styles.removable, className)}
      data-tag-measure={dataTagMeasure || undefined}
      style={color ? { background: buildTagBackground(color) } : undefined}
    >
      <span className={styles.label}>{display}</span>
      {onRemove ? (
        <button
          type="button"
          className={styles.removeBtn}
          aria-label={`Remove ${label}`}
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
        >
          ×
        </button>
      ) : null}
    </span>
  );
};

export default AdChip;
