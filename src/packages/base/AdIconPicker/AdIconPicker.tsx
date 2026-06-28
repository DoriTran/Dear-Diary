import { useState, type FC } from 'react';

import type { IconId } from '@/packages/icon';

import { useAppStore } from '@/store';

import AdPopover, { type AdPopoverProps } from '../AdPopover/AdPopover';
import fieldStyles from '../formField/formField.module.css';
import IconPickerPopover from './IconPickerPopover';
import IconPickerTrigger, {
  iconPickerTriggerClassNames,
} from './IconPickerTrigger';

export type AdIconPickerProps = {
  value: IconId;
  onChange: (value: IconId) => void;
  label?: string;
  variant?: 'popover' | 'compact';
  offset?: AdPopoverProps['offset'];
};

const AdIconPicker: FC<AdIconPickerProps> = ({
  value,
  onChange,
  label = 'Icon',
  variant = 'popover',
  offset,
}) => {
  const addRecentIcon = useAppStore('addRecentIcon');
  const [opened, setOpened] = useState(false);

  const handleChange = (next: IconId) => {
    onChange(next);
    addRecentIcon(next);
    setOpened(false);
  };

  const trigger = (
    <button
      type="button"
      className={iconPickerTriggerClassNames({ variant, opened })}
      aria-label={`Selected icon: ${value}`}
      aria-expanded={opened}
      onClick={() => setOpened((current) => !current)}
    >
      <IconPickerTrigger value={value} variant={variant} />
    </button>
  );

  return (
    <div className={fieldStyles.field}>
      {label ? <span className={fieldStyles.label}>{label}</span> : null}

      <AdPopover
        opened={opened}
        onChange={setOpened}
        position="bottom-start"
        offset={offset}
        width="max-content"
        shadow="md"
        radius="lg"
        styles={{
          dropdown: {
            padding: 0,
            maxWidth: 'calc(100vw - 2rem)',
            width: 'auto',
          },
        }}
        anchor={trigger}
      >
        <IconPickerPopover
          value={value}
          onChange={handleChange}
          onClose={() => setOpened(false)}
        />
      </AdPopover>
    </div>
  );
};

export default AdIconPicker;
