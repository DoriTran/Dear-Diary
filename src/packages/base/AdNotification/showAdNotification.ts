import { notifications, type NotificationData } from '@mantine/notifications';

import { mergeAdNotificationClassNames } from './notificationTheme';

export type AdNotificationShowOptions = NotificationData;

export const showAdNotification = ({
  classNames,
  color = 'grape',
  autoClose = 4000,
  ...options
}: AdNotificationShowOptions) => {
  return notifications.show({
    color,
    autoClose,
    ...options,
    message: options.message ?? '',
    classNames: mergeAdNotificationClassNames(classNames),
  });
};
