import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useState, type FC } from 'react';

import { AdEmojiIconPicker, AdIcon } from '@/packages/base';

import styles from './ReactionIconPicker.module.css';

export type ReactionIconPickerProps = {
  onSelect: (value: string) => void;
};

const ReactionIconPicker: FC<ReactionIconPickerProps> = ({ onSelect }) => {
  const [opened, setOpened] = useState(false);

  return (
    <AdEmojiIconPicker
      opened={opened}
      onChange={setOpened}
      onSelect={onSelect}
      anchor={
        <button
          type="button"
          className={styles.triggerBtn}
          aria-label="Insert reaction icon"
          onClick={() => setOpened((current) => !current)}
        >
          <AdIcon icon={faHeart} size={14} />
        </button>
      }
    />
  );
};

export default ReactionIconPicker;
