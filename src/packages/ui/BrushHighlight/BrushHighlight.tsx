import clsx from 'clsx';
import {
  forwardRef,
  useId,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from 'react';

import {
  BRUSH_LEFT_CAP_CLIP,
  BRUSH_LEFT_CAP_PATH,
  BRUSH_LEFT_CAP_VIEWBOX,
  BRUSH_RIGHT_CAP_PATH,
  BRUSH_RIGHT_CAP_SCALE,
  BRUSH_RIGHT_CAP_VIEWBOX,
  getBrushMiddleMaskUrl,
} from './brush-paths';
import styles from './BrushHighlight.module.css';

export type BrushHighlightSpacing = number | { left?: number; right?: number };

export interface BrushHighlightProps extends HTMLAttributes<HTMLDivElement> {
  color?: string;
  /** Minimum brush height (px). Grows if content is taller. */
  height?: number;
  /**
   * Content inline padding (px). A number sets both sides; an object can set
   * `left` and/or `right` only. Overrides root/class padding for set sides.
   */
  spacing?: BrushHighlightSpacing;
  shadow?: boolean;
  paintOpacity?: number;
  children?: ReactNode;
}

const PADDING_STYLE_KEYS = [
  'padding',
  'paddingInline',
  'paddingInlineStart',
  'paddingInlineEnd',
  'paddingLeft',
  'paddingRight',
] as const satisfies readonly (keyof CSSProperties)[];

function omitPaddingStyle(style: CSSProperties | undefined): CSSProperties {
  if (!style) {
    return {};
  }
  const next = { ...style };
  for (const key of PADDING_STYLE_KEYS) {
    delete next[key];
  }
  return next;
}

function sanitizeId(rawId: string): string {
  return rawId.replace(/:/g, '');
}

function clampSpacingPx(value: number): number {
  return Math.max(0, value);
}

function resolveContentPadding(
  spacing: BrushHighlightSpacing | undefined,
): CSSProperties | undefined {
  if (spacing == null) {
    return undefined;
  }

  if (typeof spacing === 'number') {
    const px = clampSpacingPx(spacing);
    return { paddingInline: `${px}px` };
  }

  const left = spacing.left != null ? clampSpacingPx(spacing.left) : undefined;
  const right =
    spacing.right != null ? clampSpacingPx(spacing.right) : undefined;

  if (left == null && right == null) {
    return undefined;
  }

  return {
    ...(left != null && { paddingInlineStart: `${left}px` }),
    ...(right != null && { paddingInlineEnd: `${right}px` }),
  };
}

function hasCustomSpacing(spacing: BrushHighlightSpacing | undefined): boolean {
  if (spacing == null) {
    return false;
  }
  if (typeof spacing === 'number') {
    return true;
  }
  return spacing.left != null || spacing.right != null;
}

const BrushHighlight: ForwardRefExoticComponent<
  BrushHighlightProps & RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, BrushHighlightProps>(
  (
    {
      color = 'var(--primary)',
      height = 28,
      spacing,
      shadow = true,
      paintOpacity = 0.95,
      children,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const reactId = useId();
    const leftClipId = `brush-left-clip-${sanitizeId(reactId)}`;
    const opacity = Math.min(1, Math.max(0, paintOpacity));
    const capWidth = (height * 58) / 64;
    const middleTileWidth = (height * 84) / 61;
    const useCustomSpacing = hasCustomSpacing(spacing);
    const contentPadding = resolveContentPadding(spacing);

    return (
      <div
        ref={ref}
        {...props}
        className={clsx(
          styles.root,
          useCustomSpacing && styles.rootSpacing,
          className,
        )}
        style={
          {
            ...(useCustomSpacing ? omitPaddingStyle(style) : style),
            '--brush-height': `${height}px`,
            '--brush-cap-width': `${capWidth}px`,
            '--brush-color': color,
            '--brush-opacity': opacity,
            '--brush-middle-mask': getBrushMiddleMaskUrl(),
            '--brush-middle-tile-width': `${middleTileWidth}px`,
          } as CSSProperties
        }
      >
        <div
          className={clsx(styles.paint, shadow && styles.paintShadow)}
          aria-hidden
        >
          <svg
            className={styles.leftCap}
            viewBox={BRUSH_LEFT_CAP_VIEWBOX}
            preserveAspectRatio="none"
          >
            <defs>
              <clipPath id={leftClipId}>
                <path d={BRUSH_LEFT_CAP_CLIP} />
              </clipPath>
            </defs>
            <path
              className={styles.paintPath}
              d={BRUSH_LEFT_CAP_PATH}
              clipPath={`url(#${leftClipId})`}
            />
          </svg>

          <div className={styles.middle} />

          <svg
            className={styles.rightCap}
            viewBox={BRUSH_RIGHT_CAP_VIEWBOX}
            preserveAspectRatio="none"
          >
            <g transform={`scale(${BRUSH_RIGHT_CAP_SCALE} 1)`}>
              <path className={styles.paintPath} d={BRUSH_RIGHT_CAP_PATH} />
            </g>
          </svg>
        </div>

        <div className={styles.content} style={contentPadding}>
          {children}
        </div>
      </div>
    );
  },
);

BrushHighlight.displayName = 'BrushHighlight';

export default BrushHighlight;
