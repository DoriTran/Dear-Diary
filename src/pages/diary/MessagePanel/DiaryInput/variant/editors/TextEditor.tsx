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
    /** Preserve cursor across blur (emoji picker steals focus on mousedown). */
    const selectionRef = useRef({ start: 0, end: 0 });

    useImperativeHandle(ref, () => ({
      insertAtCursor: (insertValue: string) => {
        const textarea = textareaRef.current;

        if (!textarea) {
          return;
        }

        // Prefer live DOM value; closed-over React `value` can lag behind typing.
        const currentValue = textarea.value;
        const hasDomSelection =
          typeof textarea.selectionStart === 'number' &&
          document.activeElement === textarea;
        const start = hasDomSelection
          ? textarea.selectionStart
          : selectionRef.current.start;
        const end = hasDomSelection
          ? textarea.selectionEnd
          : selectionRef.current.end;
        const nextValue =
          currentValue.slice(0, start) + insertValue + currentValue.slice(end);

        onChange(nextValue);

        const cursor = start + insertValue.length;
        selectionRef.current = { start: cursor, end: cursor };

        requestAnimationFrame(() => {
          textarea.focus();
          textarea.setSelectionRange(cursor, cursor);
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

    const handleBlur = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        selectionRef.current = {
          start: textarea.selectionStart,
          end: textarea.selectionEnd,
        };
      }
      onBlur?.();
    };

    const handleSelect = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        selectionRef.current = {
          start: textarea.selectionStart,
          end: textarea.selectionEnd,
        };
      }
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
          onChange={(event) => {
            const next = event.target.value;
            selectionRef.current = {
              start: event.target.selectionStart,
              end: event.target.selectionEnd,
            };
            onChange(next);
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSelect={handleSelect}
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
