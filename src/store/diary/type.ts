// #region Store

export type DiaryStore = {
  groups: Record<string, Group>;
  chatboxes: Record<string, Chatbox>;
  messages: Record<string, Message>;
  tags: Record<string, Tag>;
  orders: Orders;
};

// #endregion

// #region Actions
export type DiaryStoreActions = {
  // #region Group

  createGroup: (data?: Partial<Group>) => string;
  updateGroup: (groupId: string, data: Partial<Group>) => void;
  deleteGroup: (groupId: string) => void;

  // #endregion

  // #region Chatbox

  createChatbox: (data?: Partial<Chatbox>) => string;
  updateChatbox: (chatboxId: string, data: ChatboxUpdateData) => void;
  moveChatboxToGroup: (chatboxId: string, targetGroupId: string | null) => void;
  deleteChatbox: (chatboxId: string) => void;

  // #endregion

  // #region Message

  createMessage: (data: Partial<Message>) => string;
  updateMessage: (messageId: string, data: MessageUpdateData) => void;
  deleteMessage: (messageId: string) => void;
  moveMessage: (messageId: string, targetChatboxId: string) => void;

  // #endregion

  // #region Tag

  createTag: (data?: Partial<Tag>) => string;
  updateTag: (tagId: string, data: Partial<Tag>) => void;
  deleteTag: (tagId: string) => void;

  // #endregion

  // #region Orders

  updateRootOrders: (ids: string[]) => void;
  updateGroupChatboxOrders: (groupId: string, ids: string[]) => void;
  updateChatboxMessageOrders: (chatboxId: string, ids: string[]) => void;
  syncSidebarLayout: (layout: {
    rootOrders: string[];
    groupChatboxOrders: Record<string, string[]>;
  }) => void;

  // #endregion

  // #region Utility

  reset: () => void;
  seedIfEmpty: () => void;

  // #endregion
};

// #endregion

// #endregion

// #region Orders

export type Orders = {
  rootOrders: string[];
  groupChatboxOrders: Record<string, string[]>;
  chatboxMessageOrders: Record<string, string[]>;
};

// #endregion

// #region Group

export type Group = {
  id: string;
  name: string;
  icon: string;
  color: string; // hex

  createdAt: string;
  updatedAt: string | null;
};

// #endregion

// #region Chatbox

export type Chatbox = {
  id: string;
  groupId: string | null;
  name: string;
  description: string;
  icon: string;
  color: string; // hex

  pinned: boolean;
  archived: boolean;
  hasUnread: boolean;
  notificationEnabled: boolean;
  tags: ChatboxTagStatistic[];
  totalMessage: number;
  lastMessageId: string | null;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type ChatboxTagStatistic = {
  tagId: string;
  count: number;
};

export type ChatboxUpdateData = Pick<
  Chatbox,
  'name' | 'description' | 'icon' | 'color' | 'pinned' | 'archived'
>;

// #endregion

// #region Tag

export type Tag = {
  id: string;
  label: string;
  color: string;
};

// #endregion

// #region Message Base

export type MessageBase = {
  id: string;
  chatboxId: string;
  tagIds: string[];
  pinned: boolean;
  reactions: MessageReaction[];
  edited: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type MessageReaction = {
  emoji: string;
  count: number;
};

// #endregion

// #region Message

export type Message =
  | TextMessage
  | ImageMessage
  | VideoMessage
  | TodoMessage
  | TicketMessage
  | CountdownMessage
  | AIMessage;

// #endregion

// #region Text Message

export type TextMessage = MessageBase & {
  type: 'text';
  content: {
    text: string;
  };
};

// #endregion

// #region Image Message

export type ImageMessage = MessageBase & {
  type: 'image';
  content: {
    url: string;
    width?: number;
    height?: number;
  };
};

// #endregion

// #region Video Message

export type VideoMessage = MessageBase & {
  type: 'video';
  content: {
    url: string;
    thumbnail?: string;
  };
};

// #endregion

// #region Todo Message

export type TodoMessage = MessageBase & {
  type: 'todo';
  content: {
    items: TodoItem[];
  };
};

export type TodoItem = {
  id: string;
  label: string;
  completed: boolean;
};

// #endregion

// #region Ticket Message

export type TicketMessage = MessageBase & {
  type: 'ticket';
  content: {
    title: string;
    description?: string;
    status: 'todo' | 'doing' | 'done';
  };
};

// #endregion

// #region Countdown Message

export type CountdownMessage = MessageBase & {
  type: 'countdown';
  content: {
    title: string;
    targetDate: string;
  };
};

// #endregion

// #region AI Message

export type AIMessage = MessageBase & {
  type: 'ai';
  content: {
    text: string;
  };
};

// #endregion

// #region Helpers

/* eslint-disable @typescript-eslint/no-duplicate-type-constituents -- semantic id unions (all `string` today) */
export type DiaryEntityId =
  | Group['id']
  | Chatbox['id']
  | Message['id']
  | Tag['id'];
export type DiaryRootItemId = Group['id'] | Chatbox['id'];
/* eslint-enable @typescript-eslint/no-duplicate-type-constituents */

export type MessageType = Message['type'];

export type MessageUpdateData = Partial<
  Omit<Message, 'id' | 'chatboxId' | 'createdAt' | 'edited' | 'updatedAt'>
>;

// #endregion
