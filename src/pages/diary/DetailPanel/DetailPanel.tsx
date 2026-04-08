import type { FC, ReactNode } from 'react';

import clsx from 'clsx';

import bodyBg from '@/assets/pages/diary/body-right-sidebar.png';
import headerBg from '@/assets/pages/diary/header-right-sidebar.png';

import styles from './DetailPanel.module.css';

export type DetailPanelProps = {
  className?: string;
  title?: string;
  description?: string;
  inputValue?: string;
  setInputValue?: (value: string) => void;
  children?: ReactNode;
  notchesCount?: number;
};

const DetailPanel: FC<DetailPanelProps> = ({
  className,
  title = 'Study',
  description = "I'm going to learn Japanese today!",
  inputValue,
  setInputValue,
  children,
}) => {
  return (
    <aside className={clsx(styles.container, className)}>
      <div
        className={styles.header}
        style={{ backgroundImage: `url(${headerBg})` }}
      >
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
        <input
          type="text"
          className={styles.input}
          value={inputValue}
          onChange={(e) => setInputValue?.(e.target.value)}
        />
      </div>
      <div
        className={styles.body}
        style={{ backgroundImage: `url(${bodyBg})` }}
      >
        <div className={styles.bodyContent}>{children}</div>
      </div>
    </aside>
  );
};

export default DetailPanel;
