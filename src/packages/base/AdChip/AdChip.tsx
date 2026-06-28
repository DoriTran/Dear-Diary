import type { HTMLAttributes, FC, CSSProperties } from 'react';

import clsx from 'clsx';

import type { ColorId } from '@/packages/color';
import { useResolvedPalette } from '@/packages/color';
import { tagStyles } from '@/packages/color';

import styles from './AdChip.module.css';

export type AdChipSize = 'small' | 'medium' | 'large' | number;

export type AdChipProps = {
  label: string;
  colorId?: ColorId;
  count?: number;
  size?: AdChipSize;
  onRemove?: () => void;
  reorderProps?: HTMLAttributes<HTMLElement>;
  className?: string;
  'data-tag-measure'?: boolean;
};

const resolveSizeClass = (size: AdChipSize): string | undefined => {
  if (typeof size === 'number') {
    return undefined;
  }

  return styles[`size_${size}`];
};

const AdChip: FC<AdChipProps> = ({
  label,
  colorId,
  count,
  size = 'small',
  onRemove,
  reorderProps,
  className,
  'data-tag-measure': dataTagMeasure,
}) => {
  const palette = useResolvedPalette(colorId ?? 'lavender');
  const showCount = count !== undefined && count > 0;
  const display = showCount ? `${count} #${label}` : `#${label}`;

  const sizeStyle: CSSProperties | undefined =
    typeof size === 'number'
      ? {
          height: size,
          paddingInline: Math.round(size * 0.42),
          fontSize: Math.max(10, Math.round(size * 0.52)),
        }
      : undefined;

  const colorStyle = colorId ? tagStyles(palette) : undefined;

  return (
    <span
      {...reorderProps}
      className={clsx(
        styles.root,
        resolveSizeClass(size),
        onRemove && styles.removable,
        className,
      )}
      data-tag-measure={dataTagMeasure || undefined}
      style={{
        ...colorStyle,
        ...sizeStyle,
      }}
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
