import { faEllipsis, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { useId, type FC } from 'react';

import { AdIcon } from '@/packages/base';
import { BrushHighlight } from '@/packages/ui';
import LayoutCard from '@/packages/ui/LayoutCard/LayoutCard';

import type { GroupData } from '../../types';

import Chatbox from '../Chatbox/Chatbox';
import styles from './Group.module.css';
import { brushesForTitle, GROUP_BRUSH_SIZE } from './group.utils';

export type GroupProps = {
  data: GroupData;
};

const Group: FC<GroupProps> = ({ data }) => {
  const titleId = useId();
  const { title, brushColor, groupIcon, chatboxes } = data;
  const brushCount = brushesForTitle(title);

  return (
    <section className={styles.root} aria-labelledby={titleId}>
      <header className={styles.header}>
        <BrushHighlight
          color={brushColor}
          size={GROUP_BRUSH_SIZE}
          brushes={brushCount}
          className={styles.brush}
          id={titleId}
          style={{ cursor: 'default' }}
        >
          <div className={styles.brushInner}>
            <span className={styles.grip} aria-hidden>
              <AdIcon icon={faGripVertical} size={12} />
            </span>
            <span className={styles.groupIcon} aria-hidden>
              <AdIcon icon={groupIcon} size={14} />
            </span>
            <span className={styles.titleText}>{title}</span>
            <LayoutCard className={styles.countCard}>
              <span className={styles.count}>{chatboxes.length}</span>
            </LayoutCard>
          </div>
        </BrushHighlight>
      </header>
      <button
        className={styles.menuBtn}
        type="button"
        aria-label={`${title} group options`}
      >
        <AdIcon icon={faEllipsis} size={14} />
      </button>
      <div className={styles.list}>
        {chatboxes.map((chatbox) => (
          <Chatbox key={chatbox.id} data={chatbox} />
        ))}
      </div>
    </section>
  );
};

export default Group;
