import {
  Children,
  cloneElement,
  isValidElement,
  type FC,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

import type { AdNotificationShowOptions } from './showAdNotification';

import styles from './AdNotification.module.css';
import { showAdNotification } from './showAdNotification';

export type AdNotificationProps = AdNotificationShowOptions & {
  children: ReactNode;
  /** Called after the notification is shown. */
  onTrigger?: (event: MouseEvent) => void;
};

const AdNotification: FC<AdNotificationProps> = ({
  children,
  onTrigger,
  ...notificationOptions
}) => {
  const handleClick = (event: MouseEvent) => {
    showAdNotification(notificationOptions);
    onTrigger?.(event);
  };

  if (Children.count(children) === 1 && isValidElement(children)) {
    const child = children as ReactElement<{
      onClick?: (event: MouseEvent) => void;
    }>;

    return cloneElement(child, {
      onClick: (event: MouseEvent) => {
        handleClick(event);
        child.props.onClick?.(event);
      },
    });
  }

  // Fallback: no layout box, but still receives bubbled clicks from descendants.
  return (
    <div
      className={styles.bubbleRoot}
      onClick={handleClick}
      role="presentation"
    >
      {children}
    </div>
  );
};

export default AdNotification;
