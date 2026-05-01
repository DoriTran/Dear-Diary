import type { ContainerRow } from './index';

const createItemIdFactory = (startAt = 1) => {
  let i = startAt - 1;
  return () => `item-${++i}`;
};

const makeGroupItems = (args: {
  groupId: string;
  count: number;
  nextId: () => string;
}) =>
  Array.from({ length: args.count }, () => ({
    id: args.nextId(),
    groupId: args.groupId,
  }));

export const items: ContainerRow[] = [
  { type: 'item', id: 'item-1' },
  { type: 'item', id: 'item-2' },
  { type: 'item', id: 'item-3' },
  { type: 'item', id: 'item-4' },
  { type: 'item', id: 'item-5' },
  { type: 'item', id: 'item-6' },
];

export const groups: ContainerRow[] = (() => {
  const nextId = createItemIdFactory(1);

  return [
    {
      type: 'group',
      id: 'Group-1',
      items: makeGroupItems({ groupId: 'Group-1', count: 3, nextId }),
    },
    {
      type: 'group',
      id: 'Group-2',
      items: makeGroupItems({ groupId: 'Group-2', count: 3, nextId }),
    },
    {
      type: 'group',
      id: 'Group-3',
      items: makeGroupItems({ groupId: 'Group-3', count: 3, nextId }),
    },
  ];
})();

export const mixed: ContainerRow[] = (() => {
  const nextId = createItemIdFactory(1);

  return [
    {
      type: 'group',
      id: 'Group-1',
      items: makeGroupItems({ groupId: 'Group-1', count: 3, nextId }),
    },
    { type: 'item', id: nextId() },
    { type: 'item', id: nextId() },
    {
      type: 'group',
      id: 'Group-2',
      items: makeGroupItems({ groupId: 'Group-2', count: 3, nextId }),
    },
    { type: 'item', id: nextId() },
    {
      type: 'group',
      id: 'Group-3',
      items: makeGroupItems({ groupId: 'Group-3', count: 3, nextId }),
    },
    { type: 'item', id: nextId() },
  ];
})();

export const lmixed: ContainerRow[] = (() => {
  const nextId = createItemIdFactory(1);

  return [
    {
      type: 'group',
      id: 'Group-1',
      items: makeGroupItems({ groupId: 'Group-1', count: 5, nextId }),
    },
    { type: 'item', id: nextId() },
    { type: 'item', id: nextId() },
    { type: 'item', id: nextId() },
    { type: 'item', id: nextId() },
    {
      type: 'group',
      id: 'Group-2',
      items: makeGroupItems({ groupId: 'Group-2', count: 5, nextId }),
    },
    { type: 'item', id: nextId() },
    { type: 'item', id: nextId() },
    { type: 'item', id: nextId() },
    {
      type: 'group',
      id: 'Group-3',
      items: makeGroupItems({ groupId: 'Group-3', count: 5, nextId }),
    },
    { type: 'item', id: nextId() },
    { type: 'item', id: nextId() },
    { type: 'item', id: nextId() },
    { type: 'item', id: nextId() },
    { type: 'item', id: nextId() },
  ];
})();

export const seed1: ContainerRow[] = [
  {
    type: 'group',
    id: 'Group-1',
    items: [
      { groupId: 'Group-1', id: 'item-1' },
      { groupId: 'Group-1', id: 'item-2' },
      { groupId: 'Group-1', id: 'item-3' },
      { groupId: 'Group-1', id: 'item-4' },
      { groupId: 'Group-1', id: 'item-5' },
      { groupId: 'Group-1', id: 'item-6' },
    ],
  },
  { type: 'item', id: 'item-7' },
  { type: 'item', id: 'item-8' },
  { type: 'item', id: 'item-9' },
  { type: 'item', id: 'item-10' },
  { type: 'item', id: 'item-11' },
  { type: 'item', id: 'item-12' },
];
