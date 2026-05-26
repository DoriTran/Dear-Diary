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

export type DragItemBoxData = {
  kind: 'itembox';
  id: string;
};
