import type { FC, ReactNode } from 'react';

import { useMediaQuery } from '@mantine/hooks';

import type { ColorDefinition, ColorId, ColorPalette } from '@/packages/color';

import { AdTooltip } from '@/packages/base';
import { useResolvedPalette } from '@/packages/color';

import ColorPreview from './ColorPreview';
import styles from './ColorTooltip.module.css';

export type ColorTooltipProps = {
  colorId: ColorId;
  preset?: ColorDefinition;
  name: string;
  personality?: string;
  palette?: ColorPalette;
  children: ReactNode;
};

const ColorTooltip: FC<ColorTooltipProps> = ({
  colorId,
  preset,
  name,
  personality,
  palette: paletteProp,
  children,
}) => {
  const canHover = useMediaQuery('(hover: hover)', true);
  const resolved = useResolvedPalette(colorId);
  const palette = paletteProp ?? resolved;
  const displayName = preset?.name ?? name;
  const displayPersonality = preset?.personality ?? personality;

  const label = (
    <div className={styles.root}>
      <div className={styles.header}>
        <span className={styles.icon}>{preset?.icon ?? '✨'}</span>
        <div>
          <p className={styles.name}>{displayName}</p>
          {displayPersonality ? (
            <p className={styles.personality} style={{ color: palette.strong }}>
              {displayPersonality}
            </p>
          ) : null}
        </div>
      </div>

      <div className={styles.shades}>
        {(['soft', 'main', 'strong'] as const).map((shade) => (
          <div key={shade} className={styles.shade}>
            <span
              className={styles.shadeSwatch}
              style={{ background: palette[shade] }}
            />
            <span className={styles.shadeLabel}>
              {shade.charAt(0).toUpperCase() + shade.slice(1)}
            </span>
          </div>
        ))}
      </div>

      <ColorPreview palette={palette} name={displayName} compact />
    </div>
  );

  return (
    <AdTooltip
      label={label}
      position="right"
      withArrow={false}
      multiline
      openDelay={canHover ? 300 : 0}
      events={{
        hover: canHover,
        focus: false,
        touch: false,
      }}
      classNames={{ tooltip: styles.tooltip }}
    >
      {children}
    </AdTooltip>
  );
};

export default ColorTooltip;
