import type { FC } from 'react';

import ChatboxSidebar from './ChatboxSidebar/ChatboxSidebar';
import styles from './index.module.css';

const Diary: FC = () => {
  return (
    <div className={styles.rootPage}>
      <ChatboxSidebar />
    </div>
  );
};

export default Diary;
