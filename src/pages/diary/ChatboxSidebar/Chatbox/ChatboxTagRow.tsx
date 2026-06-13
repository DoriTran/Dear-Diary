import { useLayoutEffect, useMemo, useRef, useState, type FC } from 'react';

import { AdChip, type AdChipSize } from '@/packages/base';

import {
  calculateFittingTagCount,
  sortTagsByCount,
  type ResolvedChatboxTag,
} from './chatbox.utils';
import styles from './ChatboxTagRow.module.css';

const TAG_GAP_PX = 4.8;

type TagLayout = {
  visibleCount: number;
  overflowCount: number;
};

const applyTagLayout = (prev: TagLayout, next: TagLayout): TagLayout =>
  prev.visibleCount === next.visibleCount &&
  prev.overflowCount === next.overflowCount
    ? prev
    : next;

export type ChatboxTagRowProps = {
  tags: ResolvedChatboxTag[];
  className?: string;
  chipSize?: AdChipSize;
};

const overflowSizeClass = (chipSize: AdChipSize): string => {
  if (typeof chipSize === 'number') {
    return styles.overflowCustom;
  }

  return styles[`overflow_${chipSize}`];
};

const ChatboxTagRow: FC<ChatboxTagRowProps> = ({
  tags,
  className,
  chipSize = 'small',
}) => {
  const tagsKey = tags
    .map((tag) => `${tag.label}:${tag.count}:${tag.color}`)
    .join('|');
  const sortedTags = useMemo(() => sortTagsByCount(tags), [tagsKey]);

  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const tagMeasureRef = useRef<HTMLDivElement>(null);
  const overflowMeasureRef = useRef<HTMLSpanElement>(null);
  const [tagLayout, setTagLayout] = useState({
    visibleCount: sortedTags.length,
    overflowCount: 0,
  });
  const [layoutTagsKey, setLayoutTagsKey] = useState(tagsKey);

  if (layoutTagsKey !== tagsKey) {
    setLayoutTagsKey(tagsKey);
    setTagLayout({
      visibleCount: sortedTags.length,
      overflowCount: 0,
    });
  }

  useLayoutEffect(() => {
    if (sortedTags.length === 0) {
      return;
    }

    const container = tagsContainerRef.current;
    const measureRow = tagMeasureRef.current;
    const overflowMeasure = overflowMeasureRef.current;

    if (!container || !measureRow || !overflowMeasure) {
      return;
    }

    const measure = () => {
      const containerWidth = container.clientWidth;

      if (containerWidth <= 0) {
        return;
      }

      const tagElements = Array.from(
        measureRow.querySelectorAll<HTMLElement>('[data-tag-measure]'),
      );
      const tagWidths = tagElements.map((element) => element.offsetWidth);
      const overflowChipWidth = overflowMeasure.offsetWidth;

      setTagLayout((prev) =>
        applyTagLayout(
          prev,
          calculateFittingTagCount(
            tagWidths,
            containerWidth,
            TAG_GAP_PX,
            overflowChipWidth,
          ),
        ),
      );
    };

    const observer = new ResizeObserver(measure);
    observer.observe(container);

    return () => observer.disconnect();
  }, [tagsKey, sortedTags.length, chipSize]);

  if (sortedTags.length === 0) {
    return null;
  }

  const visibleTags = sortedTags.slice(0, tagLayout.visibleCount);
  const overflowCount = tagLayout.overflowCount;

  const overflowStyle =
    typeof chipSize === 'number'
      ? {
          height: chipSize,
          paddingInline: Math.round(chipSize * 0.42),
          fontSize: Math.max(10, Math.round(chipSize * 0.52)),
        }
      : undefined;

  const renderTagChip = (tag: ResolvedChatboxTag, measure = false) => (
    <AdChip
      key={measure ? `measure-${tag.label}` : tag.label}
      label={tag.label}
      color={tag.color}
      count={tag.count}
      size={chipSize}
      data-tag-measure={measure}
    />
  );

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      ref={tagsContainerRef}
    >
      <div className={styles.measure} aria-hidden>
        {sortedTags.map((tag) => renderTagChip(tag, true))}
        <span
          ref={overflowMeasureRef}
          className={[styles.overflow, overflowSizeClass(chipSize)]
            .filter(Boolean)
            .join(' ')}
          style={overflowStyle}
          data-overflow-measure
        >
          +{sortedTags.length}
        </span>
      </div>

      <div className={styles.tags}>
        {visibleTags.map((tag) => renderTagChip(tag))}
        {overflowCount > 0 ? (
          <span
            className={[styles.overflow, overflowSizeClass(chipSize)]
              .filter(Boolean)
              .join(' ')}
            style={overflowStyle}
          >
            +{overflowCount}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default ChatboxTagRow;
