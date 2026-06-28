import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useState, type FC } from 'react';

import { AdIcon, AdPopover } from '@/packages/base';

import type { ColorPickerState } from './useColorPickerState';

import styles from './ColorPickerAnchor.module.css';
import ColorPickerField, { type HuePlacement } from './ColorPickerField';

export type ColorPickerAnchorProps = {
  picker: ColorPickerState;
  label?: string;
  disabled?: boolean;
  huePlacement?: HuePlacement;
};

const ColorPickerAnchor: FC<ColorPickerAnchorProps> = ({
  picker,
  label,
  disabled,
  huePlacement,
}) => {
  const [opened, setOpened] = useState(false);
  const { hex } = picker;

  const swatch = (
    <button
      type="button"
      className={styles.swatchBtn}
      data-open={opened || undefined}
      disabled={disabled}
      aria-label={label ? `${label} color: ${hex}` : `Color: ${hex}`}
      aria-expanded={opened}
      onClick={() => setOpened((current) => !current)}
      style={{ background: hex }}
    />
  );

  return (
    <div className={styles.root}>
      {label ? (
        <span className={styles.label}>
          <AdIcon icon={faPen} size={12} />
          {label}
        </span>
      ) : null}
      <div className={styles.row}>
        <AdPopover
          opened={opened}
          onChange={setOpened}
          position="bottom-start"
          width="max-content"
          shadow="md"
          radius="md"
          disabled={disabled}
          withinPortal={false}
          anchor={swatch}
        >
          <ColorPickerField
            picker={picker}
            disabled={disabled}
            huePlacement={huePlacement}
            nestInPopover
            className={styles.popoverContent}
          />
        </AdPopover>
        <span className={styles.hex}>{hex}</span>
      </div>
    </div>
  );
};

export default ColorPickerAnchor;
