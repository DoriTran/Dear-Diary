import type { FC } from 'react';

import ColorPickerAnchor from './ColorPickerAnchor';
import ColorPickerField, { type HuePlacement } from './ColorPickerField';
import { useColorPickerState } from './useColorPickerState';

export type AdColorPickerProps = {
  value: string;
  onChange: (hex: string) => void;
  label?: string;
  exposed?: boolean;
  disabled?: boolean;
  huePlacement?: HuePlacement;
};

const AdColorPicker: FC<AdColorPickerProps> = ({
  value,
  onChange,
  label,
  exposed = false,
  disabled,
  huePlacement,
}) => {
  const picker = useColorPickerState(value, onChange);

  if (exposed) {
    return (
      <ColorPickerField
        picker={picker}
        disabled={disabled}
        huePlacement={huePlacement}
      />
    );
  }

  return (
    <ColorPickerAnchor
      picker={picker}
      label={label}
      disabled={disabled}
      huePlacement={huePlacement}
    />
  );
};

export default AdColorPicker;
