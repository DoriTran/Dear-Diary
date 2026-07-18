import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { FC, ReactNode } from 'react';

import { AdIcon } from '@/packages/base';

import styles from './SettingCard.module.css';

export type SettingCardProps = {
  /** Anchor id used for search navigation / scroll-into-view. */
  id?: string;
  title: string;
  description?: string;
  icon?: IconDefinition;
  headerAction?: ReactNode;
  children: ReactNode;
};

const SettingCard: FC<SettingCardProps> = ({
  id,
  title,
  description,
  icon,
  headerAction,
  children,
}) => {
  return (
    <section className={styles.card} id={id}>
      <header className={styles.header}>
        <div className={styles.headerMain}>
          {icon ? (
            <span className={styles.iconTile} aria-hidden>
              <AdIcon icon={icon} size={22} />
            </span>
          ) : null}
          <div className={styles.headings}>
            <h3 className={styles.title}>{title}</h3>
            {description ? (
              <p className={styles.description}>{description}</p>
            ) : null}
          </div>
        </div>
        {headerAction ? (
          <div className={styles.headerAction}>{headerAction}</div>
        ) : null}
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  );
};

export default SettingCard;
