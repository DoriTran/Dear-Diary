import {
  faBriefcase,
  faFilm,
  faGraduationCap,
  faLightbulb,
  faMusic,
  faPenFancy,
  faShuffle,
  faTv,
  faHeart,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

import type { GroupData } from './types';

export const diarySidebarGroups: GroupData[] = [
  {
    id: 'work',
    title: 'Work',
    brushColor: '#ffc9a3',
    groupIcon: faBriefcase,
    chatboxes: [
      {
        id: 'study',
        title: 'Study',
        preview: 'Today I learned vocabulary from chapter 5...',
        tags: [
          { label: '#japanese', tone: 'purple' },
          { label: '#vocabulary', tone: 'pink' },
        ],
        icon: faGraduationCap,
        iconBg: 'color-mix(in srgb, var(--accent-purple) 22%, var(--surface))',
        pinned: true,
        timestamp: '10:30 AM',
        unreadCount: 12,
      },
      {
        id: 'daily-standup',
        title: 'Daily Standup',
        preview: 'Blocked on design review for icons.',
        icon: faUsers,
        iconBg: 'color-mix(in srgb, var(--accent-blue) 20%, var(--surface))',
        timestamp: 'Yesterday',
        unreadCount: 3,
      },
      {
        id: 'project-ideas',
        title: 'Project Ideas',
        preview: 'Sketch sidebar layout with brush highlights.',
        icon: faLightbulb,
        iconBg: 'color-mix(in srgb, var(--accent-yellow) 28%, var(--surface))',
        timestamp: 'Mon',
      },
    ],
  },
  {
    id: 'personal',
    title: 'Personal',
    brushColor: '#ffb3d9',
    groupIcon: faHeart,
    chatboxes: [
      {
        id: 'daily-diary',
        title: 'Daily Diary',
        preview: 'Had a quiet morning with coffee and notes.',
        tags: [{ label: '#diary', tone: 'pink' }],
        icon: faPenFancy,
        iconBg: 'color-mix(in srgb, var(--primary) 18%, var(--surface))',
        pinned: true,
        timestamp: '9:15 AM',
        unreadCount: 8,
      },
      {
        id: 'random-thoughts',
        title: 'Random Thoughts',
        preview: 'Maybe reorganize tags by mood next week.',
        icon: faShuffle,
        iconBg: 'color-mix(in srgb, var(--accent-green) 18%, var(--surface))',
        timestamp: 'Sun',
      },
    ],
  },
  {
    id: 'entertainment',
    title: 'Entertainment',
    brushColor: '#b8e8c8',
    groupIcon: faFilm,
    chatboxes: [
      {
        id: 'anime-watchlist',
        title: 'Anime Watchlist',
        preview: 'Finish season 2 this weekend.',
        tags: [{ label: '#anime', tone: 'teal' }],
        icon: faTv,
        iconBg: 'color-mix(in srgb, #7ec8b8 22%, var(--surface))',
        timestamp: 'Fri',
      },
      {
        id: 'music-playlist',
        title: 'Music Playlist',
        preview: 'Lo-fi beats for focus sessions.',
        icon: faMusic,
        iconBg: 'color-mix(in srgb, var(--accent-purple) 16%, var(--surface))',
        timestamp: 'Thu',
      },
    ],
  },
];
