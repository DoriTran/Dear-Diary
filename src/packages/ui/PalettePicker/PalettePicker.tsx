import { useState, type FC } from 'react';

import type { ColorId } from '@/packages/color';

import { AdPopover } from '@/packages/base';
import { ColorSwatchCircle } from '@/packages/base/AdColorPicker';
import fieldStyles from '@/packages/base/formField/formField.module.css';
import { pickerTriggerClassNames } from '@/packages/base/formField/pickerTriggerClassNames';
import { getColorName } from '@/packages/color';
import { useAppStore, useDiaryStore } from '@/store';

import PalettePickerPopover from './PalettePickerPopover';

export type PalettePickerProps = {
  value: ColorId;
  onChange: (value: ColorId) => void;
  label?: string;
  variant?: 'popover' | 'compact';
};

const COMPACT_SWATCH_SIZE = 26;

const PalettePicker: FC<PalettePickerProps> = ({
  value,
  onChange,
  label = 'Color',
  variant = 'popover',
}) => {
  const customPalettes = useDiaryStore('customPalettes');
  const addRecentColor = useAppStore('addRecentColor');
  const [opened, setOpened] = useState(false);

  const displayName = getColorName(value, customPalettes);
  const isCompact = variant === 'compact';

  const handleChange = (next: ColorId) => {
    onChange(next);
    addRecentColor(next);
    setOpened(false);
  };

  const handleValueChange = (next: ColorId) => {
    onChange(next);
  };

  const trigger = (
    <button
      type="button"
      className={pickerTriggerClassNames({
        variant,
        opened,
      })}
      aria-label={`Selected color: ${displayName}`}
      aria-expanded={opened}
      onClick={() => setOpened((current) => !current)}
    >
      <ColorSwatchCircle
        colorId={value}
        size={isCompact ? COMPACT_SWATCH_SIZE : 28}
      />
    </button>
  );

  return (
    <div className={fieldStyles.field}>
      {label ? <span className={fieldStyles.label}>{label}</span> : null}
      <AdPopover
        opened={opened}
        onChange={setOpened}
        position="bottom-start"
        width="max-content"
        shadow="md"
        radius="lg"
        styles={{
          dropdown: {
            padding: 0,
            maxWidth: 'calc(100vw - 2rem)',
            width: 'max-content',
          },
        }}
        anchor={trigger}
      >
        <PalettePickerPopover
          value={value}
          onChange={handleChange}
          onValueChange={handleValueChange}
          onClose={() => setOpened(false)}
        />
      </AdPopover>
    </div>
  );
};

export default PalettePicker;
