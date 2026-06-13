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
  updateMessageContent: (messageId: string, data: MessageUpdateData) => void;
  patchMessage: (messageId: string, data: MessagePatchData) => void;
  deleteMessage: (messageId: string) => void;
  moveMessage: (messageId: string, targetChatboxId: string) => void;
  toggleMessagePin: (messageId: string) => void;
  toggleMessageArchive: (messageId: string) => void;
  toggleMessageReaction: (messageId: string, emoji: string) => void;
  setMessageTags: (messageId: string, tagIds: string[]) => void;
  forwardMessage: (
    sourceMessageId: string,
    targetChatboxId: string,
    caption?: string,
  ) => string;

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

// #region [Chatbox]
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

export type ChatboxUpdateData = Partial<
  Pick<
    Chatbox,
    | 'name'
    | 'description'
    | 'icon'
    | 'color'
    | 'pinned'
    | 'archived'
    | 'notificationEnabled'
  >
> & {
  tags?: ChatboxTagStatistic[];
};

// #endregion

// #region [Tag]

export type Tag = {
  id: string;
  label: string;
  color: string;
};

// #endregion

// #region [Message]

// #region Shared

export type RichTextContent = {
  text: string;
};

// #endregion

// #region Attachments

export type Attachment =
  | ImageAttachment
  | VideoAttachment
  | FileAttachment
  | LinkAttachment;

export type AttachmentBase = {
  id: string;
  name?: string;
};

export type ImageAttachment = AttachmentBase & {
  type: 'image';
  url: string;
  width?: number;
  height?: number;
};

export type VideoAttachment = AttachmentBase & {
  type: 'video';
  url: string;
  thumbnail?: string;
  duration?: number;
};

export type FileAttachment = AttachmentBase & {
  type: 'file';
  url: string;
  mimeType: string;
  size?: number;
};

export type LinkAttachment = AttachmentBase & {
  type: 'link';
  url: string;
};

// #endregion

// #region Message Decoration
export type MessageDecoration = TicketDecoration | CountdownDecoration;

export type TicketDecoration = {
  type: 'ticket';
  title: string;
  state: 'todo' | 'doing' | 'done';
  ticked: boolean;
};

export type CountdownDecoration = {
  type: 'countdown';
  title: string;
  targetDate: string;
  pause: boolean;
};

// #endregion

// #region Message Types
export type Message = TextMessage | TodoMessage | AIMessage;

export type MessageSender = 'user' | 'assistant';

export type MessageBase = {
  id: string;
  chatboxId: string;
  sender: MessageSender;
  tagIds: string[];
  pinned: boolean;
  archived: boolean;
  replyToMessageId: string | null;
  sourceMessageId: string | null;
  reactions: MessageReaction[];
  edited: boolean;
  attachments: Attachment[];
  decorations: MessageDecoration[];
  createdAt: string;
  updatedAt: string | null;
};

export type MessageReaction = {
  emoji: string;
  count: number;
};

export type TextMessage = MessageBase & {
  type: 'text';
  content: RichTextContent;
};

export type AIMessage = MessageBase & {
  type: 'ai';
  content: RichTextContent;
};

export type TodoMessage = MessageBase & {
  type: 'todo';
  content: {
    items: TodoItem[];
  };
};

export type TodoItem = {
  id: string;
  completed: boolean;
  content: RichTextContent;
  attachments: Attachment[];
};
// #endregion

// #endregion

// #region [Helpers]

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

export type MessagePatchData = Partial<
  Pick<
    Message,
    | 'tagIds'
    | 'pinned'
    | 'archived'
    | 'reactions'
    | 'replyToMessageId'
    | 'sourceMessageId'
  >
>;

// #endregion
