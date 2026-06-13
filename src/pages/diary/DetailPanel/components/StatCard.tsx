import type { FC, ReactNode } from 'react';

import styles from './StatCard.module.css';

export type StatCardProps = {
  label: string;
  value: string | number;
  icon?: ReactNode;
};

const StatCard: FC<StatCardProps> = ({ label, value, icon }) => {
  return (
    <article className={styles.root}>
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </article>
  );
};

export default StatCard;
