import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import type { FC } from 'react';

import type { Message } from '@/store/diary/type';

import { AdChip, AdIcon } from '@/packages/base';

import { filterMessagesByTags } from '../detailPanel.utils';
import type { DetailPanelTag } from '../detailPanel.utils';
import DetailMessagePreviewRow from '../components/DetailMessagePreviewRow';
import InfoCallout from '../components/InfoCallout';

import styles from './CategoryTab.module.css';

export type CategoryTabProps = {
  pinnedMessages: Message[];
  archivedMessages: Message[];
  allMessages: Message[];
  tags: DetailPanelTag[];
  pinnedExpanded: boolean;
  archivedExpanded: boolean;
  selectedTagIds: string[];
  onPinnedExpandedChange: (expanded: boolean) => void;
  onArchivedExpandedChange: (expanded: boolean) => void;
  onToggleTag: (tagId: string) => void;
  onJumpToMessage: (messageId: string) => void;
};

const CategoryTab: FC<CategoryTabProps> = ({
  pinnedMessages,
  archivedMessages,
  allMessages,
  tags,
  pinnedExpanded,
  archivedExpanded,
  selectedTagIds,
  onPinnedExpandedChange,
  onArchivedExpandedChange,
  onToggleTag,
  onJumpToMessage,
}) => {
  const filteredMessages = filterMessagesByTags(allMessages, selectedTagIds);

  const getTagLabels = (message: Message): string[] =>
    message.tagIds
      .map((tagId) => tags.find((tag) => tag.tagId === tagId)?.label)
      .filter((label): label is string => Boolean(label))
      .map((label) => `#${label}`);

  return (
    <div className={styles.root}>
      <section className={styles.zone}>
        <h3 className={styles.zoneHeading}>Pin &amp; Archive</h3>

        <div className={styles.accordion}>
          <button
            type="button"
            className={styles.accordionHeader}
            aria-expanded={pinnedExpanded}
            data-expanded={pinnedExpanded || undefined}
            onClick={() => onPinnedExpandedChange(!pinnedExpanded)}
          >
            <span className={styles.caret}>
              <AdIcon icon={faChevronRight} size={10} />
            </span>
            <span>Pinned Messages ({pinnedMessages.length})</span>
          </button>
          {pinnedExpanded ? (
            <div className={styles.accordionBody}>
              {pinnedMessages.length > 0 ? (
                pinnedMessages.map((message) => (
                  <DetailMessagePreviewRow
                    key={message.id}
                    message={message}
                    showPin
                    onClick={() => onJumpToMessage(message.id)}
                  />
                ))
              ) : (
                <p className={styles.empty}>No pinned messages.</p>
              )}
            </div>
          ) : null}
        </div>

        <div className={styles.accordion}>
          <button
            type="button"
            className={styles.accordionHeader}
            aria-expanded={archivedExpanded}
            data-expanded={archivedExpanded || undefined}
            onClick={() => onArchivedExpandedChange(!archivedExpanded)}
          >
            <span className={styles.caret}>
              <AdIcon icon={faChevronRight} size={10} />
            </span>
            <span>Archived Messages ({archivedMessages.length})</span>
          </button>
          {archivedExpanded ? (
            <div className={styles.accordionBody}>
              {archivedMessages.length > 0 ? (
                archivedMessages.map((message) => (
                  <DetailMessagePreviewRow
                    key={message.id}
                    message={message}
                    onClick={() => onJumpToMessage(message.id)}
                  />
                ))
              ) : (
                <p className={styles.empty}>No archived messages.</p>
              )}
            </div>
          ) : null}
        </div>
      </section>

      <section className={styles.zone}>
        <h3 className={styles.zoneHeading}>Tags</h3>

        {tags.length > 0 ? (
          <div className={styles.tagPills}>
            {tags.map((tag) => {
              const selected = selectedTagIds.includes(tag.tagId);

              return (
                <button
                  key={tag.tagId}
                  type="button"
                  className={styles.tagButton}
                  data-selected={selected || undefined}
                  onClick={() => onToggleTag(tag.tagId)}
                >
                  <AdChip
                    label={tag.label}
                    color={tag.color}
                    count={tag.count}
                    size="medium"
                  />
                </button>
              );
            })}
          </div>
        ) : (
          <p className={styles.empty}>No tags in this chatbox yet.</p>
        )}

        {selectedTagIds.length > 0 ? (
          <div className={styles.filteredList}>
            {filteredMessages.map((message) => (
              <DetailMessagePreviewRow
                key={message.id}
                message={message}
                tagLabels={getTagLabels(message)}
                onClick={() => onJumpToMessage(message.id)}
              />
            ))}
            {filteredMessages.length === 0 ? (
              <p className={styles.empty}>No messages match these tags.</p>
            ) : null}
          </div>
        ) : null}

        <InfoCallout>
          Select multiple tags to filter with OR logic. Click a message preview
          to jump to it in the timeline.
        </InfoCallout>
      </section>
    </div>
  );
};

export default CategoryTab;
