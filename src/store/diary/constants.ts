import type { DiaryStore } from './type';

// #region Initial State

export const diaryInitialState: DiaryStore = {
  groups: {},
  chatboxes: {},
  messages: {},
  tags: {},
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
      icon: 'faHeart',
      color: '#F8BBD9',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: null,
    },
    'gr:work': {
      id: 'gr:work',
      name: 'Work',
      icon: 'faBriefcase',
      color: '#B39DDB',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: null,
    },
    'gr:entertainment': {
      id: 'gr:entertainment',
      name: 'Entertainment',
      icon: 'faGamepad',
      color: '#AED581',
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
      color: '#FF8A80',
    },
    'tag:japanese': {
      id: 'tag:japanese',
      label: 'Japanese',
      color: '#81D4FA',
    },
    'tag:project': {
      id: 'tag:project',
      label: 'Project',
      color: '#CE93D8',
    },
    'tag:anime': {
      id: 'tag:anime',
      label: 'Anime',
      color: '#A5D6A7',
    },
    'tag:vocabulary': {
      id: 'tag:vocabulary',
      label: 'vocabulary',
      color: '#F8BBD9',
    },
    'tag:grammar': {
      id: 'tag:grammar',
      label: 'grammar',
      color: '#A5D6A7',
    },
    'tag:diary': {
      id: 'tag:diary',
      label: 'diary',
      color: '#F8BBD9',
    },
  },

  // #endregion

  // #region Chatboxes

  chatboxes: {
    'cb:study': {
      id: 'cb:study',
      groupId: 'gr:personal',
      name: 'Japanese Study',
      icon: 'faBookOpen',
      color: '#E1BEE7',
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
      icon: 'faPenFancy',
      color: '#F8BBD9',
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
      icon: 'faPenFancy',
      color: '#B39DDB',
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
      icon: 'faTv',
      color: '#AED581',
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
      type: 'text',
      content: {
        text: 'Learn 20 new Japanese words today.',
      },
      tagIds: ['tag:japanese'],
      pinned: false,
      reactions: [],
      edited: false,
      createdAt: '2026-01-03T08:00:00.000Z',
      updatedAt: null,
    },
    'ms:study-todo': {
      id: 'ms:study-todo',
      chatboxId: 'cb:study',
      type: 'todo',
      content: {
        items: [
          {
            id: 'todo:1',
            label: 'N5 Vocabulary',
            completed: true,
          },
          {
            id: 'todo:2',
            label: 'N5 Grammar',
            completed: false,
          },
        ],
      },
      tagIds: ['tag:japanese'],
      pinned: true,
      reactions: [],
      edited: false,
      createdAt: '2026-01-04T09:00:00.000Z',
      updatedAt: null,
    },
    'ms:study-image': {
      id: 'ms:study-image',
      chatboxId: 'cb:study',
      type: 'image',
      content: {
        url: '/dummy/study.png',
        width: 1280,
        height: 720,
      },
      tagIds: [],
      pinned: false,
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
      type: 'text',
      content: {
        text: 'Finished the vocabulary review! The focus timer helped me stay on track for the full session.',
      },
      tagIds: ['tag:japanese', 'tag:vocabulary'],
      pinned: false,
      reactions: [],
      edited: false,
      createdAt: '2026-06-09T10:30:00.000Z',
      updatedAt: null,
    },
    'ms:diary-1': {
      id: 'ms:diary-1',
      chatboxId: 'cb:diary',
      type: 'text',
      content: {
        text: 'Had a quiet morning with coffee and notes.',
      },
      tagIds: ['tag:diary'],
      pinned: false,
      reactions: [],
      edited: false,
      createdAt: '2026-06-08T09:15:00.000Z',
      updatedAt: null,
    },
    'ms:project-1': {
      id: 'ms:project-1',
      chatboxId: 'cb:project',
      type: 'text',
      content: {
        text: 'Finish diary architecture.',
      },
      tagIds: ['tag:project', 'tag:important'],
      pinned: false,
      reactions: [],
      edited: false,
      createdAt: '2026-01-09T18:00:00.000Z',
      updatedAt: null,
    },
    'ms:project-2': {
      id: 'ms:project-2',
      chatboxId: 'cb:project',
      type: 'countdown',
      content: {
        title: 'MVP Release',
        targetDate: '2026-02-01T00:00:00.000Z',
      },
      tagIds: ['tag:project'],
      pinned: true,
      reactions: [],
      edited: false,
      createdAt: '2026-01-10T20:00:00.000Z',
      updatedAt: null,
    },
    'ms:anime-1': {
      id: 'ms:anime-1',
      chatboxId: 'cb:anime',
      type: 'text',
      content: {
        text: 'Watch Frieren this weekend.',
      },
      tagIds: ['tag:anime'],
      pinned: false,
      reactions: [],
      edited: false,
      createdAt: '2026-01-15T21:00:00.000Z',
      updatedAt: null,
    },
  },

  // #endregion

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
