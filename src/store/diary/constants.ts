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
  ui: {
    selectedChatboxId: null,
    expandedGroupIds: [],
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
      description: 'My study notes and learning journey.',
      pinned: true,
      archived: false,
      tags: [
        {
          tagId: 'tag:japanese',
          count: 2,
        },
      ],
      totalMessage: 3,
      lastMessageId: 'ms:study-image',
      lastMessageAt: '2026-01-05T10:30:00.000Z',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-05T10:30:00.000Z',
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
      tags: [
        {
          tagId: 'tag:project',
          count: 2,
        },
        {
          tagId: 'tag:important',
          count: 1,
        },
      ],
      totalMessage: 2,
      lastMessageId: 'ms:project-2',
      lastMessageAt: '2026-01-10T20:00:00.000Z',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-10T20:00:00.000Z',
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
      tags: [
        {
          tagId: 'tag:anime',
          count: 1,
        },
      ],
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
      'gr:personal': ['cb:study'],
      'gr:work': ['cb:project'],
      'gr:entertainment': ['cb:anime'],
    },
    chatboxMessageOrders: {
      'cb:study': ['ms:study-text', 'ms:study-todo', 'ms:study-image'],
      'cb:project': ['ms:project-1', 'ms:project-2'],
      'cb:anime': ['ms:anime-1'],
    },
  },

  // #endregion

  // #region UI

  ui: {
    selectedChatboxId: 'cb:study',
    expandedGroupIds: ['gr:personal', 'gr:work', 'gr:entertainment'],
  },

  // #endregion
};

// #endregion
