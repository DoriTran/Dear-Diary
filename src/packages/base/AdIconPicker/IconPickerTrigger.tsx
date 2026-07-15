import type { FC } from 'react';

import type { IconId } from '@/packages/icon';

import { LucideIconById } from '@/packages/icon';

import { pickerTriggerClassNames } from '../formField';
import styles from './IconPickerTrigger.module.css';

export type IconPickerTriggerProps = {
  value: IconId;
  variant?: 'popover' | 'compact';
  showCheck?: boolean;
};

const IconPickerTrigger: FC<IconPickerTriggerProps> = ({
  value,
  variant = 'popover',
  showCheck = false,
}) => {
  return (
    <>
      <span className={styles.iconWrap}>
        <LucideIconById iconId={value} size={variant === 'compact' ? 20 : 16} />
      </span>
      {showCheck ? (
        <span className={styles.checkBadge} aria-hidden>
          <LucideIconById
            iconId="Check"
            size={8}
            color="currentColor"
            strokeWidth={3}
          />
        </span>
      ) : null}
    </>
  );
};

export const iconPickerTriggerClassNames = (options: {
  variant?: 'popover' | 'compact';
  opened?: boolean;
}) =>
  pickerTriggerClassNames({
    variant: options.variant,
    opened: options.opened,
    tinted: options.variant === 'compact',
    popoverSquare: options.variant === 'popover',
  });

export default IconPickerTrigger;
