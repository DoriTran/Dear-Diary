import type { FC } from 'react';

import { faStar } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

import { AdIcon } from '@/packages/base';
import LayoutCard from '@/packages/ui/LayoutCard/LayoutCard';

import type { ChatboxData } from '../../types';

import styles from './Chatbox.module.css';

export type ChatboxProps = {
  data: ChatboxData;
};

const Chatbox: FC<ChatboxProps> = ({ data }) => {
  const { title, preview, tags, icon, iconBg, pinned, timestamp, unreadCount } =
    data;

  return (
    <LayoutCard tag="article" className={styles.root}>
      {pinned ? (
        <span className={styles.pin} aria-label="Pinned">
          <AdIcon icon={faStar} size={10} />
        </span>
      ) : null}

      <span
        className={styles.iconWrap}
        style={{ background: iconBg }}
        aria-hidden
      >
        <AdIcon icon={icon} size={16} />
      </span>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.meta}>
          <time className={styles.time}>{timestamp}</time>
          {unreadCount != null && unreadCount > 0 ? (
            <span className={styles.unread}>{unreadCount}</span>
          ) : null}
        </div>
        <p className={styles.preview}>{preview}</p>
        {tags && tags.length > 0 ? (
          <ul className={styles.tags}>
            {tags.map((tag) => (
              <li key={tag.label}>
                <span
                  className={clsx(
                    styles.tag,
                    tag.tone && styles[`tag_${tag.tone}`],
                  )}
                >
                  {tag.label}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </LayoutCard>
  );
};

export default Chatbox;
