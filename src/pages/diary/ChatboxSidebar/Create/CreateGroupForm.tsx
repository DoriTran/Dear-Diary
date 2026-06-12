import { useState, type FC, type FormEvent } from 'react';

import { useAppStore, useDiaryStore } from '@/store';

import ColorPicker from './ColorPicker';
import {
  CREATE_COLOR_SWATCHES,
  CREATE_ICON_KEYS,
  type CreateIconKey,
} from './create.constants';
import formStyles from './CreateForm.module.css';
import IconPicker from './IconPicker';

export type CreateGroupFormProps = {
  onCancel: () => void;
  onCreated: () => void;
};

const CreateGroupForm: FC<CreateGroupFormProps> = ({ onCancel, onCreated }) => {
  const createGroup = useDiaryStore('createGroup');
  const expandGroup = useAppStore('expandGroup');

  const [name, setName] = useState('');
  const [icon, setIcon] = useState<CreateIconKey>(CREATE_ICON_KEYS[0]);
  const [color, setColor] = useState<string>(CREATE_COLOR_SWATCHES[0]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const newId = createGroup({
      name: trimmedName,
      icon,
      color,
    });

    expandGroup(newId);
    onCreated();
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

      <IconPicker value={icon} onChange={setIcon} />
      <ColorPicker value={color} onChange={setColor} />

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
          Create
        </button>
      </div>
    </form>
  );
};

export default CreateGroupForm;
