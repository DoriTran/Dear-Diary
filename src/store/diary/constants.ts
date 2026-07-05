import type { DiaryStore } from './type';

// #region Initial State

export const diaryInitialState: DiaryStore = {
  groups: {},
  chatboxes: {},
  messages: {},
  tags: {},
  customPalettes: {},
  orders: {
    rootOrders: [],
    groupChatboxOrders: {},
    chatboxMessageOrders: {},
  },
};

// #endregion

// #region Dummy State

export const diaryDummyState: DiaryStore = {
  // #region Groups

  groups: {
    'gr:personal': {
      id: 'gr:personal',
      name: 'Personal',
      icon: 'Heart',
      colorId: 'rose',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: null,
    },
    'gr:work': {
      id: 'gr:work',
      name: 'Work',
      icon: 'Briefcase',
      colorId: 'violet',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: null,
    },
    'gr:entertainment': {
      id: 'gr:entertainment',
      name: 'Entertainment',
      icon: 'Clapperboard',
      colorId: 'matcha',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: null,
    },
  },

  // #endregion

  // #region Tags

  tags: {
    'tag:important': {
      id: 'tag:important',
      label: 'Important',
      colorId: 'coral',
    },
    'tag:japanese': {
      id: 'tag:japanese',
      label: 'Japanese',
      colorId: 'sky',
    },
    'tag:project': {
      id: 'tag:project',
      label: 'Project',
      colorId: 'plum',
    },
    'tag:anime': {
      id: 'tag:anime',
      label: 'Anime',
      colorId: 'mint',
    },
    'tag:vocabulary': {
      id: 'tag:vocabulary',
      label: 'vocabulary',
      colorId: 'rose',
    },
    'tag:grammar': {
      id: 'tag:grammar',
      label: 'grammar',
      colorId: 'mint',
    },
    'tag:diary': {
      id: 'tag:diary',
      label: 'diary',
      colorId: 'rose',
    },
  },

  // #endregion

  // #region Chatboxes

  chatboxes: {
    'cb:study': {
      id: 'cb:study',
      groupId: 'gr:personal',
      name: 'Japanese Study',
      icon: 'BookOpen',
      colorId: 'lavender',
      description:
        "A place to organize my Japanese study materials, vocabulary, grammar, and daily progress. Let's grow together!",
      pinned: true,
      archived: false,
      hasUnread: true,
      notificationEnabled: true,
      tags: [
        { tagId: 'tag:japanese', count: 24 },
        { tagId: 'tag:vocabulary', count: 18 },
        { tagId: 'tag:grammar', count: 7 },
        { tagId: 'tag:important', count: 4 },
      ],
      totalMessage: 128,
      lastMessageId: 'ms:study-last',
      lastMessageAt: '2026-06-09T10:30:00.000Z',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-06-09T10:30:00.000Z',
    },
    'cb:diary': {
      id: 'cb:diary',
      groupId: 'gr:personal',
      name: 'Daily Diary',
      icon: 'PenLine',
      colorId: 'rose',
      description: 'Personal reflections and daily notes.',
      pinned: false,
      archived: true,
      hasUnread: false,
      notificationEnabled: false,
      tags: [{ tagId: 'tag:diary', count: 12 }],
      totalMessage: 45,
      lastMessageId: 'ms:diary-1',
      lastMessageAt: '2026-06-08T09:15:00.000Z',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-06-08T09:15:00.000Z',
    },
    'cb:project': {
      id: 'cb:project',
      groupId: 'gr:work',
      name: 'Dear Diary',
      icon: 'Sparkles',
      colorId: 'violet',
      description: 'Dear Diary architecture and development.',
      pinned: false,
      archived: false,
      hasUnread: true,
      notificationEnabled: false,
      tags: [
        { tagId: 'tag:project', count: 2 },
        { tagId: 'tag:important', count: 1 },
      ],
      totalMessage: 1100,
      lastMessageId: 'ms:project-2',
      lastMessageAt: '2026-06-07T20:00:00.000Z',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-06-07T20:00:00.000Z',
    },
    'cb:anime': {
      id: 'cb:anime',
      groupId: 'gr:entertainment',
      name: 'Anime Watchlist',
      icon: 'Clapperboard',
      colorId: 'matcha',
      description: 'Anime watchlist and episode notes.',
      pinned: false,
      archived: false,
      hasUnread: false,
      notificationEnabled: true,
      tags: [{ tagId: 'tag:anime', count: 1 }],
      totalMessage: 1,
      lastMessageId: 'ms:anime-1',
      lastMessageAt: '2026-01-15T21:00:00.000Z',
      createdAt: '2026-01-15T21:00:00.000Z',
      updatedAt: '2026-01-15T21:00:00.000Z',
    },
  },

  // #endregion

  // #region Messages

  messages: {
    'ms:study-text': {
      id: 'ms:study-text',
      chatboxId: 'cb:study',
      sender: 'user',
      variant: 'text',
      content: {
        text: 'Learn 20 new Japanese words today.',
      },
      attachments: [],
      decorators: [],
      tagIds: ['tag:japanese'],
      pinned: false,
      archived: false,
      replyToMessageId: null,
      sourceMessageId: null,
      reactions: [],
      edited: false,
      createdAt: '2026-01-03T08:00:00.000Z',
      updatedAt: null,
    },
    'ms:study-todo': {
      id: 'ms:study-todo',
      chatboxId: 'cb:study',
      sender: 'user',
      variant: 'todo',
      content: {
        items: [
          {
            id: 'todo:1',
            content: { text: 'N5 Vocabulary' },
            completed: true,
            attachments: [],
          },
          {
            id: 'todo:2',
            content: { text: 'N5 Grammar' },
            completed: false,
            attachments: [],
          },
        ],
      },
      attachments: [],
      decorators: [],
      tagIds: ['tag:japanese'],
      pinned: true,
      archived: false,
      replyToMessageId: null,
      sourceMessageId: null,
      reactions: [],
      edited: false,
      createdAt: '2026-01-04T09:00:00.000Z',
      updatedAt: null,
    },
    'ms:study-image': {
      id: 'ms:study-image',
      chatboxId: 'cb:study',
      sender: 'user',
      variant: 'text',
      content: {
        text: '',
      },
      attachments: [
        {
          id: 'att:study-image',
          type: 'image',
          url: '/dummy/study.png',
          width: 1280,
          height: 720,
        },
      ],
      decorators: [],
      tagIds: [],
      pinned: false,
      archived: false,
      replyToMessageId: null,
      sourceMessageId: null,
      reactions: [
        {
          emoji: '❤️',
          count: 1,
        },
      ],
      edited: false,
      createdAt: '2026-01-05T10:30:00.000Z',
      updatedAt: null,
    },
    'ms:study-last': {
      id: 'ms:study-last',
      chatboxId: 'cb:study',
      sender: 'user',
      variant: 'text',
      content: {
        text: 'Finished the vocabulary review! The focus timer helped me stay on track for the full session.',
      },
      attachments: [],
      decorators: [],
      tagIds: ['tag:japanese', 'tag:vocabulary'],
      pinned: false,
      archived: false,
      replyToMessageId: null,
      sourceMessageId: null,
      reactions: [],
      edited: false,
      createdAt: '2026-06-09T10:30:00.000Z',
      updatedAt: null,
    },
    'ms:diary-1': {
      id: 'ms:diary-1',
      chatboxId: 'cb:diary',
      sender: 'user',
      variant: 'text',
      content: {
        text: 'Had a quiet morning with coffee and notes.',
      },
      attachments: [],
      decorators: [],
      tagIds: ['tag:diary'],
      pinned: false,
      archived: false,
      replyToMessageId: null,
      sourceMessageId: null,
      reactions: [],
      edited: false,
      createdAt: '2026-06-08T09:15:00.000Z',
      updatedAt: null,
    },
    'ms:project-1': {
      id: 'ms:project-1',
      chatboxId: 'cb:project',
      sender: 'user',
      variant: 'text',
      content: {
        text: 'Finish diary architecture.',
      },
      attachments: [],
      decorators: [],
      tagIds: ['tag:project', 'tag:important'],
      pinned: false,
      archived: false,
      replyToMessageId: null,
      sourceMessageId: null,
      reactions: [],
      edited: false,
      createdAt: '2026-01-09T18:00:00.000Z',
      updatedAt: null,
    },
    'ms:project-2': {
      id: 'ms:project-2',
      chatboxId: 'cb:project',
      sender: 'user',
      variant: 'text',
      content: {
        text: 'MVP Release',
      },
      attachments: [],
      decorators: [
        {
          type: 'timer',
          mode: 'datetime',
          pause: false,
          running: false,
          durationMs: 0,
          startedAt: null,
          targetDate: '2026-02-01T00:00:00.000Z',
          deadlineAt: null,
        },
      ],
      tagIds: ['tag:project'],
      pinned: true,
      archived: false,
      replyToMessageId: null,
      sourceMessageId: null,
      reactions: [],
      edited: false,
      createdAt: '2026-01-10T20:00:00.000Z',
      updatedAt: null,
    },
    'ms:anime-1': {
      id: 'ms:anime-1',
      chatboxId: 'cb:anime',
      sender: 'user',
      variant: 'text',
      content: {
        text: 'Watch Frieren this weekend.',
      },
      attachments: [],
      decorators: [],
      tagIds: ['tag:anime'],
      pinned: false,
      archived: false,
      replyToMessageId: null,
      sourceMessageId: null,
      reactions: [],
      edited: false,
      createdAt: '2026-01-15T21:00:00.000Z',
      updatedAt: null,
    },
  },

  // #endregion

  customPalettes: {},

  // #region Orders

  orders: {
    rootOrders: ['gr:personal', 'gr:work', 'gr:entertainment'],
    groupChatboxOrders: {
      'gr:personal': ['cb:study', 'cb:diary'],
      'gr:work': ['cb:project'],
      'gr:entertainment': ['cb:anime'],
    },
    chatboxMessageOrders: {
      'cb:study': [
        'ms:study-text',
        'ms:study-todo',
        'ms:study-image',
        'ms:study-last',
      ],
      'cb:diary': ['ms:diary-1'],
      'cb:project': ['ms:project-1', 'ms:project-2'],
      'cb:anime': ['ms:anime-1'],
    },
  },

  // #endregion
};

// #endregion
