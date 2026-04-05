import { useId, type ReactNode } from 'react';

import { BrushHighlight } from '@/packages/ui';

import styles from './NotebookGroup.module.css';

export type NotebookGroupProps = {
  title: string;
  children: ReactNode;
  /** Peach / light orange brush behind the title */
  brushColor?: string;
  brushSize?: number;
};

const NotebookGroup = ({
  title,
  children,
  brushColor = '#ffc9a3',
  brushSize = 24,
}: NotebookGroupProps) => {
  const titleId = useId();

  return (
    <section className={styles.root} aria-labelledby={titleId}>
      <div className={styles.header}>
        <BrushHighlight
          color={brushColor}
          size={brushSize}
          brushes={1}
          className={styles.brush}
          id={titleId}
        >
          <span className={styles.titleText}>{title}</span>
        </BrushHighlight>
      </div>
      <div className={styles.body}>{children}</div>
    </section>
  );
};

export default NotebookGroup;
