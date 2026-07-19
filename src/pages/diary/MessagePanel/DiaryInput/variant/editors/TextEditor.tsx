import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type KeyboardEvent,
} from 'react';

import type { EnterKeyBehavior } from '@/store/settings/type';

import { AdIcon } from '@/packages/base';

import type { ComposerEditorRef } from '../../input/composer.types';
import { useAutoGrowTextarea } from '../../input/useAutoGrowTextarea';

import styles from './TextEditor.module.css';

export type TextEditorProps = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  /** Called when Enter (or Shift+Enter) should send, per enterKeyBehavior. */
  onSubmit?: () => void;
  enterKeyBehavior?: EnterKeyBehavior;
  showAiIcon?: boolean;
  rows?: number;
  /** Auto-grow height up to this many lines. */
  maxRows?: number;
};

const TextEditor = forwardRef<ComposerEditorRef, TextEditorProps>(
  (
    {
      value,
      placeholder = 'Write something...',
      onChange,
      onFocus,
      onBlur,
      onSubmit,
      enterKeyBehavior = 'enter-sends',
      showAiIcon = false,
      rows = 2,
      maxRows,
    },
    ref,
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      insertAtCursor: (insertValue: string) => {
        const textarea = textareaRef.current;

        if (!textarea) {
          return;
        }

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const nextValue =
          value.slice(0, start) + insertValue + value.slice(end);

        onChange(nextValue);

        requestAnimationFrame(() => {
          const cursor = start + insertValue.length;
          textarea.setSelectionRange(cursor, cursor);
          textarea.focus();
        });
      },
      focus: () => {
        textareaRef.current?.focus();
      },
    }));

    useAutoGrowTextarea(textareaRef, value, maxRows);

    const handleFocus = () => {
      onFocus?.();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (!onSubmit || event.key !== 'Enter' || event.nativeEvent.isComposing) {
        return;
      }

      const shouldSend =
        enterKeyBehavior === 'enter-sends' ? !event.shiftKey : event.shiftKey;

      if (shouldSend) {
        event.preventDefault();
        onSubmit();
      }
    };

    return (
      <div className={showAiIcon ? styles.aiWrap : styles.root}>
        <textarea
          ref={textareaRef}
          className={`${styles.input} ${maxRows != null ? styles.inputGrow : ''}`}
          value={value}
          placeholder={placeholder}
          rows={maxRows != null ? undefined : rows}
          aria-label={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onFocus={handleFocus}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
        />
        {showAiIcon ? (
          <span className={styles.aiIcon} aria-hidden>
            <AdIcon icon={faWandMagicSparkles} size={12} />
          </span>
        ) : null}
      </div>
    );
  },
);

TextEditor.displayName = 'TextEditor';

export default TextEditor;
