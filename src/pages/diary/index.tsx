import { useState, type FC } from 'react';

import ChatboxSidebar from './ChatboxSidebar/ChatboxSidebar';
import DetailPanel from './DetailPanel/DetailPanel';
import styles from './index.module.css';
import MessagePanel from './MessagePanel/MessagePanel';

const Diary: FC = () => {
  const [selectedChatboxId, setSelectedChatboxId] = useState('study');
  const [detailPanelCollapsed, setDetailPanelCollapsed] = useState(false);

  return (
    <div className={styles.rootPage}>
      <ChatboxSidebar
        selectedId={selectedChatboxId}
        onSelect={setSelectedChatboxId}
      />
      <div className={styles.messageColumn}>
        <MessagePanel
          chatboxId={selectedChatboxId}
          detailPanelCollapsed={detailPanelCollapsed}
          onToggleDetailPanel={() => setDetailPanelCollapsed((value) => !value)}
        />
      </div>
      <DetailPanel
        chatboxId={selectedChatboxId}
        collapsed={detailPanelCollapsed}
      />
    </div>
  );
};

export default Diary;
