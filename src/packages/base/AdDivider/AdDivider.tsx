import type { FC, ReactNode } from 'react';

import { Divider, type DividerProps } from '@mantine/core';

export interface AdDividerProps extends Omit<
  DividerProps,
  'label' | 'orientation' | 'children'
> {
  /** Divider label (maps to Mantine `label`; horizontal only) */
  children?: ReactNode;

  /** When `true`, renders a vertical divider. Default: horizontal */
  vertical?: boolean;
}

const AdDivider: FC<AdDividerProps> = ({
  children,
  vertical = false,
  ...dividerProps
}) => {
  return (
    <Divider
      {...dividerProps}
      label={children}
      orientation={vertical ? 'vertical' : 'horizontal'}
    />
  );
};

export default AdDivider;
