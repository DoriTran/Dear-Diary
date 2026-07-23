import { faReply, faSmile, faTags } from '@fortawesome/free-solid-svg-icons';
import { useMemo, useState, type FC } from 'react';

import type { Message } from '@/store/diary/type';

import {
  AdActionButton,
  AdEmojiPickerPanel,
  AdPopover,
  AdQuickReactionBar,
  AdSelect,
} from '@/packages/base';
import { DEFAULT_COLOR_ID } from '@/packages/color';
import { useDiaryStore } from '@/store';

import type { MessageActionsAPI } from '../../../.hooks/useMessageActions';

import styles from './HoverActions.module.css';
import MoreMenu from './MoreMenu';

const mergeClass = (...parts: Array<string | undefined>) =>
  parts.filter(Boolean).join(' ');

export type HoverActionsProps = {
  message: Message;
  actions: MessageActionsAPI;
  side: 'left' | 'right';
  className?: string;
};

const HoverActions: FC<HoverActionsProps> = ({
  message,
  actions,
  side,
  className,
}) => {
  const tags = useDiaryStore('tags');
  const createTag = useDiaryStore('createTag');
  const [reactionOpen, setReactionOpen] = useState(false);
  const [fullPickerOpen, setFullPickerOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const popupOpen = reactionOpen || tagOpen || menuOpen;

  const tagOptions = useMemo(
    () =>
      Object.values(tags).map((tag) => ({
        value: tag.id,
        label: tag.label,
        colorId: tag.colorId,
      })),
    [tags],
  );

  const handleReactionSelect = (emoji: string) => {
    actions.toggleReaction(message.id, emoji);
    setReactionOpen(false);
    setFullPickerOpen(false);
  };

  const replyDisabled =
    actions.replyToMessageId === message.id ||
    actions.editTargetId === message.id;

  return (
    <div
      className={mergeClass(styles.root, className)}
      data-side={side}
      data-open={popupOpen || undefined}
    >
      <MoreMenu
        message={message}
        actions={actions}
        opened={menuOpen}
        onOpenChange={setMenuOpen}
      />
      <AdActionButton
        icon={faReply}
        label="Reply"
        disabled={replyDisabled}
        onClick={() => actions.startReply(message.id)}
      />
      <AdPopover
        opened={tagOpen}
        onChange={setTagOpen}
        position="top"
        width={260}
        classNames={{ dropdown: styles.tagDropdown }}
        anchor={
          <AdActionButton
            icon={faTags}
            label="Add tags"
            tooltip={false}
            active={message.tagIds.length > 0}
            onClick={() => setTagOpen((value) => !value)}
          />
        }
      >
        <div className={styles.tagPopover}>
          <AdSelect
            multiple
            placeholder="Search or create tags..."
            data={tagOptions}
            value={message.tagIds}
            searchable
            create
            emptyLabel="No tags found"
            onChange={(tagIds) => {
              actions.setTags(message.id, tagIds);
            }}
            onCreate={(label) => {
              const existingTag = Object.values(tags).find(
                (tag) => tag.label.toLowerCase() === label.toLowerCase(),
              );

              if (existingTag) {
                if (!message.tagIds.includes(existingTag.id)) {
                  actions.setTags(message.id, [
                    ...message.tagIds,
                    existingTag.id,
                  ]);
                }

                return;
              }

              const id = createTag({ label, colorId: DEFAULT_COLOR_ID });
              actions.setTags(message.id, [...message.tagIds, id]);
            }}
          />
        </div>
      </AdPopover>
      <AdPopover
        opened={reactionOpen}
        onChange={(opened) => {
          setReactionOpen(opened);

          if (!opened) {
            setFullPickerOpen(false);
          }
        }}
        position="top"
        width={fullPickerOpen ? 'auto' : undefined}
        classNames={{ dropdown: styles.reactionDropdown }}
        anchor={
          <AdActionButton
            icon={faSmile}
            label="React"
            tooltip={false}
            active={message.reactions.length > 0}
            onClick={() => setReactionOpen((value) => !value)}
          />
        }
      >
        <div
          className={
            fullPickerOpen ? styles.fullReactionPopover : styles.reactionPopover
          }
        >
          <AdQuickReactionBar
            onSelect={handleReactionSelect}
            onExpand={() => setFullPickerOpen(true)}
          />
          {fullPickerOpen ? (
            <div className={styles.fullPickerSlot}>
              <AdEmojiPickerPanel onSelect={handleReactionSelect} />
            </div>
          ) : null}
        </div>
      </AdPopover>
    </div>
  );
};

export default HoverActions;
