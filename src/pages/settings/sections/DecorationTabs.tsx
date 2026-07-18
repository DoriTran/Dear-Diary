import {
  faBell,
  faClock,
  faListCheck,
  faTicket,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { useState, type FC } from 'react';

import type {
  TicketCompletionAnimation,
  TicketUndoVisibility,
  TimerDefaultMode,
  TodoNewItemPosition,
} from '@/store/settings/type';

import { AdIcon, AdSegmentedControl, AdSwitch } from '@/packages/base';
import { DEFAULT_PREFERENCES } from '@/store/settings/constants';

import { SettingRow } from '../components';
import styles from './DecorationTabs.module.css';

type DecoratorTab = 'ticket' | 'timer' | 'todo' | 'reminder';

const TABS: { id: DecoratorTab; label: string; icon: IconDefinition }[] = [
  { id: 'ticket', label: 'Ticket', icon: faTicket },
  { id: 'timer', label: 'Timer', icon: faClock },
  { id: 'todo', label: 'Todo', icon: faListCheck },
  { id: 'reminder', label: 'Reminder', icon: faBell },
];

const D = DEFAULT_PREFERENCES.decorations;

const DecorationTabs: FC = () => {
  const [tab, setTab] = useState<DecoratorTab>('ticket');

  // Ticket (suggested)
  const [ticketAnim, setTicketAnim] = useState<TicketCompletionAnimation>(
    D.ticket.completionAnimation,
  );
  const [ticketUndo, setTicketUndo] = useState<TicketUndoVisibility>(
    D.ticket.undoVisibility,
  );
  const [ticketAsk, setTicketAsk] = useState(D.ticket.askBeforeCompleting);
  const [ticketCollapse, setTicketCollapse] = useState(
    D.ticket.autoCollapseCompleted,
  );

  // Timer (suggested)
  const [timerMode, setTimerMode] = useState<TimerDefaultMode>(
    D.timer.defaultMode,
  );
  const [timerSound, setTimerSound] = useState(D.timer.playSound);
  const [timerAutoStart, setTimerAutoStart] = useState(D.timer.autoStart);
  const [timerMs, setTimerMs] = useState(D.timer.showMilliseconds);

  // Todo (suggested)
  const [todoPosition, setTodoPosition] = useState<TodoNewItemPosition>(
    D.todo.newItemPosition,
  );
  const [todoEnterNext, setTodoEnterNext] = useState(D.todo.enterCreatesNext);
  const [todoAnim, setTodoAnim] = useState(D.todo.completeAnimation);

  return (
    <div className={styles.root}>
      <div className={styles.tabs} role="tablist" aria-label="Decorators">
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
        {tab === 'ticket' && (
          <>
            <SettingRow
              title="Completion animation"
              description="How a ticket animates when marked complete."
              suggested
              control={
                <AdSegmentedControl
                  aria-label="Completion animation"
                  onChange={setTicketAnim}
                  options={[
                    { value: 'tear', label: 'Tear' },
                    { value: 'fade', label: 'Fade' },
                    { value: 'none', label: 'None' },
                  ]}
                  value={ticketAnim}
                />
              }
            />
            <SettingRow
              title="Undo visibility"
              description="When the undo ghost appears after completion."
              suggested
              control={
                <AdSegmentedControl
                  aria-label="Undo visibility"
                  onChange={setTicketUndo}
                  options={[
                    { value: 'always', label: 'Always' },
                    { value: 'hover', label: 'On hover' },
                    { value: 'never', label: 'Never' },
                  ]}
                  value={ticketUndo}
                />
              }
            />
            <SettingRow
              title="Ask before completing"
              description="Show a confirmation before marking a ticket complete."
              suggested
              control={
                <AdSwitch
                  onSwitch={() => setTicketAsk((v) => !v)}
                  value={ticketAsk}
                />
              }
            />
            <SettingRow
              title="Auto collapse completed"
              description="Collapse tickets once they are completed."
              suggested
              control={
                <AdSwitch
                  onSwitch={() => setTicketCollapse((v) => !v)}
                  value={ticketCollapse}
                />
              }
            />
          </>
        )}

        {tab === 'timer' && (
          <>
            <SettingRow
              title="Default timer mode"
              description="Which mode new timers start in."
              suggested
              control={
                <AdSegmentedControl
                  aria-label="Default timer mode"
                  onChange={setTimerMode}
                  options={[
                    { value: 'timer', label: 'Countdown' },
                    { value: 'countup', label: 'Count up' },
                    { value: 'datetime', label: 'Datetime' },
                  ]}
                  value={timerMode}
                />
              }
            />
            <SettingRow
              title="Play sound"
              description="Play a sound when the timer finishes."
              suggested
              control={
                <AdSwitch
                  onSwitch={() => setTimerSound((v) => !v)}
                  value={timerSound}
                />
              }
            />
            <SettingRow
              title="Auto start"
              description="Start the timer as soon as it is created."
              suggested
              control={
                <AdSwitch
                  onSwitch={() => setTimerAutoStart((v) => !v)}
                  value={timerAutoStart}
                />
              }
            />
            <SettingRow
              title="Show milliseconds"
              description="Display milliseconds in timer readouts."
              suggested
              control={
                <AdSwitch
                  onSwitch={() => setTimerMs((v) => !v)}
                  value={timerMs}
                />
              }
            />
          </>
        )}

        {tab === 'todo' && (
          <>
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

        {tab === 'reminder' && (
          <div className={styles.comingSoon}>
            <AdIcon icon={faBell} size={22} />
            <p className={styles.comingSoonTitle}>Reminders are coming soon</p>
            <p className={styles.comingSoonText}>
              The reminder decorator is still on the drawing board. Its settings
              will appear here once it lands.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecorationTabs;
