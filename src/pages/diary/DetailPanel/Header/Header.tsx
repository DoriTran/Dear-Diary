import {
  faBell,
  faMagnifyingGlass,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
import type { FC, CSSProperties } from 'react';

import { AdIcon } from '@/packages/base';

import type { DetailPanelIdentity } from '../detailPanel.utils';

import styles from './Header.module.css';

export type HeaderProps = {
  identity: DetailPanelIdentity;
  onSearch: () => void;
  onEdit: () => void;
  onToggleNotification: () => void;
};

const Header: FC<HeaderProps> = ({
  identity,
  onSearch,
  onEdit,
  onToggleNotification,
}) => {
  const { name, description, icon, paletteSoft, paletteMain, paletteStrong, iconBg, notificationEnabled } =
    identity;

  return (
    <header
      className={styles.root}
      style={
        {
          '--panel-soft': paletteSoft,
          '--panel-main': paletteMain,
          '--panel-strong': paletteStrong,
        } as CSSProperties
      }
    >
      <div className={styles.identity}>
        <span
          className={styles.iconWrap}
          style={{ background: iconBg }}
          aria-hidden
        >
          <AdIcon icon={icon} source="lucide" size={24} />
        </span>
        <h2 className={styles.name}>{name}</h2>
        {description ? (
          <p className={styles.description}>{description}</p>
        ) : null}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.actionBtn}
          aria-label="Search messages"
          onClick={onSearch}
        >
          <AdIcon icon={faMagnifyingGlass} size={14} />
        </button>
        <button
          type="button"
          className={styles.actionBtn}
          aria-label={`Edit ${name}`}
          onClick={onEdit}
        >
          <AdIcon icon={faPen} size={14} />
        </button>
        <button
          type="button"
          className={styles.actionBtn}
          data-active={notificationEnabled || undefined}
          aria-label={
            notificationEnabled
              ? 'Disable notifications'
              : 'Enable notifications'
          }
          aria-pressed={notificationEnabled}
          onClick={onToggleNotification}
        >
          <AdIcon icon={faBell} size={14} />
        </button>
      </div>
    </header>
  );
};

export default Header;
