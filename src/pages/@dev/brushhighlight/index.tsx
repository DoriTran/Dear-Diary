import {
  faBriefcase,
  faFilm,
  faGripVertical,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { type FC, useState } from 'react';

import { AdIcon } from '@/packages/base';
import { BrushHighlight } from '@/packages/ui';
import LayoutCard from '@/packages/ui/LayoutCard/LayoutCard';

import styles from './index.module.css';

const COLOR_PRESETS = [
  '#ffc9a3',
  '#ffb3d9',
  '#b8e8c8',
  'var(--primary)',
] as const;

const DIARY_PRESETS = [
  { title: 'Work', color: '#ffc9a3', icon: faBriefcase, count: 2 },
  { title: 'Personal', color: '#ffb3d9', icon: faHeart, count: 2 },
  { title: 'Entertainment', color: '#b8e8c8', icon: faFilm, count: 2 },
] as const;

function DiaryBrushContent({
  title,
  icon,
}: {
  title: string;
  icon: typeof faHeart;
}) {
  return (
    <div className={styles.brushInner}>
      <span className={styles.grip} aria-hidden>
        <AdIcon icon={faGripVertical} size={12} />
      </span>
      <span className={styles.groupIcon} aria-hidden>
        <AdIcon icon={icon} size={14} />
      </span>
      <span className={styles.titleText}>{title}</span>
    </div>
  );
}

const BrushHighlightDev: FC = () => {
  const [color, setColor] = useState<string>(COLOR_PRESETS[0]);
  const [height, setHeight] = useState(28);
  const [label, setLabel] = useState('Notebook');
  const [shadow, setShadow] = useState(true);
  const [paintOpacity, setPaintOpacity] = useState(0.95);
  const [useSpacing, setUseSpacing] = useState(false);
  const [splitSpacing, setSplitSpacing] = useState(false);
  const [spacing, setSpacing] = useState(12);
  const [spacingLeft, setSpacingLeft] = useState(8);
  const [spacingRight, setSpacingRight] = useState(16);
  const spacingProp = useSpacing
    ? splitSpacing
      ? { left: spacingLeft, right: spacingRight }
      : spacing
    : undefined;

  return (
    <div className={styles.root}>
      <div className={styles.controls}>
        <div className={styles.controlsRow}>
          <label className={styles.field}>
            Label
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </label>
          <div className={styles.field}>
            Color
            <div className={styles.swatches}>
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={styles.swatch}
                  data-active={color === preset || undefined}
                  style={{ background: preset }}
                  aria-label={`Color ${preset}`}
                  onClick={() => setColor(preset)}
                />
              ))}
            </div>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <label className={styles.field}>
            Height
            <input
              type="number"
              min={12}
              max={64}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value) || 28)}
            />
          </label>
          <div className={styles.spacingField}>
            <div className={styles.spacingLabelRow}>
              <input
                id="brush-spacing-enabled"
                className={styles.spacingCheckbox}
                type="checkbox"
                checked={useSpacing}
                aria-label="Custom spacing"
                onChange={(e) => setUseSpacing(e.target.checked)}
              />
              <span className={styles.spacingLabel}>Spacing (px)</span>
            </div>
            <label className={styles.spacingSplitToggle}>
              <input
                type="checkbox"
                checked={splitSpacing}
                disabled={!useSpacing}
                onChange={(e) => setSplitSpacing(e.target.checked)}
              />
              Split left / right
            </label>
            {splitSpacing ? (
              <div className={styles.spacingSplit}>
                <label className={styles.spacingSideField}>
                  Left
                  <input
                    type="number"
                    className={styles.spacingInput}
                    min={0}
                    max={48}
                    value={spacingLeft}
                    disabled={!useSpacing}
                    onChange={(e) =>
                      setSpacingLeft(Math.max(0, Number(e.target.value) || 0))
                    }
                  />
                </label>
                <label className={styles.spacingSideField}>
                  Right
                  <input
                    type="number"
                    className={styles.spacingInput}
                    min={0}
                    max={48}
                    value={spacingRight}
                    disabled={!useSpacing}
                    onChange={(e) =>
                      setSpacingRight(Math.max(0, Number(e.target.value) || 0))
                    }
                  />
                </label>
              </div>
            ) : (
              <input
                id="brush-spacing-input"
                type="number"
                className={styles.spacingInput}
                min={0}
                max={48}
                value={spacing}
                disabled={!useSpacing}
                onChange={(e) =>
                  setSpacing(Math.max(0, Number(e.target.value) || 0))
                }
              />
            )}
          </div>
        </div>
        <div className={styles.controlsRow}>
          <label className={styles.field}>
            Paint opacity
            <input
              type="range"
              min={70}
              max={100}
              value={Math.round(paintOpacity * 100)}
              onChange={(e) => setPaintOpacity(Number(e.target.value) / 100)}
            />
            <span className={styles.rangeValue}>
              {Math.round(paintOpacity * 100)}%
            </span>
          </label>
          <label className={styles.checkboxField}>
            <input
              type="checkbox"
              checked={shadow}
              onChange={(e) => setShadow(e.target.checked)}
            />
            Shadow
          </label>
        </div>
      </div>

      <div className={styles.preview}>
        <div className={styles.previewBlock}>
          <span className={styles.previewLabel}>Live (your props)</span>
          <div className={styles.diaryHeader}>
            <BrushHighlight
              color={color}
              height={height}
              spacing={spacingProp}
              shadow={shadow}
              paintOpacity={paintOpacity}
            >
              <DiaryBrushContent title={label} icon={faBriefcase} />
            </BrushHighlight>
            <LayoutCard className={styles.countCard}>
              <span className={styles.count}>2</span>
            </LayoutCard>
          </div>
        </div>

        <div className={styles.previewBlock}>
          <span className={styles.previewLabel}>Diary group presets</span>
          <div className={styles.presetRow}>
            {DIARY_PRESETS.map((preset) => (
              <div key={preset.title} className={styles.diaryHeader}>
                <BrushHighlight
                  color={preset.color}
                  height={28}
                  spacing={spacingProp}
                  shadow={shadow}
                  paintOpacity={paintOpacity}
                >
                  <DiaryBrushContent title={preset.title} icon={preset.icon} />
                </BrushHighlight>
                <LayoutCard className={styles.countCard}>
                  <span className={styles.count}>{preset.count}</span>
                </LayoutCard>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.previewBlock}>
          <span className={styles.previewLabel}>Long title</span>
          <div className={styles.diaryHeader}>
            <BrushHighlight
              color="#ffb3d9"
              height={28}
              spacing={spacingProp}
              shadow={shadow}
              paintOpacity={paintOpacity}
            >
              <DiaryBrushContent
                title="Very long section title example"
                icon={faHeart}
              />
            </BrushHighlight>
            <LayoutCard className={styles.countCard}>
              <span className={styles.count}>9</span>
            </LayoutCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrushHighlightDev;
