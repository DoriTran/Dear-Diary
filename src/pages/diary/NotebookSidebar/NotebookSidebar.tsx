import { useMemo, useState } from 'react';

import type { Chatbox, DiaryRootItem } from '@/store/diary/type';

import { useDiaryStore, useShallow } from '@/store';

import ChatboxItem from './ChatboxItem/ChatboxItem';
import NotebookGroup from './NotebookGroup/NotebookGroup';
import styles from './NotebookSidebar.module.css';
import SearchBox from './SearchBox/SearchBox';

function matchesQuery(query: string, ...parts: string[]): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = parts.join(' ').toLowerCase();
  return haystack.includes(q);
}

function filterRootItems(
  items: DiaryRootItem[],
  query: string,
): DiaryRootItem[] {
  if (!query.trim()) return items;

  return items
    .map((item): DiaryRootItem | null => {
      if (item.type === 'chatbox') {
        const { title, description } = item.data;
        return matchesQuery(query, title, description) ? item : null;
      }

      const { data: group, chatboxes } = item;
      const groupMatches = matchesQuery(query, group.title, group.description);
      const nextChatboxes = groupMatches
        ? chatboxes
        : chatboxes.filter((cb) =>
            matchesQuery(query, cb.title, cb.description),
          );

      if (nextChatboxes.length === 0) return null;

      return {
        type: 'group',
        data: group,
        chatboxes: nextChatboxes,
      };
    })
    .filter((item): item is DiaryRootItem => item !== null);
}

const NotebookSidebar = () => {
  const [searchText, setSearchText] = useState('');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const { orders, groups, chatboxes } = useShallow(useDiaryStore)([
    'orders',
    'groups',
    'chatboxes',
  ]);

  const rootItems = useMemo(
    () => useDiaryStore.getState().getRootItems(),
    [orders, groups, chatboxes],
  );

  const visibleItems = useMemo(
    () => filterRootItems(rootItems, searchText),
    [rootItems, searchText],
  );

  const renderChatboxItem = (cb: Chatbox) => (
    <ChatboxItem
      key={cb.id}
      title={cb.title}
      subtitle={cb.description}
      count={orders.chatboxMessageOrders[cb.id]?.length ?? 0}
      selected={activeChatId === cb.id}
      onClick={() => setActiveChatId(cb.id)}
    />
  );

  return (
    <div className={styles.container}>
      <SearchBox searchText={searchText} setSearchText={setSearchText} />
      <div className={styles.rootItems}>
        {visibleItems.map((item: DiaryRootItem) => {
          if (item.type === 'chatbox') {
            return renderChatboxItem(item.data);
          }

          const { data: group, chatboxes: groupChatboxes } = item;
          return (
            <NotebookGroup
              key={group.id}
              title={group.title}
              brushColor={group.color || undefined}
            >
              {groupChatboxes.map((cb) => renderChatboxItem(cb))}
            </NotebookGroup>
          );
        })}
      </div>
    </div>
  );
};

export default NotebookSidebar;
