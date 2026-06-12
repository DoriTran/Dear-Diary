import { useMemo, useState, type FC, type FormEvent } from 'react';

import { AdSelect } from '@/packages/base';
import { useAppStore, useDiaryStore } from '@/store';

import ColorPicker from './ColorPicker';
import {
  CREATE_COLOR_SWATCHES,
  CREATE_ICON_KEYS,
  type CreateIconKey,
} from './create.constants';
import formStyles from './CreateForm.module.css';
import IconPicker from './IconPicker';

export type CreateChatboxFormProps = {
  onCancel: () => void;
  onCreated: () => void;
};

const CreateChatboxForm: FC<CreateChatboxFormProps> = ({
  onCancel,
  onCreated,
}) => {
  const createChatbox = useDiaryStore('createChatbox');
  const createTag = useDiaryStore('createTag');
  const selectChatbox = useAppStore('selectChatbox');
  const groups = useDiaryStore('groups');
  const tags = useDiaryStore('tags');
  const rootOrders = useDiaryStore('orders').rootOrders;

  const groupOptions = useMemo(
    () =>
      rootOrders
        .map((id) => groups[id])
        .filter((group): group is NonNullable<typeof group> => Boolean(group)),
    [groups, rootOrders],
  );

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState<CreateIconKey>(CREATE_ICON_KEYS[0]);
  const [color, setColor] = useState<string>(CREATE_COLOR_SWATCHES[0]);
  const [groupId, setGroupId] = useState('');
  const [tagIds, setTagIds] = useState<string[]>([]);

  const tagOptions = useMemo(
    () =>
      Object.values(tags).map((tag) => ({
        value: tag.id,
        label: tag.label,
        color: tag.color,
      })),
    [tags],
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const newId = createChatbox({
      name: trimmedName,
      description: description.trim(),
      icon,
      color,
      groupId: groupId || null,
      tags: tagIds.map((tagId) => ({ tagId, count: 0 })),
    });

    selectChatbox(newId);
    onCreated();
  };

  return (
    <form className={formStyles.form} onSubmit={handleSubmit}>
      <div className={formStyles.field}>
        <label className={formStyles.label} htmlFor="create-chatbox-name">
          Name
        </label>
        <input
          id="create-chatbox-name"
          className={formStyles.input}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="My chatbox"
          required
        />
      </div>

      <div className={formStyles.field}>
        <label
          className={formStyles.label}
          htmlFor="create-chatbox-description"
        >
          Description
        </label>
        <textarea
          id="create-chatbox-description"
          className={formStyles.textarea}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What is this chatbox about?"
        />
      </div>

      <IconPicker value={icon} onChange={setIcon} />
      <ColorPicker value={color} onChange={setColor} />

      <AdSelect
        multiple
        label="Tags"
        placeholder="Search or create tags..."
        data={tagOptions}
        value={tagIds}
        onChange={setTagIds}
        searchable
        create
        emptyLabel="No tags found"
        onCreate={(label) => {
          const existing = Object.values(tags).find(
            (tag) => tag.label.toLowerCase() === label.toLowerCase(),
          );

          if (existing) {
            setTagIds((prev) =>
              prev.includes(existing.id) ? prev : [...prev, existing.id],
            );
            return;
          }

          const id = createTag({ label, color: CREATE_COLOR_SWATCHES[0] });
          setTagIds((prev) => [...prev, id]);
        }}
      />

      <div className={formStyles.field}>
        <label className={formStyles.label} htmlFor="create-chatbox-group">
          Group
        </label>
        <select
          id="create-chatbox-group"
          className={formStyles.select}
          value={groupId}
          onChange={(event) => setGroupId(event.target.value)}
        >
          <option value="">No group</option>
          {groupOptions.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

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

export default CreateChatboxForm;
