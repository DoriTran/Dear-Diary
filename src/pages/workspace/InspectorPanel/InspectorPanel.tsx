import type { FC } from 'react';

import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { AdActionButton } from '@/packages/base';
import LayoutCard from '@/packages/ui/LayoutCard/LayoutCard';
import { useWorkspaceStore } from '@/store';

import { useWorkspacePageData } from '../.hooks/useWorkspacePageData';
import EventDetailsInspector from './EventDetailsInspector/EventDetailsInspector';
import styles from './InspectorPanel.module.css';

const InspectorPanel: FC = () => {
  const setInspectorOpen = useWorkspaceStore('setInspectorOpen');
  const { ui, selectedWorkspace, selectedRecord } = useWorkspacePageData();

  const showInspector =
    ui.inspectorOpen &&
    selectedWorkspace?.type === 'scheduler' &&
    selectedRecord;

  if (!showInspector) {
    return null;
  }

  return (
    <LayoutCard
      tag="aside"
      className={styles.root}
      aria-label="Event details"
      data-module="workspace"
    >
      <header className={styles.header}>
        <h2 className={styles.title}>Event Details</h2>
        <AdActionButton
          icon={faXmark}
          label="Close inspector"
          onClick={() => setInspectorOpen(false)}
        />
      </header>

      <div className={styles.body}>
        <EventDetailsInspector record={selectedRecord} />
      </div>
    </LayoutCard>
  );
};

export default InspectorPanel;
