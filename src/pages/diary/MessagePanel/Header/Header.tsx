import type { FC } from 'react';

import {
  faBell,
  faColumns,
  faEllipsis,
  faMagnifyingGlass,
  faPen,
  faPlus,
  faRectangleList,
} from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

import { AdIcon } from '@/packages/base';

import type { ChatboxDetailData } from '../../types';

import styles from './Header.module.css';

export type HeaderProps = {
  data: ChatboxDetailData;
  detailPanelCollapsed: boolean;
  onToggleDetailPanel: () => void;
};

const Header: FC<HeaderProps> = ({
  data,
  detailPanelCollapsed,
  onToggleDetailPanel,
}) => {
  const { title, subtitle, tags, notificationCount } = data;

  return (
    <header className={styles.root}>
      <div className={styles.main}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{title}</h1>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Edit title"
          >
            <AdIcon icon={faPen} size={13} />
          </button>
        </div>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.tagsRow}>
          {tags.map((tag) => (
            <span
              key={tag.label}
              className={clsx(
                styles.tag,
                tag.tone && styles[`tag_${tag.tone}`],
              )}
            >
              {tag.label}
            </span>
          ))}
          <button
            type="button"
            className={styles.addTagBtn}
            aria-label="Add tag"
          >
            <AdIcon icon={faPlus} size={11} />
          </button>
        </div>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.iconBtn} aria-label="Search">
          <AdIcon icon={faMagnifyingGlass} size={15} />
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label={
            detailPanelCollapsed ? 'Show detail panel' : 'Hide detail panel'
          }
          aria-pressed={!detailPanelCollapsed}
          onClick={onToggleDetailPanel}
        >
          <AdIcon
            icon={detailPanelCollapsed ? faRectangleList : faColumns}
            size={15}
          />
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label="Notifications"
        >
          <AdIcon icon={faBell} size={15} />
          {notificationCount != null && notificationCount > 0 ? (
            <span className={styles.badge}>{notificationCount}</span>
          ) : null}
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label="More options"
        >
          <AdIcon icon={faEllipsis} size={15} />
        </button>
      </div>
    </header>
  );
};

export default Header;
