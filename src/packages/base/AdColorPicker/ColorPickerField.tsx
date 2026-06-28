import type { FC, MouseEvent } from 'react';

import type { ColorPickerState } from './useColorPickerState';

import styles from './ColorPickerField.module.css';
import { getSbThumbStyle } from './useColorPickerState';

export type HuePlacement = 'top' | 'bottom' | 'left' | 'right';

export type ColorPickerFieldProps = {
  picker: ColorPickerState;
  disabled?: boolean;
  huePlacement?: HuePlacement;
  /** Keep mousedown inside nested popovers from closing an outer popover. */
  nestInPopover?: boolean;
  className?: string;
};

const ColorPickerField: FC<ColorPickerFieldProps> = ({
  picker,
  disabled,
  huePlacement = 'bottom',
  nestInPopover = false,
  className,
}) => {
  const {
    hex,
    hue,
    saturation,
    brightness,
    handleSbPointerDown,
    handleSbPointerMove,
    handleSbPointerUp,
    handleHueChange,
  } = picker;

  const thumbStyle = getSbThumbStyle(saturation, brightness);

  const containMouseDown = nestInPopover
    ? (event: MouseEvent<HTMLElement>) => event.stopPropagation()
    : undefined;

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-hue={huePlacement}
      aria-disabled={disabled || undefined}
    >
      <div
        className={styles.sbArea}
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hue} 100% 50%))`,
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? 'none' : undefined,
        }}
        onPointerDown={disabled ? undefined : handleSbPointerDown}
        onPointerMove={disabled ? undefined : handleSbPointerMove}
        onPointerUp={disabled ? undefined : handleSbPointerUp}
        onPointerCancel={disabled ? undefined : handleSbPointerUp}
        onMouseDown={containMouseDown}
        role="presentation"
      >
        <span
          className={styles.sbThumb}
          style={{
            ...thumbStyle,
            background: hex,
          }}
        />
      </div>

      <div className={styles.hueTrack}>
        <input
          type="range"
          min={0}
          max={360}
          step={1}
          value={Math.round(hue)}
          disabled={disabled}
          className={styles.hueSlider}
          aria-label="Hue"
          onMouseDown={containMouseDown}
          onChange={(event) => handleHueChange(Number(event.target.value))}
        />
      </div>
    </div>
  );
};

export default ColorPickerField;
