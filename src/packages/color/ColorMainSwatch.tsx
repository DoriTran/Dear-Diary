import type { CSSProperties, FC, HTMLAttributes, ReactNode } from 'react';

import { useResolvedPalette } from './useResolvedPalette';
import type { ColorId } from './types';

export type ColorMainSwatchProps = HTMLAttributes<HTMLSpanElement> & {
  colorId: ColorId;
  style?: CSSProperties;
  children?: ReactNode;
};

const ColorMainSwatch: FC<ColorMainSwatchProps> = ({
  colorId,
  className,
  style,
  children,
  ...rest
}) => {
  const palette = useResolvedPalette(colorId);

  return (
    <span
      className={className}
      style={{ background: palette.main, ...style }}
      {...rest}
    >
      {children}
    </span>
  );
};

export default ColorMainSwatch;
