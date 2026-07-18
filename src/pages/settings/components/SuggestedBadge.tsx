import type { FC } from 'react';

import { AdTooltip } from '@/packages/base';

import styles from './SuggestedBadge.module.css';

const SuggestedBadge: FC = () => {
  return (
    <AdTooltip label="Suggested — not available yet. Shown as a preview of what's coming.">
      <span className={styles.badge}>* suggested</span>
    </AdTooltip>
  );
};

export default SuggestedBadge;
