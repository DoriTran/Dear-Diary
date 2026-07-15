import { useState, type FC } from 'react';

import type { WorkspaceType } from '@/store/workspace/type';

import LayoutCard from '@/packages/ui/LayoutCard/LayoutCard';
import InfoCallout from '@/pages/diary/DetailPanel/components/InfoCallout';
import { useWorkspaceStore } from '@/store';

import { useWorkspacePageData } from '../.hooks/useWorkspacePageData';
import ByToolSection from './ByToolSection/ByToolSection';
import CreateWorkspaceModal from './CreateWorkspaceModal/CreateWorkspaceModal';
import ExplorerHeader from './ExplorerHeader/ExplorerHeader';
import QuickAccess from './QuickAccess/QuickAccess';
import styles from './WorkspaceExplorer.module.css';

const WorkspaceExplorer: FC = () => {
  const selectWorkspace = useWorkspaceStore('selectWorkspace');
  const { ui, groupedWorkspaces, quickAccessWorkspaces } =
    useWorkspacePageData();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createType, setCreateType] = useState<WorkspaceType>('custom');

  const handleCreate = (type: WorkspaceType) => {
    setCreateType(type);
    setCreateModalOpen(true);
  };

  return (
    <>
      <LayoutCard
        tag="aside"
        className={styles.root}
        aria-label="Workspace explorer"
        data-module="workspace"
      >
        <ExplorerHeader />

        <div className={styles.scroll}>
          <QuickAccess
            workspaces={quickAccessWorkspaces}
            selectedWorkspaceId={ui.selectedWorkspaceId}
            onSelect={selectWorkspace}
          />

          <section className={styles.byTool}>
            <h2 className={styles.sectionHeading}>By Tool</h2>
            {groupedWorkspaces.map((group) => (
              <ByToolSection
                key={group.type}
                type={group.type}
                label={group.label}
                workspaces={group.workspaces}
                selectedWorkspaceId={ui.selectedWorkspaceId}
                viewMode={ui.explorerView}
                onSelect={selectWorkspace}
                onCreate={handleCreate}
              />
            ))}
          </section>

          <InfoCallout>
            Workspaces help you organize data from multiple diary sources into
            tool-specific views. Each workspace is a tool instance with its own
            records and specialized UI.
          </InfoCallout>
        </div>
      </LayoutCard>

      <CreateWorkspaceModal
        opened={createModalOpen}
        initialType={createType}
        onClose={() => setCreateModalOpen(false)}
      />
    </>
  );
};

export default WorkspaceExplorer;
