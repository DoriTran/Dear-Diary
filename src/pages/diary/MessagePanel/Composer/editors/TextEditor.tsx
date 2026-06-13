import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import { AdIcon } from '@/packages/base';

import type { ComposerEditorRef } from '../composer.types';

import styles from './TextEditor.module.css';

export type TextEditorProps = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  showAiIcon?: boolean;
  rows?: number;
};

const TextEditor = forwardRef<ComposerEditorRef, TextEditorProps>(
  (
    {
      value,
      placeholder = 'Write something...',
      onChange,
      onFocus,
      onBlur,
      showAiIcon = false,
      rows = 2,
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

    useEffect(() => {
      const textarea = textareaRef.current;

      if (!textarea) {
        return;
      }

      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }, [value]);

    const handleFocus = () => {
      onFocus?.();
    };

    return (
      <div className={showAiIcon ? styles.aiWrap : styles.root}>
        <textarea
          ref={textareaRef}
          className={styles.input}
          value={value}
          placeholder={placeholder}
          rows={rows}
          aria-label={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onFocus={handleFocus}
          onBlur={onBlur}
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
