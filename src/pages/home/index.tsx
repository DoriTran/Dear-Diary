import { type FC, useState } from 'react';

import './index.styles.css';
import { AdDragDrop } from '@/packages/base';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { mixed, seed1 } from './data';

// #region Data Types

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

// #endregion

// #region Utility Functions

const clampIndex = (index: number, length: number) => {
  if (Number.isNaN(index)) return length;
  if (index < 0) return 0;
  if (index > length) return length;
  return index;
};

const swapArray = <T,>(
  input: readonly T[],
  x: number,
  y: number,
): readonly T[] => {
  if (x === y) return input;
  if (x < 0 || y < 0) return input;
  if (x >= input.length || y >= input.length) return input;

  const next = input.slice();
  [next[x], next[y]] = [next[y], next[x]];
  return next;
};

const addArray = <T,>(
  input: readonly T[],
  at: number,
  data: T,
): readonly T[] => {
  const insertAt = clampIndex(at, input.length);
  const next = input.slice();
  next.splice(insertAt, 0, data);
  return next;
};

const removeArray = <T,>(input: readonly T[], at: number): readonly T[] => {
  if (at < 0 || at >= input.length) return input;
  const next = input.slice();
  next.splice(at, 1);
  return next;
};

// #endregion

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
      data={{ kind: 'itembox', id } satisfies DragItemBoxData}
    >
      <div className="item" data-test-id={id}>
        <span className="item-label">{label}</span>
      </div>
    </AdDragDrop>
  );
};

const GroupBlock: FC<{
  name: string;
  items: GroupItem[];
  swap: (current: number, previous: number) => void;
  add: (at: number, data: ContainerRow | GroupItem) => void;
  remove: (at: number) => void;
}> = ({ name, items, swap, add, remove }) => {
  return (
    <AdDragDrop
      draggable
      droppable
      group="group"
      itemOf="container"
      data={{ id: name, kind: 'group' }}
      dropData={{ id: name }}
      stopDropPropagation
      sortable
      onSortableChange={({ current, previous }) => {
        console.log(name, 'onSortableChange', current, previous);
        swap(current, previous);
      }}
      onGroupChange={({ type, index, data }) => {
        console.log(name, type, index, data);
        if (type === 'enter') {
          add(index, data);
        }
        if (type === 'leave') {
          remove(index);
        }
      }}
    >
      <div
        data-test-id={name}
        className="group"
        style={{ minHeight: items.length * 40 + (items.length - 1) * 10 + 60 }}
      >
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
  const [rows, setRows] = useState<ContainerRow[]>(seed1);

  // useEffect(() => console.log(rows), [rows]);

  type InScope = { type: 'container' } | { type: 'group'; groupId: string };

  // swap(in, x, y) → swap in "container" or "group"
  const swap = (scope: InScope, x: number, y: number) => {
    if (x === y) return;
    setRows((prev) => {
      if (scope.type === 'container') {
        const next = swapArray(prev, x, y);
        return next === prev ? prev : (next as ContainerRow[]);
      }

      return prev.map((r) => {
        if (r.type !== 'group' || r.id !== scope.groupId) return r;
        const items = swapArray(r.items, x, y);
        if (items === r.items) return r;
        return { ...r, items: items as GroupItem[] };
      });
    });
  };

  // add(in, at, data) → add data at the at in the in
  const add = (scope: InScope, at: number, data: ContainerRow | GroupItem) => {
    setRows((prev) => {
      if (scope.type === 'container') {
        const next = addArray(prev, at, data as ContainerRow);
        return next as ContainerRow[];
      }

      return prev.map((r) => {
        if (r.type !== 'group' || r.id !== scope.groupId) return r;
        const items = addArray(r.items, at, data as GroupItem);
        return { ...r, items: items as GroupItem[] };
      });
    });
  };

  // remove(in, at) → remove data at the at and in the in
  const remove = (scope: InScope, at: number) => {
    setRows((prev) => {
      if (scope.type === 'container') {
        const next = removeArray(prev, at);
        return next === prev ? prev : (next as ContainerRow[]);
      }

      return prev.map((r) => {
        if (r.type !== 'group' || r.id !== scope.groupId) return r;
        const items = removeArray(r.items, at);
        if (items === r.items) return r;
        return { ...r, items: items as GroupItem[] };
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
        onSortableChange={({ current, previous }) => {
          console.log('Container', 'onSortableChange', current, previous);
          swap({ type: 'container' }, current, previous);
        }}
        onGroupChange={({ type, index, data }) => {
          console.log('Container', type, index, data);
          if (type === 'enter') {
            add({ type: 'container' }, index, data);
          }
          if (type === 'leave') {
            remove({ type: 'container' }, index);
          }
        }}
      >
        <div className="stacked-container" data-test-id="Container">
          <span className="container-label">Container</span>
          <div className="stacked-list">
            {rows.map((row) =>
              row.type === 'group' ? (
                <GroupBlock
                  key={row.id}
                  name={row.id}
                  items={row.items}
                  swap={(current, previous) =>
                    swap({ type: 'group', groupId: row.id }, current, previous)
                  }
                  add={(at, data) =>
                    add({ type: 'group', groupId: row.id }, at, data)
                  }
                  remove={(at) =>
                    remove({ type: 'group', groupId: row.id }, at)
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
