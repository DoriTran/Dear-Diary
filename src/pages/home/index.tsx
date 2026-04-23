import { type FC, useState } from 'react';

import './index.styles.css';
import { AdDragDrop } from '@/packages/base';

import { mixed } from './data';

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
  onMoveItemBox: (args: {
    groupId: string;
    current: number;
    previous: number;
  }) => void;
}> = ({ name, items, onCatchItemBox, onMoveItemBox }) => {
  return (
    <AdDragDrop
      draggable
      droppable
      group="group"
      itemOf="container"
      logEvents={['catch']}
      dropData={{ id: name }}
      stopDropPropagation
      sortable
      onSortableChange={({ current, previous }) => {
        console.log('Group onSortableChange', current, '←→', previous);
        onMoveItemBox({ groupId: name, current, previous });
      }}
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
  const [rows, setRows] = useState<ContainerRow[]>(mixed);

  const catchItemBox = (
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

  const moveItemBox = (args: {
    scope: { type: 'container' } | { type: 'group'; groupId: string };
    current: number;
    previous: number;
  }) => {
    const { scope, current, previous } = args;
    if (current === previous) return;

    setRows((prev) => {
      if (scope.type === 'container') {
        if (
          previous < 0 ||
          current < 0 ||
          previous >= prev.length ||
          current >= prev.length
        ) {
          return prev;
        }

        const next = prev.slice();
        [next[previous], next[current]] = [next[current], next[previous]];
        return next;
      }

      return prev.map((r) => {
        if (r.type !== 'group' || r.id !== scope.groupId) return r;
        if (
          previous < 0 ||
          current < 0 ||
          previous >= r.items.length ||
          current >= r.items.length
        ) {
          return r;
        }

        const items = r.items.slice();
        [items[previous], items[current]] = [items[current], items[previous]];
        return { ...r, items };
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
        dropData={{ id: 'Container' }}
        logEvents={['catch']}
        onSortableChange={({ current, previous }) => {
          console.log('Container onSortableChange', current, '←→', previous);
          moveItemBox({ scope: { type: 'container' }, current, previous });
        }}
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
                    catchItemBox(itemId, { type: 'group', groupId })
                  }
                  onMoveItemBox={({ groupId, current, previous }) =>
                    moveItemBox({
                      scope: { type: 'group', groupId },
                      current,
                      previous,
                    })
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
