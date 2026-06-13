import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import type { FC } from 'react';

import type { Message } from '@/store/diary/type';

import { AdIcon } from '@/packages/base';

import {
  formatChatboxTime,
  getMessagePreview,
} from '../../ChatboxSidebar/Chatbox/chatbox.utils';
import { getMessagePreviewText } from '../../MessagePanel/MessageFeed/messagePreview.utils';
import { getMessageThumbnail } from '../detailPanel.utils';

import styles from './DetailMessagePreviewRow.module.css';

export type DetailMessagePreviewRowProps = {
  message: Message;
  showPin?: boolean;
  tagLabels?: string[];
  onClick?: () => void;
};

const DetailMessagePreviewRow: FC<DetailMessagePreviewRowProps> = ({
  message,
  showPin = false,
  tagLabels = [],
  onClick,
}) => {
  const title = getMessagePreview(message) || getMessagePreviewText(message);
  const snippet = getMessagePreviewText(message);
  const thumbnail = getMessageThumbnail(message);
  const timeLabel = formatChatboxTime(message.createdAt);

  return (
    <button type="button" className={styles.root} onClick={onClick}>
      {thumbnail ? (
        <span
          className={styles.thumb}
          style={{ backgroundImage: `url(${thumbnail})` }}
          aria-hidden
        />
      ) : (
        <span className={styles.thumbPlaceholder} aria-hidden />
      )}
      <span className={styles.body}>
        <span className={styles.titleRow}>
          <span className={styles.title}>{title}</span>
          {showPin ? (
            <span className={styles.pinIcon}>
              <AdIcon icon={faThumbtack} size={10} />
            </span>
          ) : null}
        </span>
        {snippet !== title ? (
          <span className={styles.snippet}>{snippet}</span>
        ) : null}
        {tagLabels.length > 0 ? (
          <span className={styles.tags}>{tagLabels.join(' · ')}</span>
        ) : null}
        <time className={styles.time}>{timeLabel}</time>
      </span>
    </button>
  );
};

export default DetailMessagePreviewRow;
