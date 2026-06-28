import type { CSSProperties, FC } from 'react';

import type { ColorId, ColorPalette } from '@/packages/color';

import { useResolvedPalette } from '@/packages/color';

import styles from './ColorSwatchCircle.module.css';

export type ColorSwatchCircleProps = {
  colorId?: ColorId;
  palette?: ColorPalette;
  size?: number;
  selected?: boolean;
  className?: string;
};

const ColorSwatchCircle: FC<ColorSwatchCircleProps> = ({
  colorId,
  palette: paletteProp,
  size = 32,
  selected,
  className,
}) => {
  const resolved = useResolvedPalette(colorId ?? 'lavender');
  const palette = paletteProp ?? resolved;

  return (
    <span
      className={[styles.root, selected && styles.selected, className]
        .filter(Boolean)
        .join(' ')}
      style={
        {
          width: size,
          height: size,
          '--swatch-soft': palette.soft,
          '--swatch-main': palette.main,
          '--swatch-strong': palette.strong,
        } as CSSProperties
      }
      aria-hidden
    />
  );
};

export default ColorSwatchCircle;
