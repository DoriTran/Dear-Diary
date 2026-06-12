import type { FC } from 'react';

import { AdModal } from '@/packages/base';

import CreateChatboxForm from './CreateChatboxForm';
import CreateGroupForm from './CreateGroupForm';

export type CreateModalMode = 'chatbox' | 'group' | null;

export type CreateModalProps = {
  mode: CreateModalMode;
  onClose: () => void;
};

const CreateModal: FC<CreateModalProps> = ({ mode, onClose }) => {
  const title =
    mode === 'chatbox'
      ? 'Start new chatbox'
      : mode === 'group'
        ? 'Create new group'
        : '';

  return (
    <AdModal opened={mode !== null} onClose={onClose} title={title} size="md">
      {mode === 'chatbox' ? (
        <CreateChatboxForm onCancel={onClose} onCreated={onClose} />
      ) : null}
      {mode === 'group' ? (
        <CreateGroupForm onCancel={onClose} onCreated={onClose} />
      ) : null}
    </AdModal>
  );
};

export default CreateModal;
