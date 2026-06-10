import { faChevronRight, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useId, useLayoutEffect, useRef, type FC } from 'react';

import { AdIcon } from '@/packages/base';
import { BrushHighlight } from '@/packages/ui';
import LayoutCard from '@/packages/ui/LayoutCard/LayoutCard';
import { useAppStore } from '@/store';

import type { GroupData } from '../../types';

import Chatbox from '../Chatbox/Chatbox';
import styles from './Group.module.css';
import { GROUP_BRUSH_SIZE } from './group.utils';

export type GroupProps = {
  data: GroupData;
  selectedId?: string;
  onSelect?: (id: string) => void;
};

const Group: FC<GroupProps> = ({ data, selectedId, onSelect }) => {
  const titleId = useId();
  const listId = useId();
  const { id, title, brushColor, groupIcon, chatboxes } = data;

  const { diaryPage, toggleGroup } = useAppStore(['diaryPage', 'toggleGroup']);
  const isExpanded = diaryPage.expandedGroupIds.has(id);

  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const hasMeasured = useRef(false);

  useLayoutEffect(() => {
    const list = listRef.current;
    const root = rootRef.current;

    if (!list || !root) {
      return;
    }

    const updateHeight = () => {
      root.style.setProperty('--list-height', `${list.scrollHeight}px`);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(list);

    if (!hasMeasured.current) {
      const frame = requestAnimationFrame(() => {
        hasMeasured.current = true;
        root.dataset.ready = 'true';
        root.dataset.mounted = 'true';
      });

      return () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
      };
    }

    return () => observer.disconnect();
  }, [chatboxes.length]);

  return (
    <section
      ref={rootRef}
      className={styles.root}
      data-expanded={isExpanded || undefined}
      aria-labelledby={titleId}
    >
      <header className={styles.header}>
        <button
          type="button"
          className={styles.titleBtn}
          aria-expanded={isExpanded}
          aria-controls={listId}
          onClick={() => toggleGroup(id)}
        >
          <BrushHighlight
            color={brushColor}
            height={GROUP_BRUSH_SIZE}
            shadow
            paintOpacity={0.95}
            className={styles.brush}
            spacing={{ left: 12, right: 30 }}
            id={titleId}
          >
            <div className={styles.brushInner}>
              <span className={styles.caret} aria-hidden>
                <AdIcon icon={faChevronRight} size={10} />
              </span>
              <span className={styles.groupIcon} aria-hidden>
                <AdIcon icon={groupIcon} size={14} />
              </span>
              <span className={styles.titleText}>{title}</span>
            </div>
          </BrushHighlight>
        </button>
        {!isExpanded ? (
          <LayoutCard className={styles.countCard}>
            <span className={styles.count}>{chatboxes.length}</span>
          </LayoutCard>
        ) : null}
      </header>
      <button
        className={styles.menuBtn}
        type="button"
        aria-label={`${title} group options`}
      >
        <AdIcon icon={faEllipsis} size={14} />
      </button>
      <div
        className={styles.listShell}
        id={listId}
        aria-hidden={!isExpanded || undefined}
      >
        <div className={styles.list} ref={listRef}>
          {chatboxes.map((chatbox) => (
            <div key={chatbox.id} className={styles.listItem}>
              <Chatbox
                data={chatbox}
                selected={chatbox.id === selectedId}
                onSelect={onSelect}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Group;
