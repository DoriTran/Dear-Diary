import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';

import { AdIcon } from '@/packages/base';

import type { ComposerEditorRef } from '../../input/composer.types';

import styles from './TextEditor.module.css';

export type TextEditorProps = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
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

    useLayoutEffect(() => {
      const textarea = textareaRef.current;

      if (!textarea) {
        return;
      }

      const style = getComputedStyle(textarea);
      const lineHeight = parseFloat(style.lineHeight) || 20;
      const paddingY =
        parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      const minHeight = lineHeight + paddingY;

      textarea.style.height = '0';
      const scrollHeight = textarea.scrollHeight;

      if (maxRows != null) {
        const maxHeight = lineHeight * maxRows + paddingY;
        const nextHeight = Math.min(
          Math.max(scrollHeight, minHeight),
          maxHeight,
        );

        textarea.style.height = `${nextHeight}px`;
        textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
        return;
      }

      textarea.style.height = `${Math.max(scrollHeight, minHeight)}px`;
      textarea.style.overflowY = 'hidden';
    }, [maxRows, value]);

    const handleFocus = () => {
      onFocus?.();
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
