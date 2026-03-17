import clsx from 'clsx';
import {
  Fragment,
  forwardRef,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from 'react';

import styles from './BrushHighlight.module.css';

export interface BrushHighlightProps extends HTMLAttributes<HTMLDivElement> {
  color?: string;
  size?: number;
  brushes?: number;
  children?: ReactNode;
}

const BrushHighlight: ForwardRefExoticComponent<
  BrushHighlightProps & RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, BrushHighlightProps>(
  (
    { color = 'var(--primary)', size = 25, brushes = 1, children, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        {...props}
        className={clsx(styles.brushes, props.className)}
        style={{
          height: size,
          width: size * (2 + brushes),
          ...({
            '--brush-color': color,
            '--brush-size': `${size}px`,
          } as CSSProperties),
          ...(props.style || {}),
        }}
      >
        <div className={styles.startBrushTop}></div>
        <div className={styles.startBrushBottom}></div>
        <div className={styles.endBrush}></div>
        {Array.from({ length: brushes }).map((_, index) => (
          <Fragment key={index}>
            <div
              className={clsx(styles.middleBrush, styles.middleBrushTop)}
              style={{ left: size * 0.8 + index * size }}
            ></div>
            <div
              className={clsx(styles.middleBrush, styles.middleBrushBottom)}
              style={{ left: size * 0.5 + index * size }}
            ></div>
          </Fragment>
        ))}
        <div
          className={styles.content}
          style={{
            textAlign: brushes === 1 ? 'center' : 'left',
            lineHeight: `${size}px`,
          }}
        >
          {children}
        </div>
      </div>
    );
  },
);

BrushHighlight.displayName = 'BrushHighlight';

export default BrushHighlight;
