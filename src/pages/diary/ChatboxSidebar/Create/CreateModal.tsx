import type { FC } from 'react';

import DiaryFormModal, { type DiaryFormModalState } from './DiaryFormModal';

/** @deprecated Use DiaryFormModal with full state instead */
export type CreateModalMode = 'chatbox' | 'group' | null;

export type CreateModalProps = {
  mode: CreateModalMode;
  onClose: () => void;
};

const CreateModal: FC<CreateModalProps> = ({ mode, onClose }) => {
  const state: DiaryFormModalState =
    mode === 'chatbox'
      ? { action: 'create', entity: 'chatbox' }
      : mode === 'group'
        ? { action: 'create', entity: 'group' }
        : null;

  return <DiaryFormModal state={state} onClose={onClose} />;
};

export default CreateModal;
