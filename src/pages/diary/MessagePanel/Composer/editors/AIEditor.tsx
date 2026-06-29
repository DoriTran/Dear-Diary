import type { FC, RefObject } from 'react';

import type { ComposerEditorRef } from '../composer.types';

import TextEditor from './TextEditor';

export type AIEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  editorRef?: RefObject<ComposerEditorRef | null>;
};

const AIEditor: FC<AIEditorProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  editorRef,
}) => {
  return (
    <TextEditor
      ref={editorRef}
      value={value}
      placeholder="Ask AI something..."
      showAiIcon
      maxRows={5}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

export default AIEditor;
