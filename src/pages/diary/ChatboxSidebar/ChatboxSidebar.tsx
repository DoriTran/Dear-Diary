import { useEffect, useRef, type FC } from 'react';

import { AdDragDrop, useScrollOffset } from '@/packages/base';
import LayoutCard from '@/packages/ui/LayoutCard/LayoutCard';
import { useDiaryHydrated, useDiaryStore } from '@/store';

import styles from './ChatboxSidebar.module.css';
import Filter from './Filter/Filter';
import Header from './Header/Header';
import Search from './Search/Search';
import SortableChatbox from './SortableChatbox';
import SortableGroupBlock from './SortableGroupBlock';
import { useSidebarDnD } from './useSidebarDnD';
import { useSidebarRowViews } from './useSidebarRowViews';

export type ChatboxSidebarProps = {
  selectedId?: string;
  onSelect?: (id: string) => void;
};

const ChatboxSidebar: FC<ChatboxSidebarProps> = ({ selectedId, onSelect }) => {
  const hydrated = useDiaryHydrated();
  const seedIfEmpty = useDiaryStore('seedIfEmpty');
  const { rows, swap, add, remove } = useSidebarDnD();
  const rowViews = useSidebarRowViews(rows);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollerOffset = useScrollOffset(scrollerRef);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    seedIfEmpty();
  }, [hydrated, seedIfEmpty]);

  return (
    <LayoutCard
      tag="aside"
      className={styles.root}
      aria-label="My Diary chatboxes"
    >
      <Header />

      <div className={styles.searchRow}>
        <Search />
      </div>

      <Filter />

      <AdDragDrop
        droppable
        sortable
        group="diary-list"
        hostPreview
        autoScroll
        scrollRef={scrollerRef}
        extraScrollOffset={scrollerOffset}
        dropData={{ id: 'diary-list' }}
        onSortableChange={({ current, previous }) => {
          swap({ type: 'list' }, current, previous);
        }}
        onGroupChange={({ type, index, data }) => {
          if (type === 'enter') {
            add({ type: 'list' }, index, data);
          }
          if (type === 'leave') {
            remove({ type: 'list' }, index);
          }
        }}
      >
        <div className={styles.scroll}>
          {hydrated
            ? rowViews.map((view) =>
                view.type === 'group' ? (
                  <SortableGroupBlock
                    key={view.data.id}
                    data={view.data}
                    selectedId={selectedId}
                    onSelect={onSelect}
                    extraScrollOffset={scrollerOffset}
                    swap={swap}
                    add={add}
                    remove={remove}
                  />
                ) : (
                  <SortableChatbox
                    key={view.data.id}
                    data={view.data}
                    itemOf="diary-list"
                    selectedId={selectedId}
                    onSelect={onSelect}
                    extraScrollOffset={scrollerOffset}
                    onSortableChange={(current, previous) => {
                      swap({ type: 'list' }, current, previous);
                    }}
                  />
                ),
              )
            : null}
        </div>
      </AdDragDrop>
    </LayoutCard>
  );
};

export default ChatboxSidebar;
