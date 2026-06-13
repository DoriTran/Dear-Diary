import type { ChatboxDetailData, MessageThreadData } from './types';

export const diaryChatboxDetails: Record<string, ChatboxDetailData> = {
  'cb:study': {
    id: 'cb:study',
    title: 'Study',
    subtitle: 'My study notes and learning journey',
    tags: [
      { label: '#important', tone: 'purple' },
      { label: '#japanese', tone: 'pink' },
    ],
    notificationCount: 2,
  },
  'daily-standup': {
    id: 'daily-standup',
    title: 'Daily Standup',
    subtitle: 'Quick updates and blockers',
    tags: [{ label: '#work', tone: 'blue' }],
  },
  'cb:project': {
    id: 'cb:project',
    title: 'Dear Diary',
    subtitle: 'Architecture and development',
    tags: [{ label: '#project', tone: 'yellow' }],
  },
  'cb:diary': {
    id: 'cb:diary',
    title: 'Daily Diary',
    subtitle: 'Personal reflections',
    tags: [{ label: '#diary', tone: 'pink' }],
    notificationCount: 1,
  },
  'random-thoughts': {
    id: 'random-thoughts',
    title: 'Random Thoughts',
    subtitle: 'Unsorted ideas',
    tags: [],
  },
  'cb:anime': {
    id: 'cb:anime',
    title: 'Anime Watchlist',
    subtitle: 'Shows to watch',
    tags: [{ label: '#anime', tone: 'teal' }],
  },
  'music-playlist': {
    id: 'music-playlist',
    title: 'Music Playlist',
    subtitle: 'Focus and chill tracks',
    tags: [],
  },
  'meditation-log': {
    id: 'meditation-log',
    title: 'Meditation Log',
    subtitle: 'Mindfulness sessions',
    tags: [{ label: '#meditation', tone: 'blue' }],
  },
  'workout-tracker': {
    id: 'workout-tracker',
    title: 'Workout Tracker',
    subtitle: 'Exercise and wellness',
    tags: [{ label: '#fitness', tone: 'teal' }],
  },
};

const placeholderThread = (
  chatboxId: string,
  userText: string,
): MessageThreadData => ({
  chatboxId,
  groups: [
    {
      date: 'May 21, 2026',
      messages: [
        {
          id: `${chatboxId}-ai-1`,
          author: 'ai',
          blocks: [
            {
              type: 'text',
              content: 'How can I help you with this chatbox today?',
            },
          ],
          time: '09:00',
        },
        {
          id: `${chatboxId}-user-1`,
          author: 'user',
          blocks: [{ type: 'text', content: userText }],
          time: '09:01',
          read: true,
        },
      ],
    },
  ],
});

export const diaryMessageThreads: Record<string, MessageThreadData> = {
  'cb:study': {
    chatboxId: 'cb:study',
    groups: [
      {
        date: 'May 20, 2026',
        messages: [
          {
            id: 'study-ai-1',
            author: 'ai',
            blocks: [
              {
                type: 'text',
                content:
                  "Good morning! Ready for today's Japanese study session? 🌸",
              },
              {
                type: 'list',
                items: [
                  'Review chapter 5 vocabulary (20 words)',
                  'Practice hiragana writing',
                  'Watch one episode with subtitles',
                ],
              },
            ],
            time: '08:30',
          },
          {
            id: 'study-user-1',
            author: 'user',
            blocks: [
              {
                type: 'text',
                content:
                  "Yes! Let's start with vocabulary. I also want to try the focus timer today ⏱️",
              },
            ],
            time: '08:31',
            read: true,
          },
          {
            id: 'study-ai-2',
            author: 'ai',
            blocks: [
              {
                type: 'text',
                content:
                  "Great plan! I've set up a 25-minute focus session for you. Here are your chapter 5 words:",
              },
              {
                type: 'list',
                items: [
                  '勉強 (べんきょう) — study',
                  '学校 (がっこう) — school',
                  '先生 (せんせい) — teacher',
                ],
              },
              { type: 'timer', label: 'Focus Time', duration: '25:00' },
            ],
            time: '08:32',
          },
        ],
      },
      {
        date: 'May 21, 2026',
        messages: [
          {
            id: 'study-user-2',
            author: 'user',
            blocks: [
              {
                type: 'text',
                content:
                  'Finished the vocabulary review! The focus timer really helped me stay on track 💪',
              },
            ],
            time: '09:15',
            read: true,
            reaction: { emoji: '❤️', count: 1 },
          },
          {
            id: 'study-ai-3',
            author: 'ai',
            blocks: [
              {
                type: 'text',
                content:
                  "Amazing work! You've completed 3 study sessions this week. Keep it up! 🎉",
              },
            ],
            time: '09:16',
          },
        ],
      },
    ],
  },
  'daily-standup': placeholderThread(
    'daily-standup',
    'Blocked on design review for icons.',
  ),
  'cb:project': placeholderThread(
    'cb:project',
    'Sketch sidebar layout with brush highlights.',
  ),
  'cb:diary': placeholderThread(
    'cb:diary',
    'Had a quiet morning with coffee and notes.',
  ),
  'random-thoughts': placeholderThread(
    'random-thoughts',
    'Maybe reorganize tags by mood next week.',
  ),
  'cb:anime': placeholderThread('cb:anime', 'Finish season 2 this weekend.'),
  'music-playlist': placeholderThread(
    'music-playlist',
    'Lo-fi beats for focus sessions.',
  ),
  'meditation-log': placeholderThread(
    'meditation-log',
    'Completed 10 min mindfulness.',
  ),
  'workout-tracker': placeholderThread(
    'workout-tracker',
    'Yoga and stretching done.',
  ),
};
