import type { FC } from 'react';

import type { Attachment } from '@/store/diary/type';

import styles from './FallbackGroup.module.css';

export type FallbackGroupProps = {
  attachments: Attachment[];
  compact?: boolean;
};

/**
 * Render used for any attachment type without a dedicated renderer
 * (`file` today, plus any new type added later): just its file name +
 * extension, nothing else.
 */
const FallbackGroup: FC<FallbackGroupProps> = ({
  attachments,
  compact = false,
}) => (
  <div className={`${styles.list} ${compact ? styles.listCompact : ''}`}>
    {attachments.map((attachment) => {
      const url = 'url' in attachment ? attachment.url : undefined;
      const name = attachment.name ?? url?.split('/').pop() ?? 'file';

      return url ? (
        <a
          key={attachment.id}
          href={url}
          className={styles.item}
          target="_blank"
          rel="noreferrer"
        >
          {name}
        </a>
      ) : (
        <span key={attachment.id} className={styles.item}>
          {name}
        </span>
      );
    })}
  </div>
);

export default FallbackGroup;
