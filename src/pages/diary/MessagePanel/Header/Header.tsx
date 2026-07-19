import type { FC, CSSProperties, RefObject } from 'react';

import {
  faClock,
  faColumns,
  faComment,
  faFolder,
  faMagnifyingGlass,
  faPen,
  faRectangleList,
  faThumbtack,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

import { AdIcon } from '@/packages/base';

import type { MessageHeaderData } from './useMessageHeaderData';

import { formatTotalMessages } from '../../ChatboxSidebar/Chatbox/chatbox.utils';
import styles from './Header.module.css';

export type HeaderProps = {
  data: MessageHeaderData;
  detailPanelCollapsed: boolean;
  onToggleDetailPanel: () => void;
  onEdit: () => void;
  searchQuery: string;
  searchActive: boolean;
  searchInputRef: RefObject<HTMLInputElement | null>;
  onSearchQueryChange: (value: string) => void;
  onSearchActiveChange: (active: boolean) => void;
};

const Header: FC<HeaderProps> = ({
  data,
  detailPanelCollapsed,
  onToggleDetailPanel,
  onEdit,
  searchQuery,
  searchActive,
  searchInputRef,
  onSearchQueryChange,
  onSearchActiveChange,
}) => {
  const {
    name,
    description,
    icon,
    paletteSoft,
    paletteMain,
    paletteStrong,
    iconBg,
    pinned,
    groupName,
    totalMessage,
    updatedLabel,
    updatedAt,
  } = data;

  const messageLabel =
    totalMessage === 1
      ? '1 message'
      : `${formatTotalMessages(totalMessage)} messages`;

  return (
    <header
      className={styles.root}
      style={
        {
          '--header-soft': paletteSoft,
          '--header-main': paletteMain,
          '--header-strong': paletteStrong,
        } as CSSProperties
      }
    >
      <div className={styles.topRow}>
        <div className={styles.identityBlock}>
          <div className={styles.iconArea}>
            <span
              className={styles.iconWrap}
              style={{ background: iconBg }}
              aria-hidden
            >
              <AdIcon icon={icon} source="lucide" size={36} />
            </span>
            {pinned ? (
              <span className={styles.overlayPin} aria-label="Pinned">
                <AdIcon icon={faThumbtack} size={12} />
              </span>
            ) : null}
          </div>

          <div className={styles.textBlock}>
            <div className={styles.titleRow}>
              <h1 className={styles.name}>{name}</h1>
              <button
                type="button"
                className={styles.editBtn}
                aria-label={`Edit ${name}`}
                onClick={onEdit}
              >
                <AdIcon icon={faPen} size={12} />
              </button>
            </div>

            {description ? (
              <p className={styles.description}>{description}</p>
            ) : null}

            <div className={styles.metadataRow}>
              {groupName ? (
                <>
                  <span className={styles.metaItem}>
                    <AdIcon icon={faFolder} size={10} />
                    {groupName}
                  </span>
                  <span className={styles.metaDot} aria-hidden>
                    •
                  </span>
                </>
              ) : null}
              <span className={styles.metaItem}>
                <AdIcon icon={faComment} size={10} />
                {messageLabel}
              </span>
              {updatedLabel ? (
                <>
                  <span className={styles.metaDot} aria-hidden>
                    •
                  </span>
                  <span className={styles.metaItem}>
                    <AdIcon icon={faClock} size={10} />
                    <time dateTime={updatedAt ?? undefined}>
                      {updatedLabel}
                    </time>
                  </span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <button
          type="button"
          className={styles.toggleBtn}
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
      </div>

      {searchActive || searchQuery ? (
        <div className={styles.searchRow}>
          <span className={styles.searchIcon}>
            <AdIcon icon={faMagnifyingGlass} size={12} />
          </span>
          <input
            ref={searchInputRef}
            type="search"
            className={styles.searchInput}
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            aria-label="Search messages in this chatbox"
          />
          <button
            type="button"
            className={styles.searchCloseBtn}
            aria-label="Close search"
            onClick={() => {
              onSearchQueryChange('');
              onSearchActiveChange(false);
            }}
          >
            <AdIcon icon={faXmark} size={12} />
          </button>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
