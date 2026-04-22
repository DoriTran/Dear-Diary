import { type FC, useState } from 'react';

import './index.styles.css';
import { AdDragDrop } from '@/packages/base';

/** Item nested under a group — includes `groupId` matching the parent group. */
export interface GroupItem {
  id: string;
  groupId: string;
}

/** Standalone row in the container (not inside a group). */
export interface RootItem {
  id: string;
}

export type ContainerRow =
  | { type: 'group'; id: string; items: GroupItem[] }
  | ({ type: 'item' } & RootItem);

type DragItemBoxData = {
  kind: 'itembox';
  id: string;
};

const ItemBox: FC<{ id: string; label: string; free?: boolean }> = ({
  id,
  label,
  free,
}) => {
  return (
    <AdDragDrop
      draggable
      sortable
      itemOf={free ? 'container' : 'group'}
      validGroups={['container', 'group']}
      dragData={{ kind: 'itembox', id } satisfies DragItemBoxData}
      logEvents={['dragStart']}
    >
      <div className="item">
        <span className="item-label">{label}</span>
      </div>
    </AdDragDrop>
  );
};

const GroupBlock: FC<{
  name: string;
  items: GroupItem[];
  onCatchItemBox: (args: { itemId: string; groupId: string }) => void;
}> = ({ name, items, onCatchItemBox }) => {
  return (
    <AdDragDrop
      draggable
      droppable
      sortable
      group="group"
      itemOf="container"
      onDragEnter={({ data }) => {
        const maybe = data as Partial<DragItemBoxData> | undefined;
        if (maybe?.kind !== 'itembox' || !maybe.id) return;
        onCatchItemBox({ itemId: maybe.id, groupId: name });
      }}
      onCatch={({ data }) => {
        const maybe = data as Partial<DragItemBoxData> | undefined;
        if (maybe?.kind !== 'itembox' || !maybe.id) return;
        onCatchItemBox({ itemId: maybe.id, groupId: name });
      }}
      logEvents={['catch']}
      dropData={{ id: name }}
      stopDropPropagation
    >
      <div className="group">
        <div data-handle className="group-label">
          || {name}
        </div>
        <div className="group-inner">
          {items.map((item) => (
            <ItemBox key={item.id} id={item.id} label={item.id} />
          ))}
        </div>
      </div>
    </AdDragDrop>
  );
};

const Home: FC = () => {
  const [rows, setRows] = useState<ContainerRow[]>([
    {
      type: 'group',
      id: 'Group-1',
      items: [
        { id: 'item-1', groupId: 'group-1' },
        { id: 'item-2', groupId: 'group-1' },
      ],
    },
    { type: 'item', id: 'item-3' },
    { type: 'item', id: 'item-4' },
    {
      type: 'group',
      id: 'Group-2',
      items: [
        { id: 'item-5', groupId: 'group-2' },
        { id: 'item-6', groupId: 'group-2' },
        { id: 'item-7', groupId: 'group-2' },
      ],
    },
    { type: 'item', id: 'item-8' },
  ]);

  const moveItemBox = (
    itemId: string,
    target: { type: 'container' } | { type: 'group'; groupId: string },
  ) => {
    setRows((prev) => {
      const existsInTarget =
        target.type === 'container'
          ? prev.some((r) => r.type === 'item' && r.id === itemId)
          : prev.some(
              (r) =>
                r.type === 'group' &&
                r.id === target.groupId &&
                r.items.some((it) => it.id === itemId),
            );

      if (existsInTarget) return prev;

      const stripped = prev
        .filter((r) => !(r.type === 'item' && r.id === itemId))
        .map((r) =>
          r.type === 'group'
            ? { ...r, items: r.items.filter((it) => it.id !== itemId) }
            : r,
        );

      if (target.type === 'container') {
        return [...stripped, { type: 'item', id: itemId }];
      }

      return stripped.map((r) => {
        if (r.type !== 'group' || r.id !== target.groupId) return r;
        return {
          ...r,
          items: [...r.items, { id: itemId, groupId: target.groupId }],
        };
      });
    });
  };

  return (
    <div className="stacked-root">
      <AdDragDrop
        droppable
        sortable
        group="container"
        hostPreview
        onDragEnter={({ data }) => {
          const maybe = data as Partial<DragItemBoxData> | undefined;
          if (maybe?.kind !== 'itembox' || !maybe.id) return;
          moveItemBox(maybe.id, { type: 'container' });
        }}
        onCatch={({ data }) => {
          const maybe = data as Partial<DragItemBoxData> | undefined;
          if (maybe?.kind !== 'itembox' || !maybe.id) return;
          moveItemBox(maybe.id, { type: 'container' });
        }}
        dropData={{ id: 'Container' }}
        logEvents={['catch']}
      >
        <div className="stacked-container">
          <span className="container-label">Container</span>
          <div className="stacked-list">
            {rows.map((row) =>
              row.type === 'group' ? (
                <GroupBlock
                  key={row.id}
                  name={row.id}
                  items={row.items}
                  onCatchItemBox={({ itemId, groupId }) =>
                    moveItemBox(itemId, { type: 'group', groupId })
                  }
                />
              ) : (
                <ItemBox key={row.id} id={row.id} label={row.id} free />
              ),
            )}
          </div>
        </div>
      </AdDragDrop>
    </div>
  );
};

export default Home;
