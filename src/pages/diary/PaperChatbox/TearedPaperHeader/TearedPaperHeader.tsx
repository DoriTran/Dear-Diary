import type { FC } from 'react';

import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';

import chatBgTeared from '@/assets/pages/diary/chat bg teared.png';
import { AdIcon } from '@/packages/base';

import styles from './TearedPaperHeader.module.css';

export type TearedPaperHeaderProps = {
  title?: string;
  subtitle?: string;
};

const TearedPaperHeader: FC<TearedPaperHeaderProps> = ({
  title = 'Study',
  subtitle = 'Update 2 hours ago',
}) => {
  return (
    <header
      className={styles.root}
      style={{ backgroundImage: `url(${chatBgTeared})` }}
    >
      <div className={styles.inner}>
        <div className={styles.iconWrap} aria-hidden>
          <AdIcon
            icon={faGraduationCap}
            size="40px"
            color="var(--primary-dark)"
          />
        </div>
        <div className={styles.text}>
          <span className={styles.title}>{title}</span>
          <span className={styles.subtitle}>{subtitle}</span>
        </div>
      </div>
    </header>
  );
};

export default TearedPaperHeader;
