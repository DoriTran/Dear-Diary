import { faListCheck, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { useState, type FC } from 'react';

import type {
  EnterKeyBehavior,
  TodoNewItemPosition,
} from '@/store/settings/type';

import { AdIcon, AdSegmentedControl, AdSwitch } from '@/packages/base';
import { useSettingsStore } from '@/store';
import { DEFAULT_PREFERENCES } from '@/store/settings/constants';

import { SettingRow } from '../components';
import styles from './DecorationTabs.module.css';

type VariantTab = 'todo';

const TABS: { id: VariantTab; label: string; icon: IconDefinition }[] = [
  { id: 'todo', label: 'Todo', icon: faListCheck },
];

const D = DEFAULT_PREFERENCES.decorations;

const VariantTabs: FC = () => {
  const preferences = useSettingsStore('preferences');
  const updatePreferences = useSettingsStore('updatePreferences');
  const [tab, setTab] = useState<VariantTab>('todo');

  const enterKeyBehavior = preferences.decorations.todo.enterKeyBehavior;

  // Todo (suggested — except enterKeyBehavior which is wired)
  const [todoPosition, setTodoPosition] = useState<TodoNewItemPosition>(
    D.todo.newItemPosition,
  );
  const [todoEnterNext, setTodoEnterNext] = useState(D.todo.enterCreatesNext);
  const [todoAnim, setTodoAnim] = useState(D.todo.completeAnimation);

  const setEnterKeyBehavior = (value: EnterKeyBehavior) => {
    updatePreferences({
      decorations: { todo: { enterKeyBehavior: value } },
    });
  };

  return (
    <div className={styles.root}>
      <div className={styles.tabs} role="tablist" aria-label="Variants">
        {TABS.map((entry) => (
          <button
            aria-selected={tab === entry.id}
            className={clsx(styles.tab, tab === entry.id && styles.tabActive)}
            key={entry.id}
            onClick={() => setTab(entry.id)}
            role="tab"
            type="button"
          >
            <AdIcon icon={entry.icon} size={13} />
            <span>{entry.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.panel}>
        {tab === 'todo' && (
          <>
            <SettingRow
              title="Enter Key Behavior"
              description="Choose what Enter does in the todo composer."
              stacked
              control={
                <AdSegmentedControl
                  aria-label="Todo enter key behavior"
                  fullWidth
                  onChange={setEnterKeyBehavior}
                  options={[
                    {
                      value: 'enter-sends',
                      label: 'Enter sends message',
                      description: 'Shift + Enter for new line',
                    },
                    {
                      value: 'shift-enter-sends',
                      label: 'Shift + Enter sends',
                      description: 'Enter for new line',
                    },
                  ]}
                  value={enterKeyBehavior}
                />
              }
            />
            <SettingRow
              title="New item position"
              description="Where newly created tasks are added."
              suggested
              control={
                <AdSegmentedControl
                  aria-label="New item position"
                  onChange={setTodoPosition}
                  options={[
                    { value: 'top', label: 'Top' },
                    { value: 'bottom', label: 'Bottom' },
                  ]}
                  value={todoPosition}
                />
              }
            />
            <SettingRow
              title="Enter creates next task"
              description="Pressing Enter adds another task row."
              suggested
              control={
                <AdSwitch
                  onSwitch={() => setTodoEnterNext((v) => !v)}
                  value={todoEnterNext}
                />
              }
            />
            <SettingRow
              title="Complete animation"
              description="Animate tasks when they are completed."
              suggested
              control={
                <AdSwitch
                  onSwitch={() => setTodoAnim((v) => !v)}
                  value={todoAnim}
                />
              }
            />
          </>
        )}
      </div>
    </div>
  );
};

export default VariantTabs;
