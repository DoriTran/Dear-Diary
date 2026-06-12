export type SidebarRow =
  | { type: 'group'; id: string; chatboxIds: string[] }
  | { type: 'chatbox'; id: string };

export type DragGroupData = {
  kind: 'group';
  id: string;
};

export type DragChatboxData = {
  kind: 'chatbox';
  id: string;
};

export type SidebarDragData = DragGroupData | DragChatboxData;

export type SidebarLayout = {
  rootOrders: string[];
  groupChatboxOrders: Record<string, string[]>;
};

export type SidebarScope =
  | { type: 'list' }
  | { type: 'group'; groupId: string };
