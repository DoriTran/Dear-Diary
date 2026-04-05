import type { CSSProperties, ReactNode } from 'react';

import clsx from 'clsx';

import styles from './NotchedCard.module.css';

export type NotchedCardProps = {
  children?: ReactNode;
  className?: string;
  width?: number | string;
  height?: number | string;
  style?: CSSProperties;
  selected?: boolean;
  onSelect?: () => void;
  [key: string]: any;
};

const NotchedCard = ({
  children,
  className = '',
  width = '100%',
  height = 50,
  style,
  selected = false,
  onSelect = () => {},
  ...props
}: NotchedCardProps) => {
  const heightVar = typeof height === 'number' ? `${height}px` : String(height);

  const wrapperStyle: CSSProperties = {
    width,
    height,
    ...({ '--height': heightVar } as CSSProperties),
  };

  return (
    <button
      className={clsx(
        styles.wrapper,
        selected && styles.wrapperSelected,
        className,
      )}
      style={{ ...wrapperStyle, ...style }}
      onClick={onSelect}
      {...props}
    >
      {children}
    </button>
  );
};

export default NotchedCard;
