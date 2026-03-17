import type { CSSProperties, FC, HTMLAttributes } from 'react';

import clsx from 'clsx';

import Icon, { type IconProps } from '@/packages/base/AdIcon/AdIcon';

import styles from './Bookmark.module.css';

interface BookmarkProps extends HTMLAttributes<HTMLDivElement> {
  icon: IconProps['icon'];
  iconSize?: IconProps['size'];
  outline?: number;
  width?: number;
  height?: number;
  color?: string;
  iconColor?: string;
  outlineColor?: string;
  gradient?: string;
}

const Bookmark: FC<BookmarkProps> = ({
  icon,
  iconSize = 18,
  outline = 0,
  width = 40,
  height = 55,
  color = '#fff',
  iconColor = '#000',
  outlineColor = '#000',
  gradient,
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      className={clsx(styles.base, props.className)}
      style={{
        ...({
          '--bookmark-color': color,
        } as CSSProperties),
        width: width + outline,
        height: height + outline,
        ...(props.onClick && { cursor: 'pointer' }),
        ...(props.style || {}),
      }}
    >
      {!!outline && (
        <div
          style={{ backgroundColor: outlineColor }}
          className={clsx(styles.backLayer, styles.bookmark)}
        ></div>
      )}
      <div
        className={clsx(styles.frontLayer, styles.bookmark)}
        style={{
          background: gradient
            ? `linear-gradient(
                ${gradient},
                ${color} 35%,
                color-mix(in srgb, ${color} 60%, black) 100%
              )`
            : color,
          top: outline || 0,
          left: outline || 0,
          width: width - outline * 2,
          height: height - outline * 2,
        }}
      ></div>
      <div className={styles.content}>
        {icon && <Icon icon={icon} color={iconColor} size={iconSize} />}
        {children}
      </div>
    </div>
  );
};

export default Bookmark;
