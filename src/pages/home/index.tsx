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

const ItemBox: FC<{ label: string }> = ({ label }) => {
  return (
    <AdDragDrop draggable>
      <div className="item">
        <span className="item-label">{label}</span>
      </div>
    </AdDragDrop>
  );
};

const GroupBlock: FC<{ name: string; items: GroupItem[] }> = ({
  name,
  items,
}) => {
  return (
    <AdDragDrop draggable droppable>
      <div className="group">
        <div data-handle className="group-label">
          || {name}
        </div>
        <div className="group-inner">
          {items.map((item) => (
            <ItemBox key={item.id} label={item.id} />
          ))}
        </div>
      </div>
    </AdDragDrop>
  );
};

const Home: FC = () => {
  const [rows, _setRows] = useState<ContainerRow[]>([
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

  return (
    <div className="stacked-root">
      <AdDragDrop droppable>
        <div className="stacked-container">
          <span className="container-label">Container</span>
          <div className="stacked-list">
            {rows.map((row) =>
              row.type === 'group' ? (
                <GroupBlock key={row.id} name={row.id} items={row.items} />
              ) : (
                <ItemBox key={row.id} label={row.id} />
              ),
            )}
          </div>
        </div>
      </AdDragDrop>
    </div>
  );
};

export default Home;
