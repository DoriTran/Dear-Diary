import type { FC } from 'react';

import type { DetailPanelData } from '../../types';

import styles from './PinnedSection.module.css';

export type PinnedSectionProps = {
  data: DetailPanelData;
};

const PinnedSection: FC<PinnedSectionProps> = ({ data }) => {
  const hasContent = data.pinnedTodos.length > 0 || data.pinnedLinks.length > 0;

  return (
    <section id="detail-pinned" className={styles.root}>
      <h3 className={styles.heading}>Pinned ({data.pinnedTotal})</h3>
      {data.pinnedTodos.length > 0 ? (
        <ul className={styles.todoList}>
          {data.pinnedTodos.map((todo) => (
            <li key={todo.id} className={styles.todoItem}>
              <label className={styles.todoLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  defaultChecked={todo.checked}
                  readOnly
                />
                <span
                  className={styles.todoText}
                  data-checked={todo.checked || undefined}
                >
                  {todo.text}
                </span>
              </label>
              {todo.date ? (
                <time className={styles.todoDate}>{todo.date}</time>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
      {data.pinnedLinks.map((link) => (
        <article key={link.id} className={styles.linkCard}>
          {link.thumbnail ? (
            <div
              className={styles.thumb}
              style={{ backgroundImage: `url(${link.thumbnail})` }}
              aria-hidden
            />
          ) : null}
          <div className={styles.linkBody}>
            <h4 className={styles.linkTitle}>{link.title}</h4>
            <p className={styles.linkUrl}>{link.url}</p>
            {link.reaction ? (
              <span className={styles.reaction}>
                {link.reaction.emoji} {link.reaction.count}
              </span>
            ) : null}
          </div>
        </article>
      ))}
      {hasContent && data.pinnedTotal > 0 ? (
        <button type="button" className={styles.viewAll}>
          View all pinned ({data.pinnedTotal})
        </button>
      ) : null}
    </section>
  );
};

export default PinnedSection;
