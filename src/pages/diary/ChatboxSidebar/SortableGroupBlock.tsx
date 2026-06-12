import type { FC } from 'react';

import { AdDragDrop, type ScrollOffset } from '@/packages/base';
import { useAppStore } from '@/store';

import type { GroupData } from '../types';
import type { DragGroupData, SidebarScope } from './sidebar.types';

import Group from './Group/Group';
import SortableChatbox from './SortableChatbox';
import styles from './SortableGroupBlock.module.css';
import { useDragBlockedNotice } from './useDragBlockedNotice';

export type SortableGroupBlockProps = {
  data: GroupData;
  selectedId?: string;
  onSelect?: (id: string) => void;
  extraScrollOffset: ScrollOffset;
  swap: (scope: SidebarScope, current: number, previous: number) => void;
  add: (scope: SidebarScope, at: number, data: unknown) => void;
  remove: (scope: SidebarScope, at: number) => void;
  dndEnabled?: boolean;
  listLocked?: boolean;
};

const SortableGroupBlock: FC<SortableGroupBlockProps> = ({
  data,
  selectedId,
  onSelect,
  extraScrollOffset,
  swap,
  add,
  remove,
  dndEnabled = true,
  listLocked = false,
}) => {
  const groupScope: SidebarScope = { type: 'group', groupId: data.id };
  const isExpanded =
    useAppStore('diaryPage').expandedGroupIds.has(data.id) &&
    data.chatboxes.length > 0;
  const dragBlockedNotice = useDragBlockedNotice(listLocked);

  return (
    <AdDragDrop
      draggable={dndEnabled}
      droppable={dndEnabled}
      {...(dndEnabled ? ({ sortable: true } as const) : {})}
      dragDeps={[dndEnabled]}
      dropDeps={[dndEnabled]}
      group="diary-group"
      itemOf="diary-list"
      data={{ kind: 'group', id: data.id } satisfies DragGroupData}
      dropData={{ id: data.id }}
      stopDropPropagation
      extraScrollOffset={extraScrollOffset}
      onSortableChange={({ current, previous }) => {
        swap(groupScope, current, previous);
      }}
      onGroupChange={({ type, index, data: dragData }) => {
        if (type === 'enter') {
          const insertAt = isExpanded ? index : data.chatboxes.length;
          add(groupScope, insertAt, dragData);
        }
        if (type === 'leave') {
          remove(groupScope, index);
        }
      }}
    >
      <div
        className={styles.root}
        data-test-id={data.id}
        {...dragBlockedNotice}
      >
        <Group
          data={data}
          selectedId={selectedId}
          onSelect={onSelect}
          renderChatbox={(chatbox) => (
            <SortableChatbox
              key={chatbox.id}
              data={chatbox}
              itemOf="diary-group"
              selectedId={selectedId}
              onSelect={onSelect}
              extraScrollOffset={extraScrollOffset}
              dndEnabled={dndEnabled}
              listLocked={listLocked}
              onSortableChange={(current, previous) => {
                swap(groupScope, current, previous);
              }}
            />
          )}
        />
      </div>
    </AdDragDrop>
  );
};

export default SortableGroupBlock;
