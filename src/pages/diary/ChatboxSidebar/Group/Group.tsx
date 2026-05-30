import { faEllipsis, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { useId, type FC } from 'react';

import { AdIcon } from '@/packages/base';
import { BrushHighlight } from '@/packages/ui';
import LayoutCard from '@/packages/ui/LayoutCard/LayoutCard';

import type { GroupData } from '../../types';

import Chatbox from '../Chatbox/Chatbox';
import styles from './Group.module.css';
import { GROUP_BRUSH_SIZE } from './group.utils';

export type GroupProps = {
  data: GroupData;
  selectedId?: string;
  onSelect?: (id: string) => void;
};

const Group: FC<GroupProps> = ({ data, selectedId, onSelect }) => {
  const titleId = useId();
  const { title, brushColor, groupIcon, chatboxes } = data;

  return (
    <section className={styles.root} aria-labelledby={titleId}>
      <header className={styles.header}>
        <BrushHighlight
          color={brushColor}
          height={GROUP_BRUSH_SIZE}
          shadow
          paintOpacity={0.95}
          className={styles.brush}
          spacing={{ left: 12, right: 30 }}
          id={titleId}
        >
          <div className={styles.brushInner}>
            <span className={styles.grip} aria-hidden>
              <AdIcon icon={faGripVertical} size={12} />
            </span>
            <span className={styles.groupIcon} aria-hidden>
              <AdIcon icon={groupIcon} size={14} />
            </span>
            <span className={styles.titleText}>{title}</span>
          </div>
        </BrushHighlight>
        <LayoutCard className={styles.countCard}>
          <span className={styles.count}>{chatboxes.length}</span>
        </LayoutCard>
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
          <Chatbox
            key={chatbox.id}
            data={chatbox}
            selected={chatbox.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
};

export default Group;
