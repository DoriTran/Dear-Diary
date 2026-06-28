import type { FC } from 'react';

import type { ColorPalette } from '@/packages/color';

import { groupLabelStyles, tagStyles } from '@/packages/color';

import styles from './ColorPreview.module.css';

export type ColorPreviewProps = {
  palette: ColorPalette;
  name: string;
  compact?: boolean;
};

const ColorPreview: FC<ColorPreviewProps> = ({ palette, name, compact }) => {
  const tagStyle = tagStyles(palette);

  return (
    <div
      className={[styles.root, compact && styles.compact]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.previewBlock}>
        <span className={styles.previewLabel}>Chatbox</span>
        <div
          className={styles.chatbox}
          style={{ background: palette.soft, borderLeftColor: palette.strong }}
        >
          <span
            className={styles.chatboxIcon}
            style={{ background: palette.soft }}
          >
            ✿
          </span>
          <span className={styles.chatboxText}>{name}</span>
        </div>
      </div>

      {!compact ? (
        <>
          <div className={styles.previewBlock}>
            <span className={styles.previewLabel}>Group Label</span>
            <span
              className={styles.groupLabel}
              style={groupLabelStyles(palette)}
            >
              {name} Group
            </span>
          </div>

          <div className={styles.previewBlock}>
            <span className={styles.previewLabel}>Tag</span>
            <span className={styles.tag} style={tagStyle}>
              Important
            </span>
          </div>

          <div className={styles.previewBlock}>
            <span className={styles.previewLabel}>Selected</span>
            <div
              className={styles.selectedState}
              style={{
                background: palette.soft,
                borderLeftColor: palette.strong,
              }}
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ColorPreview;
