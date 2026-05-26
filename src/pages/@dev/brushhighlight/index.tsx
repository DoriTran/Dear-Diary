import { type FC, useState } from 'react';

import { BrushHighlight } from '@/packages/ui';

import styles from './index.module.css';

const COLOR_PRESETS = [
  '#ffc9a3',
  '#ffb3d9',
  '#b8e8c8',
  'var(--primary)',
] as const;

const BrushHighlightDev: FC = () => {
  const [color, setColor] = useState<string>(COLOR_PRESETS[0]);
  const [size, setSize] = useState(24);
  const [brushes, setBrushes] = useState(1);
  const [label, setLabel] = useState('Notebook');

  return (
    <div className={styles.root}>
      <div className={styles.controls}>
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
          Size
          <input
            type="number"
            min={12}
            max={64}
            value={size}
            onChange={(e) => setSize(Number(e.target.value) || 24)}
          />
        </label>
        <label className={styles.field}>
          Brushes
          <input
            type="number"
            min={1}
            max={5}
            value={brushes}
            onChange={(e) => setBrushes(Number(e.target.value) || 1)}
          />
        </label>
      </div>

      <div className={styles.preview}>
        <div className={styles.previewBlock}>
          <span className={styles.previewLabel}>Live (your props)</span>
          <BrushHighlight color={color} size={size} brushes={brushes}>
            <span className={styles.titleText}>{label}</span>
          </BrushHighlight>
        </div>
        <div className={styles.previewBlock}>
          <span className={styles.previewLabel}>
            Diary style (1 brush, centered)
          </span>
          <BrushHighlight color="#ffc9a3" size={24} brushes={1}>
            <span className={styles.titleText}>My Notes</span>
          </BrushHighlight>
        </div>
        <div className={styles.previewBlock}>
          <span className={styles.previewLabel}>
            Multi-brush (left aligned)
          </span>
          <BrushHighlight color="#ffb3d9" size={22} brushes={3}>
            <span className={styles.titleText}>Long section title</span>
          </BrushHighlight>
        </div>
      </div>
    </div>
  );
};

export default BrushHighlightDev;
