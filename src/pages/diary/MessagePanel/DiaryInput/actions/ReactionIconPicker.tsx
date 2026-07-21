import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useState, type FC } from 'react';

import { AdEmojiPicker, AdIcon } from '@/packages/base';

import styles from './ReactionIconPicker.module.css';

export type ReactionIconPickerProps = {
  onSelect: (value: string) => void;
};

const ReactionIconPicker: FC<ReactionIconPickerProps> = ({ onSelect }) => {
  const [opened, setOpened] = useState(false);

  return (
    <AdEmojiPicker
      opened={opened}
      onChange={setOpened}
      onSelect={onSelect}
      anchor={
        <button
          type="button"
          className={styles.triggerBtn}
          aria-label="Insert emoji"
          onClick={() => setOpened((current) => !current)}
        >
          <AdIcon icon={faHeart} size={14} />
        </button>
      }
    />
  );
};

export default ReactionIconPicker;
