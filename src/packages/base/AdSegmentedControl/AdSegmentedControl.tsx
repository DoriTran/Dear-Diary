import type { ReactNode } from 'react';

import clsx from 'clsx';

import styles from './AdSegmentedControl.module.css';

export type AdSegmentedControlOption<T extends string> = {
  value: T;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

export type AdSegmentedControlProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: ReadonlyArray<AdSegmentedControlOption<T>>;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
};

function AdSegmentedControl<T extends string>({
  value,
  onChange,
  options,
  size = 'md',
  fullWidth = false,
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: AdSegmentedControlProps<T>) {
  return (
    <div
      aria-label={ariaLabel}
      className={clsx(styles.root, className)}
      data-full-width={fullWidth || undefined}
      data-size={size}
      role="radiogroup"
    >
      {options.map((option) => {
        const isActive = option.value === value;
        const isDisabled = disabled || option.disabled;

        return (
          <button
            aria-checked={isActive}
            className={styles.option}
            data-active={isActive || undefined}
            disabled={isDisabled}
            key={option.value}
            onClick={() => {
              if (!isDisabled && !isActive) {
                onChange(option.value);
              }
            }}
            role="radio"
            type="button"
          >
            <span className={styles.optionLabel}>{option.label}</span>
            {option.description != null && (
              <span className={styles.optionDescription}>
                {option.description}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default AdSegmentedControl;
