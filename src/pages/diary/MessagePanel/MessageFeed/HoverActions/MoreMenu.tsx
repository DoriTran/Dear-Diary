import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { useState, type FC } from 'react';

import type { Message } from '@/store/diary/type';

import { AdActionButton, AdMenu, AdMenuItem } from '@/packages/base';

import type { MessageActionsAPI } from '../../hooks/useMessageActions';

export type MoreMenuProps = {
  message: Message;
  actions: MessageActionsAPI;
};

const MoreMenu: FC<MoreMenuProps> = ({ message, actions }) => {
  const [menuOpen, setMenuOpen] = useState(false);

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
      <AdMenuItem
        destructive
        onClick={() => {
          setMenuOpen(false);
          actions.requestDelete(message.id);
        }}
      >
        Delete
      </AdMenuItem>
      <AdMenuItem
        onClick={() => {
          setMenuOpen(false);
          actions.requestForward(message.id);
        }}
      >
        Forward
      </AdMenuItem>
      <AdMenuItem
        onClick={() => {
          setMenuOpen(false);
          actions.togglePin(message.id);
        }}
      >
        {message.pinned ? 'Unpin' : 'Pin'}
      </AdMenuItem>
      <AdMenuItem
        onClick={() => {
          setMenuOpen(false);
          actions.toggleArchive(message.id);
        }}
      >
        {message.archived ? 'Unarchive' : 'Archive'}
      </AdMenuItem>
    </AdMenu>
  );
};

export default MoreMenu;
