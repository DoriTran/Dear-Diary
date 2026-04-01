/**
 * Store type
 */
export type DiaryStore = {
  groups: Record<string, Group>;
  chatboxes: Record<string, Chatbox>;
  messages: Record<string, Message>;
  orders: Order;
};

export type DiaryRootItem =
  | {
      type: 'chatbox';
      data: Chatbox;
    }
  | {
      type: 'group';
      data: Group;
      chatboxes: Chatbox[];
    };

/**
 * Schema type
 */
export type Order = {
  rootOrders: string[];
  groupChatboxOrders: Record<string, string[]>;
  chatboxMessageOrders: Record<string, string[]>;
};

export type Group = {
  id: string;
  title: string;
  description: string;
  color: string;
  createdAt: string;
  updatedAt: string;
};

export type Chatbox = {
  id: string;
  groupId: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  id: string;
  chatboxId: string;
  content: MessageBlock[];
  tagIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type MessageBlock = {
  type: string;
  content: string;
};
