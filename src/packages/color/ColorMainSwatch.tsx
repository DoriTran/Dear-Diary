import type { CSSProperties, FC, HTMLAttributes, ReactNode } from 'react';

import type { ColorId } from './types';

import { useResolvedPalette } from './useResolvedPalette';

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
