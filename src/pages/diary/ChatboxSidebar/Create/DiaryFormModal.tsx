import type { FC } from 'react';

import { AdModal } from '@/packages/base';

import CreateChatboxForm from './CreateChatboxForm';
import CreateGroupForm from './CreateGroupForm';

export type DiaryFormModalState =
  | { action: 'create'; entity: 'chatbox' | 'group' }
  | { action: 'edit'; entity: 'chatbox' | 'group'; id: string }
  | null;

export type DiaryFormModalProps = {
  state: DiaryFormModalState;
  onClose: () => void;
};

const getTitle = (state: NonNullable<DiaryFormModalState>): string => {
  if (state.action === 'create') {
    return state.entity === 'chatbox'
      ? 'Start new chatbox'
      : 'Create new group';
  }

  return state.entity === 'chatbox' ? 'Edit chatbox' : 'Edit group';
};

const DiaryFormModal: FC<DiaryFormModalProps> = ({ state, onClose }) => {
  if (!state) {
    return null;
  }

  const title = getTitle(state);
  const isEdit = state.action === 'edit';

  return (
    <AdModal opened onClose={onClose} title={title} size="md">
      {state.entity === 'chatbox' ? (
        <CreateChatboxForm
          chatboxId={isEdit ? state.id : undefined}
          onCancel={onClose}
          onSaved={onClose}
        />
      ) : (
        <CreateGroupForm
          groupId={isEdit ? state.id : undefined}
          onCancel={onClose}
          onSaved={onClose}
        />
      )}
    </AdModal>
  );
};

export default DiaryFormModal;
