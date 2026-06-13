import { useMemo, useState, type FC, type FormEvent } from 'react';

import { AdColorPicker, AdIconPicker, AdSelect } from '@/packages/base';
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

export type CreateChatboxFormProps = {
  chatboxId?: string;
  onCancel: () => void;
  onSaved: () => void;
};

const CreateChatboxForm: FC<CreateChatboxFormProps> = ({
  chatboxId,
  onCancel,
  onSaved,
}) => {
  const isEdit = Boolean(chatboxId);
  const createChatbox = useDiaryStore('createChatbox');
  const updateChatbox = useDiaryStore('updateChatbox');
  const moveChatboxToGroup = useDiaryStore('moveChatboxToGroup');
  const createTag = useDiaryStore('createTag');
  const selectChatbox = useAppStore('selectChatbox');
  const groups = useDiaryStore('groups');
  const tags = useDiaryStore('tags');
  const chatboxes = useDiaryStore('chatboxes');
  const rootOrders = useDiaryStore('orders').rootOrders;

  const existing = chatboxId ? chatboxes[chatboxId] : null;

  const groupOptions = useMemo(
    () =>
      rootOrders
        .map((id) => groups[id])
        .filter((group): group is NonNullable<typeof group> => Boolean(group)),
    [groups, rootOrders],
  );

  const [name, setName] = useState(existing?.name ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [icon, setIcon] = useState<CreateIconKey>(
    resolveIconKey(existing?.icon ?? CREATE_ICON_KEYS[0]),
  );
  const [color, setColor] = useState<string>(
    existing?.color ?? CREATE_COLOR_SWATCHES[0],
  );
  const [groupId, setGroupId] = useState(existing?.groupId ?? '');
  const [tagIds, setTagIds] = useState<string[]>(
    existing?.tags.map((stat) => stat.tagId) ?? [],
  );

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

    if (isEdit && chatboxId && existing) {
      const countByTagId = new Map(
        existing.tags.map((stat) => [stat.tagId, stat.count]),
      );
      const nextTags = tagIds.map((tagId) => ({
        tagId,
        count: countByTagId.get(tagId) ?? 0,
      }));

      updateChatbox(chatboxId, {
        name: trimmedName,
        description: description.trim(),
        icon,
        color,
        tags: nextTags,
      });

      const nextGroupId = groupId || null;

      if (nextGroupId !== existing.groupId) {
        moveChatboxToGroup(chatboxId, nextGroupId);
      }

      onSaved();
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
    onSaved();
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

      <AdIconPicker
        value={icon}
        onChange={(value) => setIcon(value as CreateIconKey)}
      />
      <AdColorPicker value={color} onChange={setColor} />

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
          const existingTag = Object.values(tags).find(
            (tag) => tag.label.toLowerCase() === label.toLowerCase(),
          );

          if (existingTag) {
            setTagIds((prev) =>
              prev.includes(existingTag.id) ? prev : [...prev, existingTag.id],
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
          {isEdit ? 'Save' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default CreateChatboxForm;
