import { useCallback, useEffect, useState, type FC } from 'react';

import LayoutCard from '@/packages/ui/LayoutCard/LayoutCard';
import { useDiaryStore } from '@/store';

import type { DetailPanelTab } from '../types';

import CategoryTab from './CategoryTab/CategoryTab';
import Header from './Header/Header';
import MediaTab from './MediaTab/MediaTab';
import OverviewTab from './OverviewTab/OverviewTab';
import Tabs from './Tabs/Tabs';
import { useDetailPanelData } from './useDetailPanelData';

import styles from './DetailPanel.module.css';

export type DetailPanelProps = {
  chatboxId: string;
  collapsed: boolean;
  onJumpToMessage: (messageId: string) => void;
  onFocusTimelineSearch: () => void;
  onEditChatbox: (chatboxId: string) => void;
};

const DetailPanel: FC<DetailPanelProps> = ({
  chatboxId,
  collapsed,
  onJumpToMessage,
  onFocusTimelineSearch,
  onEditChatbox,
}) => {
  const updateChatbox = useDiaryStore('updateChatbox');
  const data = useDetailPanelData(chatboxId);

  const [activeTab, setActiveTab] = useState<DetailPanelTab>('overview');
  const [pinnedExpanded, setPinnedExpanded] = useState(true);
  const [archivedExpanded, setArchivedExpanded] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  useEffect(() => {
    setActiveTab('overview');
    setPinnedExpanded(true);
    setArchivedExpanded(false);
    setSelectedTagIds([]);
  }, [chatboxId]);

  const handleToggleNotification = useCallback(() => {
    if (!data.identity) {
      return;
    }

    updateChatbox(chatboxId, {
      notificationEnabled: !data.identity.notificationEnabled,
    });
  }, [chatboxId, data.identity, updateChatbox]);

  const handlePinnedBarClick = useCallback(() => {
    setActiveTab('category');
    setPinnedExpanded(true);
  }, []);

  const handleArchivedBarClick = useCallback(() => {
    setActiveTab('category');
    setArchivedExpanded(true);
  }, []);

  const handleTopTagClick = useCallback((tagId: string) => {
    setActiveTab('category');
    setSelectedTagIds([tagId]);
  }, []);

  const handleToggleTag = useCallback((tagId: string) => {
    setSelectedTagIds((current) =>
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId],
    );
  }, []);

  if (!data.identity || !data.stats) {
    return null;
  }

  return (
    <LayoutCard
      tag="aside"
      className={styles.root}
      data-collapsed={collapsed || undefined}
      aria-label={`${data.identity.name} details`}
      aria-hidden={collapsed}
    >
      <Header
        identity={data.identity}
        onSearch={onFocusTimelineSearch}
        onEdit={() => onEditChatbox(chatboxId)}
        onToggleNotification={handleToggleNotification}
      />
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className={styles.scroll}>
        {activeTab === 'overview' ? (
          <OverviewTab
            stats={data.stats}
            topTags={data.topTags}
            onPinnedClick={handlePinnedBarClick}
            onArchivedClick={handleArchivedBarClick}
            onTagClick={handleTopTagClick}
          />
        ) : null}
        {activeTab === 'media' ? (
          <MediaTab
            mediaItems={data.mediaItems}
            onJumpToMessage={onJumpToMessage}
          />
        ) : null}
        {activeTab === 'category' ? (
          <CategoryTab
            pinnedMessages={data.pinnedMessages}
            archivedMessages={data.archivedMessages}
            allMessages={data.allMessages}
            tags={data.tags}
            pinnedExpanded={pinnedExpanded}
            archivedExpanded={archivedExpanded}
            selectedTagIds={selectedTagIds}
            onPinnedExpandedChange={setPinnedExpanded}
            onArchivedExpandedChange={setArchivedExpanded}
            onToggleTag={handleToggleTag}
            onJumpToMessage={onJumpToMessage}
          />
        ) : null}
      </div>
    </LayoutCard>
  );
};

export default DetailPanel;
