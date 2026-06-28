import type { FC } from 'react';

import type { ColorId, ColorPalette } from '@/packages/color';

import { useResolvedPalette } from '@/packages/color';

import styles from './ColorSwatchDots.module.css';

export type ColorSwatchDotsProps = {
  colorId?: ColorId;
  palette?: ColorPalette;
  size?: number;
};

const ColorSwatchDots: FC<ColorSwatchDotsProps> = ({
  colorId,
  palette: paletteProp,
  size = 8,
}) => {
  const resolved = useResolvedPalette(colorId ?? 'lavender');
  const palette = paletteProp ?? resolved;

  return (
    <span className={styles.root} aria-hidden>
      <span
        className={styles.dot}
        style={{ background: palette.soft, width: size, height: size }}
      />
      <span
        className={styles.dot}
        style={{ background: palette.main, width: size, height: size }}
      />
      <span
        className={styles.dot}
        style={{ background: palette.strong, width: size, height: size }}
      />
    </span>
  );
};

export default ColorSwatchDots;
