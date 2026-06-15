import type { FC } from 'react';

import styles from './SourceLegend.module.css';

export type SourceLegendProps = {
  items: { label: string; color: string }[];
};

const SourceLegend: FC<SourceLegendProps> = ({ items }) => {
  return (
    <div className={styles.root} aria-label="Source legend">
      {items.map((item) => (
        <span key={item.label} className={styles.item}>
          <span
            className={styles.dot}
            style={{ background: item.color }}
            aria-hidden
          />
          {item.label}
        </span>
      ))}
    </div>
  );
};

export default SourceLegend;
