import type { FC } from 'react';

import { AdChip } from '@/packages/base';
import { useDiaryStore } from '@/store';

export type MessageTagRowProps = {
  tagIds: string[];
};

const MessageTagRow: FC<MessageTagRowProps> = ({ tagIds }) => {
  const tags = useDiaryStore('tags');

  if (tagIds.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.25rem',
        marginTop: '0.35rem',
      }}
    >
      {tagIds.map((tagId) => {
        const tag = tags[tagId];

        if (!tag) {
          return null;
        }

        return (
          <AdChip
            key={tagId}
            label={tag.label}
            colorId={tag.colorId}
            size="small"
          />
        );
      })}
    </div>
  );
};

export default MessageTagRow;
