import {
  faBell,
  faBoxArchive,
  faEllipsis,
  faThumbtack,
} from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@mantine/core';
import clsx from 'clsx';
import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FC,
} from 'react';

import { AdIcon } from '@/packages/base';
import LayoutCard from '@/packages/ui/LayoutCard/LayoutCard';

import type { ChatboxData } from '../../types';

import styles from './Chatbox.module.css';
import {
  buildTagBackground,
  calculateFittingTagCount,
  formatChatboxTime,
  formatTotalMessages,
  sortTagsByCount,
  type ResolvedChatboxTag,
} from './chatbox.utils';

export type ChatboxProps = {
  data: ChatboxData;
  selected?: boolean;
  onSelect?: (id: string) => void;
};

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

const Chatbox: FC<ChatboxProps> = ({ data, selected, onSelect }) => {
  const {
    id,
    name,
    description,
    preview,
    tags,
    icon,
    color,
    iconBg,
    pinned,
    archived,
    hasUnread,
    notificationEnabled,
    totalMessage,
    lastMessageAt,
  } = data;

  const tagsKey = tags
    .map((tag) => `${tag.label}:${tag.count}:${tag.color}`)
    .join('|');
  const sortedTags = useMemo(() => sortTagsByCount(tags), [tagsKey]);
  const formattedTime = formatChatboxTime(lastMessageAt);

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
  }, [tagsKey, sortedTags.length]);

  const visibleTags = sortedTags.slice(0, tagLayout.visibleCount);
  const overflowCount = tagLayout.overflowCount;

  const tooltipLabel = (
    <div className={styles.tooltipContent}>
      <p className={styles.tooltipName}>{name}</p>
      {description ? (
        <p className={styles.tooltipDescription}>{description}</p>
      ) : null}
    </div>
  );

  const renderTagChip = (tag: ResolvedChatboxTag, measure = false) => (
    <span
      key={measure ? `measure-${tag.label}` : tag.label}
      className={styles.tag}
      data-tag-measure={measure || undefined}
      style={{ background: buildTagBackground(tag.color) }}
    >
      {tag.count} #{tag.label}
    </span>
  );

  return (
    <Tooltip
      label={tooltipLabel}
      openDelay={500}
      position="right"
      withArrow={false}
      multiline
      classNames={{
        tooltip: styles.tooltip,
      }}
    >
      <LayoutCard
        tag="div"
        className={styles.root}
        style={{ '--chatbox-color': color } as CSSProperties}
        data-active={selected || undefined}
      >
        {selected ? <span className={styles.accentBar} aria-hidden /> : null}

        <button
          type="button"
          className={styles.selectBtn}
          aria-current={selected ? 'true' : undefined}
          onClick={() => onSelect?.(id)}
        >
          <div className={styles.mainRow}>
            <div className={styles.leftZone}>
              <div className={styles.iconArea}>
                <span
                  className={styles.iconWrap}
                  style={{ background: iconBg }}
                  aria-hidden
                >
                  <AdIcon icon={icon} size={16} />
                </span>
                {pinned ? (
                  <span className={styles.overlayPin} aria-label="Pinned">
                    <AdIcon icon={faThumbtack} size={8} />
                  </span>
                ) : null}
                {archived ? (
                  <span className={styles.overlayArchive} aria-label="Archived">
                    <AdIcon icon={faBoxArchive} size={8} />
                  </span>
                ) : null}
              </div>

              <div className={styles.textColumn}>
                <h3 className={styles.name}>{name}</h3>
                {preview ? <p className={styles.preview}>{preview}</p> : null}
              </div>
            </div>

            <div className={styles.rightZone}>
              {formattedTime ? (
                <time
                  className={styles.time}
                  dateTime={lastMessageAt ?? undefined}
                >
                  {formattedTime}
                </time>
              ) : null}
              {totalMessage > 0 ? (
                <span
                  className={clsx(
                    styles.messageBadge,
                    hasUnread && styles.messageBadgeUnread,
                  )}
                  aria-label={hasUnread ? 'Unread messages' : undefined}
                >
                  {notificationEnabled ? (
                    <span className={styles.bell} aria-hidden>
                      <AdIcon icon={faBell} size={7} />
                    </span>
                  ) : null}
                  {formatTotalMessages(totalMessage)}
                </span>
              ) : null}
            </div>
          </div>

          {sortedTags.length > 0 ? (
            <div className={styles.tagsContainer} ref={tagsContainerRef}>
              <div className={styles.tagsMeasure} aria-hidden>
                {sortedTags.map((tag) => renderTagChip(tag, true))}
                <span
                  ref={overflowMeasureRef}
                  className={styles.tagOverflow}
                  data-overflow-measure
                >
                  +{sortedTags.length}
                </span>
              </div>

              <div className={styles.tags}>
                {visibleTags.map((tag) => renderTagChip(tag))}
                {overflowCount > 0 ? (
                  <span className={styles.tagOverflow}>+{overflowCount}</span>
                ) : null}
              </div>
            </div>
          ) : null}
        </button>

        <button
          type="button"
          className={styles.menuBtn}
          aria-label={`${name} options`}
          onClick={(event) => event.stopPropagation()}
        >
          <AdIcon icon={faEllipsis} size={12} />
        </button>
      </LayoutCard>
    </Tooltip>
  );
};

export default Chatbox;
