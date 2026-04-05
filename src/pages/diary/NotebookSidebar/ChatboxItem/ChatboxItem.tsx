import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import {
  faGraduationCap,
  faGripLinesVertical,
} from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { useState } from 'react';

import { AdIcon } from '@/packages/base';
import { NotchedCard } from '@/packages/ui';

import styles from './ChatboxItem.module.css';

export type ChatboxItemProps = {
  title: string;
  subtitle: string;
  count: number | string;
  selected?: boolean;
  icon?: IconDefinition;
  onClick?: () => void;
};

const ChatboxItem = ({
  title,
  subtitle,
  count,
  selected = false,
  icon = faGraduationCap,
  onClick,
}: ChatboxItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <NotchedCard
      className={styles.root}
      selected={selected}
      onSelect={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        className={clsx(styles.configBtn, isHovered && styles.configBtnHovered)}
      >
        <AdIcon
          icon={faGripLinesVertical}
          size="20px"
          color="var(--primary-dark)"
        />
      </button>
      <span className={styles.iconWrap} aria-hidden>
        <AdIcon icon={icon} size="20px" color="var(--primary-dark)" />
      </span>
      <span className={styles.body}>
        <span className={styles.itemTitle}>{title}</span>
        <span className={styles.subtitle}>{subtitle}</span>
      </span>
      <span className={styles.count}>{count}</span>
    </NotchedCard>
  );
};

export default ChatboxItem;
