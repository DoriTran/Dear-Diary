import { useState, type FC, type FormEvent } from 'react';

import { AdColorPicker, AdIconPicker } from '@/packages/base';
import { useAppStore, useDiaryStore } from '@/store';

import {
  CREATE_COLOR_SWATCHES,
  CREATE_ICON_KEYS,
  type CreateIconKey,
} from './create.constants';
import formStyles from './CreateForm.module.css';

const resolveIconKey = (icon: string): CreateIconKey => {
  if ((CREATE_ICON_KEYS as readonly string[]).includes(icon)) {
    return icon as CreateIconKey;
  }

  return CREATE_ICON_KEYS[0];
};

export type CreateGroupFormProps = {
  groupId?: string;
  onCancel: () => void;
  onSaved: () => void;
};

const CreateGroupForm: FC<CreateGroupFormProps> = ({
  groupId,
  onCancel,
  onSaved,
}) => {
  const isEdit = Boolean(groupId);
  const createGroup = useDiaryStore('createGroup');
  const updateGroup = useDiaryStore('updateGroup');
  const expandGroup = useAppStore('expandGroup');
  const groups = useDiaryStore('groups');

  const existing = groupId ? groups[groupId] : null;

  const [name, setName] = useState(existing?.name ?? '');
  const [icon, setIcon] = useState<CreateIconKey>(
    resolveIconKey(existing?.icon ?? CREATE_ICON_KEYS[0]),
  );
  const [color, setColor] = useState<string>(
    existing?.color ?? CREATE_COLOR_SWATCHES[0],
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    if (isEdit && groupId) {
      updateGroup(groupId, {
        name: trimmedName,
        icon,
        color,
      });
      onSaved();
      return;
    }

    const newId = createGroup({
      name: trimmedName,
      icon,
      color,
    });

    expandGroup(newId);
    onSaved();
  };

  return (
    <form className={formStyles.form} onSubmit={handleSubmit}>
      <div className={formStyles.field}>
        <label className={formStyles.label} htmlFor="create-group-name">
          Name
        </label>
        <input
          id="create-group-name"
          className={formStyles.input}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="My group"
          required
        />
      </div>

      <AdIconPicker
        value={icon}
        onChange={(value) => setIcon(value as CreateIconKey)}
      />
      <AdColorPicker value={color} onChange={setColor} />

      <div className={formStyles.actions}>
        <button
          type="button"
          className={formStyles.btnSecondary}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={formStyles.btnPrimary}
          disabled={!name.trim()}
        >
          {isEdit ? 'Save' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default CreateGroupForm;
