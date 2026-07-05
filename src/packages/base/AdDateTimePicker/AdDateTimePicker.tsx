import type { FC } from 'react';

import { DateTimePicker } from '@mantine/dates';
import clsx from 'clsx';

import formFieldStyles from '../formField/formField.module.css';
import styles from './AdDateTimePicker.module.css';

export type AdDateTimePickerProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  compact?: boolean;
  className?: string;
  placeholder?: string;
};

const AdDateTimePicker: FC<AdDateTimePickerProps> = ({
  value,
  onChange,
  disabled = false,
  compact = false,
  className,
  placeholder = 'Pick date and time',
}) => {
  return (
    <DateTimePicker
      value={value}
      onChange={(next) => onChange(next)}
      disabled={disabled}
      placeholder={placeholder}
      className={clsx(
        formFieldStyles.control,
        styles.root,
        compact && styles.compact,
        className,
      )}
      valueFormat="MMM D, YYYY h:mm A"
      popoverProps={{ withinPortal: true }}
    />
  );
};

export default AdDateTimePicker;
