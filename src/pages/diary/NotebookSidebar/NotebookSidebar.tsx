import { useState } from 'react';

import ChatboxItem from './ChatboxItem/ChatboxItem';
import NotebookGroup from './NotebookGroup/NotebookGroup';
import styles from './NotebookSidebar.module.css';
import SearchBox from './SearchBox/SearchBox';

const NotebookSidebar = () => {
  const [searchText, setSearchText] = useState('');
  const [activeChatId, setActiveChatId] = useState<string>('2');

  return (
    <div className={styles.container}>
      <SearchBox searchText={searchText} setSearchText={setSearchText} />
      <div className={styles.rootItems}>
        <NotebookGroup title="Main">
          <ChatboxItem
            title="Study"
            subtitle="I'm going to learn Japanese today!"
            count={15}
            selected={activeChatId === '1'}
            onClick={() => setActiveChatId('1')}
          />
          <ChatboxItem
            title="Study"
            subtitle="I'm going to learn Japanese today!"
            count={15}
            selected={activeChatId === '2'}
            onClick={() => setActiveChatId('2')}
          />
        </NotebookGroup>
        <ChatboxItem
          title="Study"
          subtitle="I'm going to learn Japanese today!"
          count={15}
          selected={activeChatId === '1'}
          onClick={() => setActiveChatId('1')}
        />
      </div>
    </div>
  );
};

export default NotebookSidebar;
