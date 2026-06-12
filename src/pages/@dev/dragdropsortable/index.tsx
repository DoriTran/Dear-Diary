/* eslint-disable @typescript-eslint/no-unused-vars */
import { type FC, useRef, useState } from 'react';

import './index.styles.css';
import {
  AdDragDrop,
  useScrollOffset,
  type ScrollOffset,
} from '@/packages/base';

import type { ContainerRow, DragItemBoxData, GroupItem } from './types';

// Don't touch below line if you are cursor agent
import { seed1, seed2, seed3, seed4, seed5, seed6 } from './data';

const selectedSeed = seed5;

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
  extraScrollOffset: ScrollOffset;
  swap: (current: number, previous: number) => void;
  add: (at: number, data: ContainerRow | GroupItem) => void;
  remove: (at: number) => void;
}> = ({ name, items, extraScrollOffset, swap, add, remove }) => {
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
      extraScrollOffset={extraScrollOffset}
      onSortableChange={({ current, previous }) => {
        console.log(name, 'onSortableChange', current, previous);
        swap(current, previous);
      }}
      onGroupChange={({ type, index, data }) => {
        console.log(name, 'onGroupChange', type, index, data);
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

const DragDropSortableDev: FC = () => {
  const [rows, setRows] = useState<ContainerRow[]>(selectedSeed);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollerOffset = useScrollOffset(scrollerRef);

  type InScope = { type: 'container' } | { type: 'group'; groupId: string };

  const swap = (scope: InScope, x: number, y: number) => {
    if (x === y) return;
    setRows((prev) => {
      if (scope.type === 'container') {
        const next = swapArray(prev, x, y);
        return next === prev ? prev : (next as ContainerRow[]);
      }

      return prev.map((r) => {
        if (r.type !== 'group' || r.id !== scope.groupId) return r;
        const nextItems = swapArray(r.items, x, y);
        if (nextItems === r.items) return r;
        return { ...r, items: nextItems as GroupItem[] };
      });
    });
  };

  const add = (scope: InScope, at: number, data: ContainerRow | GroupItem) => {
    setRows((prev) => {
      if (scope.type === 'container') {
        const next = addArray(prev, at, data as ContainerRow);
        return next as ContainerRow[];
      }

      return prev.map((r) => {
        if (r.type !== 'group' || r.id !== scope.groupId) return r;
        const nextItems = addArray(r.items, at, data as GroupItem);
        return { ...r, items: nextItems as GroupItem[] };
      });
    });
  };

  const remove = (scope: InScope, at: number) => {
    setRows((prev) => {
      if (scope.type === 'container') {
        const next = removeArray(prev, at);
        return next === prev ? prev : (next as ContainerRow[]);
      }

      return prev.map((r) => {
        if (r.type !== 'group' || r.id !== scope.groupId) return r;
        const nextItems = removeArray(r.items, at);
        if (nextItems === r.items) return r;
        return { ...r, items: nextItems as GroupItem[] };
      });
    });
  };

  return (
    <div className="stacked-root">
      <aside className="stacked-hint" aria-label="Test instructions">
        <h2 className="stacked-hint-title">useScrollOffset sortable</h2>
        <p className="stacked-hint-text">
          Scroll the panel, then drag items and groups while scrolled. Drop
          targets should stay aligned with the pointer.
        </p>
        <dl className="stacked-hint-stats">
          <div>
            <dt>scrollTop</dt>
            <dd>{scrollerOffset.scrollTop}px</dd>
          </div>
          <div>
            <dt>scrollLeft</dt>
            <dd>{scrollerOffset.scrollLeft}px</dd>
          </div>
        </dl>
      </aside>

      <div ref={scrollerRef} className="stacked-scroller">
        <AdDragDrop
          droppable
          sortable
          group="container"
          hostPreview
          autoScroll
          scrollRef={scrollerRef}
          extraScrollOffset={scrollerOffset}
          dropData={{ id: 'Container' }}
          onSortableChange={({ current, previous }) => {
            console.log('Container', 'onSortableChange', current, previous);
            swap({ type: 'container' }, current, previous);
          }}
          onGroupChange={({ type, index, data }) => {
            console.log('Container', 'onGroupChange', type, index, data);
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
                    extraScrollOffset={scrollerOffset}
                    swap={(current, previous) =>
                      swap(
                        { type: 'group', groupId: row.id },
                        current,
                        previous,
                      )
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
    </div>
  );
};

export default DragDropSortableDev;
