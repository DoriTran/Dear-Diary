import { useState, type FC, type FormEvent } from 'react';

import {
  AdColorPicker,
  AdEmojiIconPicker,
  AdModal,
  AdSelect,
} from '@/packages/base';
import { useWorkspaceStore } from '@/store';
import type { WorkspaceType } from '@/store/workspace/type';

import { WORKSPACE_TYPE_LABELS } from '../../workspace.utils';
import styles from './CreateWorkspaceModal.module.css';

const COLOR_SWATCHES = [
  '#A78BFA',
  '#86EFAC',
  '#FBCFE8',
  '#93C5FD',
  '#FDE68A',
  '#FDBA74',
];

const TYPE_OPTIONS = (
  Object.entries(WORKSPACE_TYPE_LABELS) as [WorkspaceType, string][]
).map(([value, label]) => ({ value, label }));

export type CreateWorkspaceModalProps = {
  opened: boolean;
  initialType?: WorkspaceType;
  onClose: () => void;
};

const CreateWorkspaceModal: FC<CreateWorkspaceModalProps> = ({
  opened,
  initialType = 'custom',
  onClose,
}) => {
  const createWorkspace = useWorkspaceStore('createWorkspace');
  const selectWorkspace = useWorkspaceStore('selectWorkspace');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<WorkspaceType>(initialType);
  const [icon, setIcon] = useState('📁');
  const [color, setColor] = useState(COLOR_SWATCHES[0]);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  const handleClose = () => {
    setName('');
    setDescription('');
    setType(initialType);
    setIcon('📁');
    setColor(COLOR_SWATCHES[0]);
    onClose();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const workspaceId = createWorkspace({
      name: trimmedName,
      description: description.trim(),
      type,
      icon,
      color,
    });

    selectWorkspace(workspaceId);
    handleClose();
  };

  return (
    <AdModal
      opened={opened}
      onClose={handleClose}
      title="Create Workspace"
      size="md"
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="My workspace"
            autoFocus
          />
        </label>

        <label className={styles.field}>
          <span>Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What is this workspace for?"
            rows={3}
          />
        </label>

        <label className={styles.field}>
          <span>Tool Type</span>
          <AdSelect
            value={type}
            onChange={(value) => {
              if (value) {
                setType(value as WorkspaceType);
              }
            }}
            data={TYPE_OPTIONS}
          />
        </label>

        <div className={styles.pickers}>
          <label className={styles.field}>
            <span>Icon</span>
            <AdEmojiIconPicker
              opened={iconPickerOpen}
              onChange={setIconPickerOpen}
              onSelect={setIcon}
              anchor={
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => setIconPickerOpen((value) => !value)}
                >
                  {icon}
                </button>
              }
            />
          </label>

          <label className={styles.field}>
            <span>Color</span>
            <AdColorPicker
              value={color}
              onChange={setColor}
              swatches={COLOR_SWATCHES}
            />
          </label>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.secondary} onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className={styles.primary}>
            Create
          </button>
        </div>
      </form>
    </AdModal>
  );
};

export default CreateWorkspaceModal;
