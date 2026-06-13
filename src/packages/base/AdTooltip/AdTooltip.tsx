import type { FC, ReactNode } from 'react';

import { Tooltip, type TooltipProps } from '@mantine/core';

export type AdTooltipProps = TooltipProps & {
  children: ReactNode;
};

const AdTooltip: FC<AdTooltipProps> = ({ children, ...tooltipProps }) => {
  return <Tooltip {...tooltipProps}>{children}</Tooltip>;
};

export default AdTooltip;
