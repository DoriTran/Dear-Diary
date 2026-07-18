import {
  faPaperclip,
  faPen,
  faTicket,
} from '@fortawesome/free-solid-svg-icons';
import { useState, type FC } from 'react';

import type { EnterKeyBehavior } from '@/store/settings/type';

import { AdSegmentedControl, AdSwitch } from '@/packages/base';
import { useSettingsStore } from '@/store';
import { DEFAULT_PREFERENCES } from '@/store/settings/constants';

import { SettingCard, SettingRow } from '../components';
import DecorationTabs from './DecorationTabs';

const D = DEFAULT_PREFERENCES;

const ComposerSection: FC = () => {
  const preferences = useSettingsStore('preferences');
  const updatePreferences = useSettingsStore('updatePreferences');
  const enterKeyBehavior = preferences.composer.enterKeyBehavior;

  // Remaining composer behaviors are suggested (not implemented) — local state.
  const [autoFocus, setAutoFocus] = useState(D.composer.autoFocus);
  const [restoreDraft, setRestoreDraft] = useState(D.composer.restoreDraft);
  const [autoExpand, setAutoExpand] = useState(D.composer.autoExpand);
  const [spellCheck, setSpellCheck] = useState(D.composer.spellCheck);
  const [markdown, setMarkdown] = useState(D.composer.markdownShortcuts);
  const [smartQuotes, setSmartQuotes] = useState(D.composer.smartQuotes);
  const [pasteImages, setPasteImages] = useState(
    D.composer.pasteImagesDirectly,
  );

  const setEnterKeyBehavior = (value: EnterKeyBehavior) => {
    updatePreferences({ composer: { enterKeyBehavior: value } });
  };

  return (
    <>
      <SettingCard
        id="editor"
        icon={faPen}
        title="Editor"
        description="Customize how you write and send messages."
      >
        <SettingRow
          title="Enter Key Behavior"
          description="Choose what Enter does in the composer."
          stacked
          control={
            <AdSegmentedControl
              aria-label="Enter key behavior"
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
          title="Auto focus composer"
          description="Automatically focus the composer when opening a chat."
          suggested
          control={
            <AdSwitch
              onSwitch={() => setAutoFocus((v) => !v)}
              value={autoFocus}
            />
          }
        />
        <SettingRow
          title="Restore draft"
          description="Restore unfinished drafts when you reopen a chat."
          suggested
          control={
            <AdSwitch
              onSwitch={() => setRestoreDraft((v) => !v)}
              value={restoreDraft}
            />
          }
        />
        <SettingRow
          title="Auto expand composer"
          description="Grow the composer as you type."
          suggested
          control={
            <AdSwitch
              onSwitch={() => setAutoExpand((v) => !v)}
              value={autoExpand}
            />
          }
        />
        <SettingRow
          title="Spell check"
          description="Check spelling while typing."
          suggested
          control={
            <AdSwitch
              onSwitch={() => setSpellCheck((v) => !v)}
              value={spellCheck}
            />
          }
        />
        <SettingRow
          title="Markdown shortcuts"
          description="Enable markdown shortcuts while typing."
          suggested
          control={
            <AdSwitch
              onSwitch={() => setMarkdown((v) => !v)}
              value={markdown}
            />
          }
        />
        <SettingRow
          title="Smart quotes"
          description="Convert straight quotes to curly quotes."
          suggested
          control={
            <AdSwitch
              onSwitch={() => setSmartQuotes((v) => !v)}
              value={smartQuotes}
            />
          }
        />
      </SettingCard>

      <SettingCard
        id="attachments"
        icon={faPaperclip}
        title="Attachments"
        description="Control how media and files behave."
      >
        <SettingRow
          title="Paste images directly"
          description="Paste images from clipboard as attachments."
          suggested
          control={
            <AdSwitch
              onSwitch={() => setPasteImages((v) => !v)}
              value={pasteImages}
            />
          }
        />
      </SettingCard>

      <SettingCard
        id="decorations"
        icon={faTicket}
        title="Decorations"
        description="Configure default behaviors for each decorator."
      >
        <DecorationTabs />
      </SettingCard>
    </>
  );
};

export default ComposerSection;
