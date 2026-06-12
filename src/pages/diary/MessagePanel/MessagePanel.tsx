import type { FC } from 'react';

import LayoutCard from '@/packages/ui/LayoutCard/LayoutCard';

import { diaryChatboxDetails, diaryMessageThreads } from '../data';
import Header from './Header/Header';
import InputFooter from './InputFooter/InputFooter';
import MessageFeed from './MessageFeed/MessageFeed';
import styles from './MessagePanel.module.css';

export type MessagePanelProps = {
  chatboxId: string;
  detailPanelCollapsed: boolean;
  onToggleDetailPanel: () => void;
};

const MessagePanel: FC<MessagePanelProps> = ({
  chatboxId,
  detailPanelCollapsed,
  onToggleDetailPanel,
}) => {
  const detail = diaryChatboxDetails[chatboxId];
  const thread = diaryMessageThreads[chatboxId];

  if (!detail || !thread) {
    return null;
  }

  return (
    <LayoutCard tag="main" className={styles.root} aria-label={detail.title}>
      <Header
        data={detail}
        detailPanelCollapsed={detailPanelCollapsed}
        onToggleDetailPanel={onToggleDetailPanel}
      />
      <MessageFeed groups={thread.groups} />
      <InputFooter />
    </LayoutCard>
  );
};

export default MessagePanel;
