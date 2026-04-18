import type { DiaryStore } from './type';

export const diaryInitialState: DiaryStore = {
  groups: {},
  chatboxes: {},
  messages: {},
  orders: {
    rootOrders: [],
    groupChatboxOrders: {},
    chatboxMessageOrders: {},
  },
};

/** Sample data for development, tests, or Storybook. IDs follow store conventions: `gr:`, `cb:`, `ms:`. */
export const diaryDummyState: DiaryStore = {
  groups: {
    'gr:work': {
      id: 'gr:work',
      title: 'Work',
      description: 'Notes and threads from work.',
      color: '#FDE7C9',
      createdAt: '2026-04-01T09:00:00.000Z',
      updatedAt: '',
    },
    'gr:personal': {
      id: 'gr:personal',
      title: 'Personal',
      description: 'Private thoughts and plans.',
      color: '#FDE7C9',
      createdAt: '2026-04-02T10:00:00.000Z',
      updatedAt: '',
    },
  },
  chatboxes: {
    'cb:work-daily': {
      id: 'cb:work-daily',
      groupId: 'gr:work',
      title: 'Daily standup',
      description: 'Quick updates and blockers.',
      icon: '',
      color: '',
      createdAt: '2026-04-03T08:00:00.000Z',
      updatedAt: '',
    },
    'cb:work-meetings': {
      id: 'cb:work-meetings',
      groupId: 'gr:work',
      title: 'Meetings',
      description: 'Agendas and follow-ups.',
      icon: '',
      color: '',
      createdAt: '2026-04-03T08:05:00.000Z',
      updatedAt: '',
    },
    'cb:personal-notes': {
      id: 'cb:personal-notes',
      groupId: 'gr:personal',
      title: 'Notes',
      description: 'Loose ideas and reminders.',
      icon: '',
      color: '',
      createdAt: '2026-04-04T12:00:00.000Z',
      updatedAt: '',
    },
    'cb:ideas': {
      id: 'cb:ideas',
      groupId: '',
      title: 'Ideas inbox',
      description: 'Unsorted ideas (root-level chatbox).',
      icon: '',
      color: '#E8A85C',
      createdAt: '2026-04-05T15:30:00.000Z',
      updatedAt: '',
    },
  },
  messages: {
    'ms:wd-1': {
      id: 'ms:wd-1',
      chatboxId: 'cb:work-daily',
      content: [
        { type: 'paragraph', content: 'Shipped the diary sidebar today.' },
        { type: 'paragraph', content: 'Next: wire up message ordering.' },
      ],
      tagIds: [],
      createdAt: '2026-04-06T09:15:00.000Z',
      updatedAt: '',
    },
    'ms:wd-2': {
      id: 'ms:wd-2',
      chatboxId: 'cb:work-daily',
      content: [
        {
          type: 'paragraph',
          content: 'Blocked on design review for icons.',
        },
      ],
      tagIds: [],
      createdAt: '2026-04-07T09:00:00.000Z',
      updatedAt: '',
    },
    'ms:wm-1': {
      id: 'ms:wm-1',
      chatboxId: 'cb:work-meetings',
      content: [
        {
          type: 'paragraph',
          content: 'Q2 planning — prioritize offline sync.',
        },
      ],
      tagIds: [],
      createdAt: '2026-04-06T14:00:00.000Z',
      updatedAt: '',
    },
    'ms:pn-1': {
      id: 'ms:pn-1',
      chatboxId: 'cb:personal-notes',
      content: [
        {
          type: 'paragraph',
          content: 'Remember to water the plants.',
        },
      ],
      tagIds: [],
      createdAt: '2026-04-07T18:20:00.000Z',
      updatedAt: '',
    },
    'ms:id-1': {
      id: 'ms:id-1',
      chatboxId: 'cb:ideas',
      content: [
        {
          type: 'paragraph',
          content: 'Voice notes as first-class message blocks?',
        },
        {
          type: 'paragraph',
          content: 'Sketch a rough UX in Figma later.',
        },
      ],
      tagIds: [],
      createdAt: '2026-04-08T11:00:00.000Z',
      updatedAt: '',
    },
  },
  orders: {
    rootOrders: ['gr:work', 'cb:ideas', 'gr:personal'],
    groupChatboxOrders: {
      'gr:work': ['cb:work-daily', 'cb:work-meetings'],
      'gr:personal': ['cb:personal-notes'],
    },
    chatboxMessageOrders: {
      'cb:work-daily': ['ms:wd-1', 'ms:wd-2'],
      'cb:work-meetings': ['ms:wm-1'],
      'cb:personal-notes': ['ms:pn-1'],
      'cb:ideas': ['ms:id-1'],
    },
  },
};
