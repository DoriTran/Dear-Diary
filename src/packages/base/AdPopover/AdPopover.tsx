import type { FC, ReactNode } from 'react';

import {
  Popover,
  type PopoverProps,
  type PopoverTargetProps,
} from '@mantine/core';

export interface AdPopoverProps extends Omit<PopoverProps, 'children'> {
  /** Popover.Target content (must be a single element that accepts ref) */
  anchor: ReactNode;

  /** Popover.Dropdown content */
  children?: ReactNode;

  /** Passed to Popover.Target */
  targetRefProp?: PopoverTargetProps['refProp'];
  targetPopupType?: PopoverTargetProps['popupType'];
}

const AdPopover: FC<AdPopoverProps> = ({
  anchor,
  children,
  targetRefProp,
  targetPopupType,
  ...popoverProps
}) => {
  return (
    <Popover {...popoverProps}>
      <Popover.Target popupType={targetPopupType} refProp={targetRefProp}>
        {anchor}
      </Popover.Target>

      {children !== null && <Popover.Dropdown>{children}</Popover.Dropdown>}
    </Popover>
  );
};

export default AdPopover;
