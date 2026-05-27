import type { FC } from 'react';

import LayoutCard from '@/packages/ui/LayoutCard/LayoutCard';

import Filter from '../components/Filter/Filter';
import Group from '../components/Group/Group';
import Header from '../components/Header/Header';
import Search from '../components/Search/Search';
import { diarySidebarGroups } from '../data';
import styles from './ChatboxSidebar.module.css';

const ChatboxSidebar: FC = () => {
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
          <Group key={group.id} data={group} />
        ))}
      </div>
    </LayoutCard>
  );
};

export default ChatboxSidebar;
