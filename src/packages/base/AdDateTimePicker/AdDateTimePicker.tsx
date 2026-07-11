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
  appearance?: 'field' | 'inline';
  className?: string;
  placeholder?: string;
};

const pickerClassNames = {
  wrapper: styles.wrapper,
  input: styles.input,
  section: styles.section,
  day: styles.day,
  pickerControl: styles.pickerControl,
  monthsListControl: styles.pickerControl,
  yearsListControl: styles.pickerControl,
  submitButton: styles.submitButton,
};

const AdDateTimePicker: FC<AdDateTimePickerProps> = ({
  value,
  onChange,
  disabled = false,
  compact = false,
  appearance = 'inline',
  className,
  placeholder = 'Pick date and time',
}) => {
  const isInline = appearance === 'inline';

  return (
    <div className={clsx(styles.shell, className)}>
      <DateTimePicker
        value={value}
        onChange={(next) => onChange(next)}
        disabled={disabled}
        placeholder={placeholder}
        variant={isInline ? 'unstyled' : 'default'}
        valueFormat="MMM D, YYYY h:mm A"
        popoverProps={{
          withinPortal: true,
          position: 'top',
          offset: { mainAxis: 8, crossAxis: 0 },
          middlewares: { shift: false },
          classNames: { dropdown: styles.dropdown },
        }}
        className={clsx(
          !isInline && formFieldStyles.control,
          styles.root,
          isInline && styles.inline,
          compact && styles.compact,
        )}
        classNames={pickerClassNames}
        timePickerProps={{
          classNames: {
            field: styles.timeField,
            input: styles.timePickerInput,
          },
        }}
      />
    </div>
  );
};

export default AdDateTimePicker;
