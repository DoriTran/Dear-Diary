import type { CSSProperties, FC } from 'react';

import type { ColorPalette } from '@/packages/color';

import { ColorSwatchCircle } from '@/packages/base/AdColorPicker';

import styles from './PaletteChatboxPreview.module.css';

export type PaletteChatboxPreviewProps = {
  name: string;
  namePlaceholder?: string;
  description?: string;
  descriptionPlaceholder?: string;
  palette: ColorPalette;
};

const PaletteChatboxPreview: FC<PaletteChatboxPreviewProps> = ({
  name,
  namePlaceholder = 'Palette name',
  description,
  descriptionPlaceholder = 'Description preview',
  palette,
}) => {
  const displayName = name.trim() || namePlaceholder;
  const displayDescription = description?.trim() || descriptionPlaceholder;

  return (
    <div
      className={styles.root}
      style={
        {
          '--chatbox-soft': palette.soft,
          '--chatbox-main': palette.main,
          '--chatbox-strong': palette.strong,
        } as CSSProperties
      }
      aria-hidden
    >
      <span className={styles.accentBar} />
      <div className={styles.content}>
        <div className={styles.mainRow}>
          <div className={styles.iconArea}>
            <span
              className={styles.iconWrap}
              style={{ background: palette.soft }}
            >
              <ColorSwatchCircle palette={palette} size={28} />
            </span>
          </div>
          <div className={styles.textColumn}>
            <p className={styles.name}>{displayName}</p>
            <p className={styles.preview}>{displayDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaletteChatboxPreview;
