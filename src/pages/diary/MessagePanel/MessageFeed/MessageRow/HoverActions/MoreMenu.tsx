import {
  faArrowUpRightFromSquare,
  faBoxArchive,
  faEllipsisVertical,
  faThumbtack,
} from '@fortawesome/free-solid-svg-icons';
import { useState, type FC } from 'react';

import type { Message } from '@/store/diary/type';

import { AdActionButton, AdIcon, AdMenu, AdMenuItem } from '@/packages/base';

import type { MessageActionsAPI } from '../../../.hooks/useMessageActions';

import styles from './MoreMenu.module.css';

export type MoreMenuProps = {
  message: Message;
  actions: MessageActionsAPI;
};

const MoreMenu: FC<MoreMenuProps> = ({ message, actions }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isUserMessage = (message.sender ?? 'user') === 'user';
  const isEditingThis = actions.editTargetId === message.id;
  const editDisabled =
    actions.editTargetId !== null || actions.composerDirty;
  const archiveDisabled = isEditingThis;

  return (
    <AdMenu
      opened={menuOpen}
      onChange={setMenuOpen}
      position="top"
      width={180}
      anchor={
        <AdActionButton
          icon={faEllipsisVertical}
          label="Message options"
          tooltip={false}
          onClick={() => setMenuOpen((value) => !value)}
        />
      }
    >
      <li role="none" className={styles.quickActions}>
        <button
          type="button"
          className={styles.quickAction}
          aria-label="Forward"
          onClick={() => {
            setMenuOpen(false);
            actions.requestForward(message.id);
          }}
        >
          <span className={styles.quickIcon}>
            <AdIcon icon={faArrowUpRightFromSquare} size={12} />
          </span>
          Forward
        </button>
        <button
          type="button"
          className={styles.quickAction}
          aria-label={message.pinned ? 'Unpin' : 'Pin'}
          data-active={message.pinned || undefined}
          onClick={() => {
            setMenuOpen(false);
            actions.togglePin(message.id);
          }}
        >
          <span className={styles.quickIcon}>
            <AdIcon icon={faThumbtack} size={12} />
          </span>
          {message.pinned ? 'Unpin' : 'Pin'}
        </button>
        <button
          type="button"
          className={styles.quickAction}
          aria-label={message.archived ? 'Unarchive' : 'Archive'}
          data-active={message.archived || undefined}
          disabled={archiveDisabled}
          onClick={() => {
            setMenuOpen(false);
            actions.toggleArchive(message.id);
          }}
        >
          <span className={styles.quickIcon}>
            <AdIcon icon={faBoxArchive} size={12} />
          </span>
          {message.archived ? 'Unarchive' : 'Archive'}
        </button>
      </li>

      {isUserMessage ? (
        <>
          <li role="separator" className={styles.divider} />
          <AdMenuItem
            centered
            disabled={editDisabled}
            onClick={() => {
              setMenuOpen(false);
              actions.startEdit(message.id);
            }}
          >
            Edit
          </AdMenuItem>
        </>
      ) : null}

      <li role="separator" className={styles.divider} />
      <AdMenuItem
        centered
        destructive
        onClick={() => {
          setMenuOpen(false);
          actions.requestDelete(message.id);
        }}
      >
        Delete
      </AdMenuItem>
    </AdMenu>
  );
};

export default MoreMenu;
