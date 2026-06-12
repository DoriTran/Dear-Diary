import type { FC } from 'react';

import { AdDragDrop, type ScrollOffset } from '@/packages/base';

import type { ChatboxData } from '../types';
import type { DragChatboxData } from './sidebar.types';

import Chatbox from './Chatbox/Chatbox';
import styles from './SortableChatbox.module.css';

export type SortableChatboxProps = {
  data: ChatboxData;
  itemOf: 'diary-list' | 'diary-group';
  selectedId?: string;
  onSelect?: (id: string) => void;
  extraScrollOffset?: ScrollOffset;
  onSortableChange: (current: number, previous: number) => void;
};

const SortableChatbox: FC<SortableChatboxProps> = ({
  data,
  itemOf,
  selectedId,
  onSelect,
  extraScrollOffset,
  onSortableChange,
}) => {
  return (
    <AdDragDrop
      draggable
      sortable
      itemOf={itemOf}
      validGroups={['diary-list', 'diary-group']}
      data={{ kind: 'chatbox', id: data.id } satisfies DragChatboxData}
      extraScrollOffset={extraScrollOffset}
      onSortableChange={({ current, previous }) => {
        onSortableChange(current, previous);
      }}
    >
      <div className={styles.item} data-test-id={data.id}>
        <Chatbox
          data={data}
          selected={data.id === selectedId}
          onSelect={onSelect}
        />
      </div>
    </AdDragDrop>
  );
};

export default SortableChatbox;
