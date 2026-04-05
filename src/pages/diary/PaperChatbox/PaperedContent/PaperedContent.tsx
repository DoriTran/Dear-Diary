import type { FC, ReactNode } from 'react';

import styles from './PaperedContent.module.css';

export type PaperedContentProps = {
  children?: ReactNode;
};

const PaperedContent: FC<PaperedContentProps> = ({
  children = 'Messages and notes will appear here.',
}) => {
  return (
    <section className={styles.root}>
      <p className={styles.placeholder}>{children}</p>
    </section>
  );
};

export default PaperedContent;
