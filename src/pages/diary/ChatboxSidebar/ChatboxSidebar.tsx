import { useEffect, type FC } from 'react';

import LayoutCard from '@/packages/ui/LayoutCard/LayoutCard';
import { useDiaryStore } from '@/store';

import Filter from './Filter/Filter';
import Group from './Group/Group';
import Header from './Header/Header';
import Search from './Search/Search';
import styles from './ChatboxSidebar.module.css';
import { useSidebarGroups } from './useSidebarGroups';

export type ChatboxSidebarProps = {
  selectedId?: string;
  onSelect?: (id: string) => void;
};

const ChatboxSidebar: FC<ChatboxSidebarProps> = ({ selectedId, onSelect }) => {
  const seedIfEmpty = useDiaryStore('seedIfEmpty');
  const groups = useSidebarGroups();

  useEffect(() => {
    seedIfEmpty();
  }, [seedIfEmpty]);

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

      <div className={styles.scroll}>
        {groups.map((group) => (
          <Group
            key={group.id}
            data={group}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </LayoutCard>
  );
};

export default ChatboxSidebar;
