import type { FC } from 'react';

import type { ColorId } from '@/packages/color';

import { useResolvedPalette } from '@/packages/color';

import styles from './OverviewTab.module.css';

type TagFillProps = {
  colorId: ColorId;
  percent: number;
};

const TagFill: FC<TagFillProps> = ({ colorId, percent }) => {
  const palette = useResolvedPalette(colorId);

  return (
    <span
      className={styles.tagFill}
      style={{
        width: `${percent}%`,
        background: palette.strong,
      }}
    />
  );
};

export default TagFill;
