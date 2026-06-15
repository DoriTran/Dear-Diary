import type { FC } from 'react';

import {
  faGrip,
  faList,
  faThLarge,
} from '@fortawesome/free-solid-svg-icons';

import { AdActionButton } from '@/packages/base';
import { useWorkspaceStore } from '@/store';

import styles from './ExplorerHeader.module.css';

const ExplorerHeader: FC = () => {
  const explorerView = useWorkspaceStore('ui').explorerView;
  const setExplorerView = useWorkspaceStore('setExplorerView');

  return (
    <header className={styles.root}>
      <div className={styles.copy}>
        <h1 className={styles.title}>Workspace Home</h1>
        <p className={styles.subtitle}>
          Discover tools and jump back into recent workspaces.
        </p>
      </div>

      <div className={styles.viewToggle} role="group" aria-label="View mode">
        <AdActionButton
          icon={faThLarge}
          label="Grid view"
          active={explorerView === 'grid'}
          onClick={() => setExplorerView('grid')}
        />
        <AdActionButton
          icon={faList}
          label="List view"
          active={explorerView === 'list'}
          onClick={() => setExplorerView('list')}
        />
        <AdActionButton icon={faGrip} label="Reorder" onClick={() => undefined} />
      </div>
    </header>
  );
};

export default ExplorerHeader;
