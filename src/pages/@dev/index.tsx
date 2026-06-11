import { type FC, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import styles from './index.module.css';
import { devTests, resolveActiveDevTest } from './registry';

const Dev: FC = () => {
  const [searchParams] = useSearchParams();
  const testParam = searchParams.get('test');
  const idParam = searchParams.get('id');

  const active = useMemo(
    () => resolveActiveDevTest({ test: testParam, id: idParam }),
    [testParam, idParam],
  );

  const hasSelection = Boolean(testParam || idParam);
  const ActiveComponent = active?.component;

  return (
    <div className={styles.root}>
      <aside className={styles.sidebar}>
        <header className={styles.header}>
          <h1 className={styles.title}>Dev</h1>
          <p className={styles.subtitle}>Component tests</p>
        </header>
        <ul className={styles.navList}>
          {devTests.map((entry, index) => {
            const id = index + 1;
            return (
              <li key={entry.key}>
                <Link
                  className={styles.navLink}
                  data-active={active?.key === entry.key || undefined}
                  to={{ pathname: '/dev', search: `?id=${id}` }}
                  title={`/dev?id=${id} · /dev?test=${entry.key}`}
                >
                  <span className={styles.navIndex}>#{id}</span>
                  <span className={styles.navName}>{entry.displayName}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      <main className={styles.main}>
        {ActiveComponent ? (
          <div className={styles.testPanel}>
            <ActiveComponent />
          </div>
        ) : hasSelection ? (
          <div className={styles.unknown}>
            <p>Unknown test.</p>
            <p>
              Use <code>?test=dragdropsortable</code> or <code>?id=1</code>.
            </p>
            <Link to="/dev">Back to dev hub</Link>
          </div>
        ) : (
          <div className={styles.empty}>
            <h2>Pick a test</h2>
            <p>Select one from the sidebar, for example:</p>
            <ul>
              <li>
                <code>/dev?id=1</code> — dragdropsortable (useScrollOffset)
              </li>
              <li>
                <code>/dev?id=2</code> — BrushHighlight
              </li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dev;
