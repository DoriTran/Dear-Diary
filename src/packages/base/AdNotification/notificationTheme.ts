import type { NotificationData } from '@mantine/notifications';

import styles from './AdNotification.module.css';

export const adNotificationClassNames = {
  root: styles.root,
  title: styles.title,
  description: styles.description,
  closeButton: styles.closeButton,
} as const;

export const mergeAdNotificationClassNames = (
  classNames?: NotificationData['classNames'],
): NotificationData['classNames'] => ({
  ...adNotificationClassNames,
  ...classNames,
});
