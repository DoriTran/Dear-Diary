import type { FC } from 'react';

import { TimePicker } from '@mantine/dates';
import clsx from 'clsx';

import formFieldStyles from '@/packages/base/formField/formField.module.css';

import styles from './AdDurationPicker.module.css';

export type AdDurationPickerProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  compact?: boolean;
  appearance?: 'field' | 'inline';
  className?: string;
};

const AdDurationPicker: FC<AdDurationPickerProps> = ({
  value,
  onChange,
  disabled = false,
  compact = false,
  appearance = 'inline',
  className,
}) => {
  const isInline = appearance === 'inline';

  return (
    <TimePicker
      withSeconds
      withDropdown
      variant={isInline ? 'unstyled' : 'default'}
      value={value}
      onChange={(next) => onChange(next ?? '00:00:00')}
      disabled={disabled}
      className={clsx(
        !isInline && formFieldStyles.control,
        styles.root,
        isInline && styles.inline,
        compact && styles.compact,
        className,
      )}
      classNames={{
        root: styles.pickerRoot,
        wrapper: styles.wrapper,
        input: styles.input,
        fieldsRoot: styles.fieldsRoot,
        fieldsGroup: styles.fieldsGroup,
        field: styles.field,
        dropdown: styles.dropdown,
        control: styles.control,
      }}
      popoverProps={{ withinPortal: true }}
    />
  );
};

export default AdDurationPicker;
