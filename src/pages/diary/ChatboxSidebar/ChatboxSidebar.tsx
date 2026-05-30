import type { FC } from 'react';

import LayoutCard from '@/packages/ui/LayoutCard/LayoutCard';

import { diarySidebarGroups } from '../data';
import Filter from './Filter/Filter';
import Group from './Group/Group';
import Header from './Header/Header';
import Search from './Search/Search';
import styles from './ChatboxSidebar.module.css';

export type ChatboxSidebarProps = {
  selectedId?: string;
  onSelect?: (id: string) => void;
};

const ChatboxSidebar: FC<ChatboxSidebarProps> = ({ selectedId, onSelect }) => {
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
        {diarySidebarGroups.map((group) => (
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
