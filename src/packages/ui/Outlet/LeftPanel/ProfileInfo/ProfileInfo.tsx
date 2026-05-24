import type { FC } from 'react';

import {
  faBell,
  faChevronLeft,
  faChevronRight,
  faComment,
  faHardDrive,
} from '@fortawesome/free-solid-svg-icons';
import { Progress } from '@mantine/core';
import clsx from 'clsx';

import logoImg from '@/assets/logo/logo_img.png';
import { AdDivider, AdIcon } from '@/packages/base';

import styles from './ProfileInfo.module.css';

type ProfileInfoProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
};

const STORAGE_USED_GB = 1.2;
const STORAGE_TOTAL_GB = 5;
const MESSAGE_COUNT = 12_482;
const REMINDER_COUNT = 3;

const formatCount = (value: number) => value.toLocaleString('en-US');

const formatCompactCount = (value: number) => {
  if (value >= 1000) {
    const compact = Math.floor(value / 100) / 10;
    return `${compact}k`;
  }

  return String(value);
};

const ProfileInfo: FC<ProfileInfoProps> = ({ collapsed, onToggleCollapse }) => {
  const storagePercent = (STORAGE_USED_GB / STORAGE_TOTAL_GB) * 100;

  return (
    <footer className={clsx(styles.profileInfo, collapsed && styles.collapsed)}>
      <button
        aria-label={collapsed ? 'Expand profile' : 'Collapse profile'}
        className={styles.foldBtn}
        onClick={onToggleCollapse}
        type="button"
      >
        <AdIcon icon={collapsed ? faChevronRight : faChevronLeft} size={12} />
      </button>

      <div className={styles.header}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>
            <img alt="" height={40} src={logoImg} width={40} />
          </div>
          {collapsed && (
            <span className={styles.messageBadge}>
              {formatCompactCount(MESSAGE_COUNT)}
            </span>
          )}
        </div>

        {!collapsed && (
          <div className={styles.identity}>
            <p className={styles.name}>Alice</p>
            <p className={styles.email}>alice.notes@deardiary.app</p>
          </div>
        )}
      </div>

      {!collapsed && (
        <>
          <AdDivider className={styles.divider} />

          <div className={styles.stats}>
            <div className={clsx(styles.statRow, styles.statRowStorage)}>
              <div className={clsx(styles.statIcon, styles.statIconPurple)}>
                <AdIcon icon={faHardDrive} size={13} />
              </div>
              <span className={styles.statLabel}>Storage</span>
              <Progress
                className={styles.storageProgress}
                classNames={{ section: styles.storageProgressTrack }}
                color="var(--accent-purple)"
                radius="xl"
                size="sm"
                value={storagePercent}
              />
              <span className={styles.statValue}>
                {STORAGE_USED_GB} GB / {STORAGE_TOTAL_GB} GB
              </span>
            </div>

            <AdDivider className={styles.statDivider} />

            <div className={styles.statRow}>
              <div className={clsx(styles.statIcon, styles.statIconPink)}>
                <AdIcon icon={faComment} size={13} />
              </div>
              <span className={styles.statLabel}>Messages</span>
              <span className={clsx(styles.statValue, styles.statValuePink)}>
                {formatCount(MESSAGE_COUNT)}
              </span>
            </div>

            <AdDivider className={styles.statDivider} />

            <div className={styles.statRow}>
              <div className={clsx(styles.statIcon, styles.statIconYellow)}>
                <AdIcon icon={faBell} size={13} />
              </div>
              <span className={styles.statLabel}>Reminders</span>
              <span className={clsx(styles.statValue, styles.statValueYellow)}>
                {REMINDER_COUNT} pending
              </span>
            </div>
          </div>
        </>
      )}

      {collapsed && <AdDivider className={styles.collapsedDivider} />}
    </footer>
  );
};

export default ProfileInfo;
