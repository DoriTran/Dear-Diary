export type DiaryStore = {
  groups: Record<string, Group>;
  chatboxes: Record<string, Chatbox>;
  messages: Record<string, Message>;
};

export type Group = {
  id: string;
  title: string;
  description: string;
  color: string;
  order: number;
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
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  id: string;
  chatboxId: string;
  order: number;
  content: MessageBlock[];
  tagIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type MessageBlock = {
  type: string;
  content: string;
};
