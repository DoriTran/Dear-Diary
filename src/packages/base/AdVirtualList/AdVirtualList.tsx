import { useVirtualizer } from '@tanstack/react-virtual';
import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';

import styles from './AdVirtualList.module.css';

export type AdVirtualListScrollToOptions = {
  align?: 'start' | 'center' | 'end' | 'auto';
  behavior?: ScrollBehavior;
};

export type AdVirtualListHandle = {
  scrollToIndex: (
    index: number,
    options?: AdVirtualListScrollToOptions,
  ) => void;
};

export type AdVirtualListProps = {
  itemCount: number;
  renderItem: (index: number) => ReactNode;
  estimateSize: number | ((index: number) => number);
  overscan?: number;
  getItemKey?: (index: number) => string | number;
  className?: string;
  style?: CSSProperties;
  /**
   * Optional external scroll parent. When set, this list does not scroll itself —
   * items virtualize against the parent's scroll position (useful when the list
   * lives inside an existing scroll container alongside other, non-virtualized content).
   */
  scrollElementRef?: RefObject<HTMLElement | null>;
  /**
   * Set to false when every item has the same, CSS-predictable height (the common
   * case, e.g. uniform grid rows). Skips per-item DOM remeasurement, which avoids
   * `@tanstack/react-virtual`'s automatic scroll-position correction — that
   * correction directly writes `scrollElement.scrollTop` and is only meant for
   * genuinely variable-height content.
   * Defaults to true (dynamic measurement).
   */
  dynamicSize?: boolean;
};

const measureScrollMargin = (
  listEl: HTMLElement,
  scrollEl: HTMLElement,
): number =>
  listEl.getBoundingClientRect().top -
  scrollEl.getBoundingClientRect().top +
  scrollEl.scrollTop;

/**
 * Vertical virtual list powered by `@tanstack/react-virtual`.
 *
 * By default fills the parent's height (`height: 100%`) and scrolls itself.
 * Pass `scrollElementRef` to virtualize against an external scroll parent instead
 * (use a single `AdVirtualList` instance per shared scroll parent — multiple
 * instances each attaching their own scroll listener/measurements to the same
 * element can fight each other and cause visible scroll jumps).
 */
const AdVirtualList = forwardRef<AdVirtualListHandle, AdVirtualListProps>(
  (
    {
      itemCount,
      renderItem,
      estimateSize,
      overscan = 6,
      getItemKey,
      className,
      style,
      scrollElementRef,
      dynamicSize = true,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const usesExternalScroll = scrollElementRef !== undefined;
    const [scrollMargin, setScrollMargin] = useState(0);

    const resolveEstimateSize =
      typeof estimateSize === 'function' ? estimateSize : () => estimateSize;

    useLayoutEffect(() => {
      if (!usesExternalScroll) {
        return;
      }

      const listEl = containerRef.current;
      const scrollEl = scrollElementRef.current;
      if (!listEl || !scrollEl) {
        return;
      }

      const update = () => {
        setScrollMargin(measureScrollMargin(listEl, scrollEl));
      };

      update();

      const resizeObserver = new ResizeObserver(update);
      resizeObserver.observe(scrollEl);
      resizeObserver.observe(listEl);

      return () => resizeObserver.disconnect();
    }, [usesExternalScroll, scrollElementRef]);

    // TanStack Virtual intentionally returns unstable function identities;
    // React Compiler skips memoizing this component (expected / safe here).
    // eslint-disable-next-line react-hooks/incompatible-library -- useVirtualizer API
    const virtualizer = useVirtualizer({
      count: itemCount,
      getScrollElement: () =>
        usesExternalScroll
          ? (scrollElementRef.current ?? null)
          : containerRef.current,
      estimateSize: resolveEstimateSize,
      overscan,
      getItemKey,
      scrollMargin: usesExternalScroll ? scrollMargin : 0,
    });

    useImperativeHandle(
      ref,
      () => ({
        scrollToIndex: (index, options) =>
          virtualizer.scrollToIndex(index, options),
      }),
      [virtualizer],
    );

    const virtualItems = virtualizer.getVirtualItems();
    const totalSize = virtualizer.getTotalSize();

    return (
      <div
        ref={containerRef}
        className={
          className
            ? `${usesExternalScroll ? styles.external : styles.root} ${className}`
            : usesExternalScroll
              ? styles.external
              : styles.root
        }
        style={usesExternalScroll ? { height: totalSize, ...style } : style}
      >
        <div className={styles.inner} style={{ height: totalSize }}>
          {virtualItems.map((virtualItem) => (
            <div
              key={virtualItem.key}
              className={styles.item}
              data-index={virtualItem.index}
              ref={dynamicSize ? virtualizer.measureElement : undefined}
              style={{
                transform: `translateY(${virtualItem.start - (usesExternalScroll ? scrollMargin : 0)}px)`,
                height: dynamicSize ? undefined : virtualItem.size,
              }}
            >
              {renderItem(virtualItem.index)}
            </div>
          ))}
        </div>
      </div>
    );
  },
);

AdVirtualList.displayName = 'AdVirtualList';

export default AdVirtualList;
