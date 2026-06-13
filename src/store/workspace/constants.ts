import type { WorkspaceStore } from './type';

export const workspaceInitialState: WorkspaceStore = {
  workspaces: {},

  sources: {},

  records: {},

  orders: {
    workspaceIds: [],
  },

  ui: {
    selectedWorkspaceId: null,
  },
};

export const workspaceDummyState: WorkspaceStore = {
  workspaces: {
    'ws:daily-work': {
      id: 'ws:daily-work',

      type: 'scheduler',

      name: 'Daily Work Meeting',

      description: 'Team meetings, syncs and planning.',

      icon: '📅',

      color: '#A78BFA',

      sourceIds: ['src:work-chat', 'src:job-chat', 'src:meeting-chat'],

      createdAt: '2026-01-01T00:00:00.000Z',

      updatedAt: null,
    },

    'ws:study-progress': {
      id: 'ws:study-progress',

      type: 'analytics',

      name: 'Study Progress',

      description: 'Track study performance.',

      icon: '📊',

      color: '#86EFAC',

      sourceIds: ['src:japanese-chat'],

      createdAt: '2026-01-01T00:00:00.000Z',

      updatedAt: null,
    },
  },

  sources: {
    'src:work-chat': {
      id: 'src:work-chat',

      type: 'chatbox',

      label: 'Work Chat',

      chatboxId: 'cb:work-chat',

      createdAt: '2026-01-01T00:00:00.000Z',
    },

    'src:job-chat': {
      id: 'src:job-chat',

      type: 'chatbox',

      label: 'Job Chat',

      chatboxId: 'cb:job-chat',

      createdAt: '2026-01-01T00:00:00.000Z',
    },

    'src:meeting-chat': {
      id: 'src:meeting-chat',

      type: 'chatbox',

      label: 'Meeting Chat',

      chatboxId: 'cb:meeting-chat',

      createdAt: '2026-01-01T00:00:00.000Z',
    },

    'src:japanese-chat': {
      id: 'src:japanese-chat',

      type: 'chatbox',

      label: 'Japanese Study',

      chatboxId: 'cb:japanese-study',

      createdAt: '2026-01-01T00:00:00.000Z',
    },
  },

  records: {
    'record:1': {
      id: 'record:1',

      workspaceId: 'ws:daily-work',

      type: 'scheduler-event',

      source: {
        type: 'local',
      },

      payload: {
        title: 'Sprint Planning',

        startDate: '2026-05-20T09:00:00.000Z',

        endDate: '2026-05-20T10:00:00.000Z',

        allDay: false,
      },

      createdAt: '2026-01-01T00:00:00.000Z',

      updatedAt: null,
    },

    'record:2': {
      id: 'record:2',

      workspaceId: 'ws:daily-work',

      type: 'scheduler-event',

      source: {
        type: 'chatbox',

        chatboxId: 'cb:work-chat',
      },

      payload: {
        title: 'Team Standup',

        startDate: '2026-05-21T09:00:00.000Z',

        endDate: '2026-05-21T09:30:00.000Z',

        allDay: false,
      },

      createdAt: '2026-01-01T00:00:00.000Z',

      updatedAt: null,
    },
  },

  orders: {
    workspaceIds: ['ws:daily-work', 'ws:study-progress'],
  },

  ui: {
    selectedWorkspaceId: 'ws:daily-work',
  },
};
