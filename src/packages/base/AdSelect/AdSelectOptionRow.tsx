import type { FC } from 'react';

import type { ColorId } from '@/packages/color';
import type { IconId } from '@/packages/icon';

import { resolvePalette } from '@/packages/color';
import { LucideIconById } from '@/packages/icon';
import { useAppStore, useDiaryStore } from '@/store';

import { adSelectRowIconVars } from './adSelectOptionColorVars';
import styles from './AdSelectOptionRow.module.css';

export type AdSelectOptionRowProps = {
  label: string;
  iconId?: IconId;
  colorId?: ColorId;
};

const AdSelectOptionRow: FC<AdSelectOptionRowProps> = ({
  label,
  iconId,
  colorId,
}) => {
  const mode = useAppStore('mode');
  const customPalettes = useDiaryStore('customPalettes');
  const iconStyle =
    colorId != null
      ? adSelectRowIconVars(resolvePalette(colorId, mode, customPalettes))
      : undefined;

  return (
    <span className={styles.row}>
      {iconId ? (
        <span className={styles.iconWrap} style={iconStyle}>
          <LucideIconById iconId={iconId} size={14} />
        </span>
      ) : null}
      <span className={styles.label}>{label}</span>
    </span>
  );
};

export default AdSelectOptionRow;
