import type { FC } from 'react';

import { Checkbox, type CheckboxProps } from '@mantine/core';

import styles from './AdCheckbox.module.css';

export type AdCheckboxProps = CheckboxProps;

const AdCheckbox: FC<AdCheckboxProps> = ({
  classNames,
  size = 'sm',
  radius = 'sm',
  variant = 'filled',
  vars,
  ...props
}) => {
  return (
    <Checkbox
      size={size}
      radius={radius}
      variant={variant}
      vars={(theme, props) => {
        const base = {
          root: {
            '--checkbox-color': 'var(--primary)',
            '--checkbox-icon-color':
              props.variant === 'outline'
                ? 'var(--primary)'
                : 'var(--surface)',
          },
        } as const;

        if (typeof vars === 'function') {
          const extra = vars(theme, props);
          return {
            ...base,
            ...extra,
            root: { ...base.root, ...extra?.root },
          };
        }

        return {
          ...base,
          ...vars,
          root: { ...base.root, ...vars?.root },
        };
      }}
      classNames={{
        root: styles.root,
        body: styles.body,
        inner: styles.inner,
        input: styles.input,
        icon: styles.icon,
        labelWrapper: styles.labelWrapper,
        label: styles.label,
        description: styles.description,
        error: styles.error,
        ...classNames,
      }}
      {...props}
    />
  );
};

export default AdCheckbox;
