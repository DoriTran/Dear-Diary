import clsx from 'clsx';

import styles from './formField.module.css';

export type PickerTriggerClassNameOptions = {
  variant?: 'popover' | 'compact';
  opened?: boolean;
  tinted?: boolean;
  /** Icon popover trigger is a fixed square; color popover uses padded auto width. */
  popoverSquare?: boolean;
};

export const pickerTriggerClassNames = ({
  variant = 'popover',
  opened = false,
  tinted = false,
  popoverSquare = false,
}: PickerTriggerClassNameOptions) =>
  clsx(
    styles.pickerTrigger,
    variant === 'compact' && styles.pickerTriggerCompact,
    variant === 'compact' && tinted && styles.pickerTriggerTinted,
    variant === 'popover' && popoverSquare && styles.pickerTriggerSquare,
    variant === 'popover' && !popoverSquare && styles.pickerTriggerPopover,
    opened && styles.pickerTriggerOpen,
  );
