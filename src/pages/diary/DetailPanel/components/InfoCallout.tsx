import type { FC, ReactNode } from 'react';

import styles from './InfoCallout.module.css';

export type InfoCalloutProps = {
  children: ReactNode;
};

const InfoCallout: FC<InfoCalloutProps> = ({ children }) => {
  return <p className={styles.root}>{children}</p>;
};

export default InfoCallout;
