import type { FC } from 'react';

import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

import { AdIcon } from '@/packages/base';

import styles from './SummarySection.module.css';

export type SummarySectionProps = {
  summary: string;
};

const SummarySection: FC<SummarySectionProps> = ({ summary }) => {
  return (
    <section id="detail-summary" className={styles.root}>
      <h3 className={styles.heading}>Summary (AI)</h3>
      <div className={styles.card}>
        <span className={styles.sparkle} aria-hidden>
          <AdIcon icon={faWandMagicSparkles} size={14} />
        </span>
        <p className={styles.text}>{summary}</p>
        <span className={styles.avatar} aria-hidden>
          🐱
        </span>
      </div>
    </section>
  );
};

export default SummarySection;
