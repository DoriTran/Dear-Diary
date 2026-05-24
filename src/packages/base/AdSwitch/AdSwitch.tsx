import type {
  ButtonHTMLAttributes,
  CSSProperties,
  FC,
  MouseEvent,
  ReactNode,
} from 'react';

import clsx from 'clsx';

import styles from './AdSwitch.module.css';

export interface AdSwitchProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'onClick' | 'value' | 'className'
> {
  /** State & behavior */
  value: boolean;
  onSwitch: () => void;

  /** Track (--switch-bg-color) */
  backgroundColor?: string;

  /** Thumb (--switch-thumb-color, --thumb-size) */
  thumbColor?: string;
  thumbSize?: string | number;

  /** Track size (--switch-width, --switch-height) */
  width?: string | number;
  height?: string | number;

  /** Slots (children behind thumb, overlay above thumb) */
  children?: ReactNode;
  overlay?: ReactNode;

  /** Root button */
  className?: string;

  /** Children layer */
  childrenClassName?: string;
  childrenStyle?: CSSProperties;

  /** Overlay layer */
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
}

const AdSwitch: FC<AdSwitchProps> = ({
  /** State & behavior */
  value,
  onSwitch,

  /** Track */
  backgroundColor,
  width,
  height,

  /** Thumb */
  thumbColor,
  thumbSize,

  /** Slots */
  children,
  overlay,

  /** Root button */
  className,
  type = 'button',

  /** Children layer */
  childrenClassName,
  childrenStyle,

  /** Overlay layer */
  overlayClassName,
  overlayStyle,

  ...buttonProps
}) => {
  const trackStyle: CSSProperties = {
    ...(backgroundColor && { backgroundColor }),
    ...(width != null && { width }),
    ...(height != null && { height }),
    ...(thumbSize != null && { '--thumb-size': thumbSize }),
  };

  const thumbStyle: CSSProperties = thumbColor
    ? { backgroundColor: thumbColor }
    : {};

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onSwitch();
  };

  return (
    <button
      {...buttonProps}
      aria-checked={value}
      className={clsx(styles.root, className)}
      onClick={onSwitch}
      role="switch"
      type={type}
    >
      <span className={styles.track} style={trackStyle}>
        {children != null && (
          <div
            className={clsx(styles.content, childrenClassName)}
            style={childrenStyle}
          >
            {children}
          </div>
        )}

        <span
          aria-hidden
          className={styles.thumb}
          data-checked={value}
          style={thumbStyle}
        />

        <div
          aria-hidden
          className={clsx(styles.overlay, overlayClassName)}
          onClick={handleOverlayClick}
          style={overlayStyle}
        >
          {overlay}
        </div>
      </span>
    </button>
  );
};

export default AdSwitch;
