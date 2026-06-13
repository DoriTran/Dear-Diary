import { useState, type FC, type ReactNode } from 'react';

import AdEmojiPicker from '../AdEmojiPicker/AdEmojiPicker';
import { AD_COMPOSER_EMOJIS } from '../AdEmojiPicker/emojiPresets';
import { AD_ICON_KEYS } from '../AdIconPicker/iconPresets';
import AdPopover from '../AdPopover/AdPopover';

export type AdEmojiIconPickerProps = {
  anchor: ReactNode;
  onSelect: (value: string) => void;
  emojis?: readonly string[];
  iconKeys?: readonly string[];
  opened?: boolean;
  onChange?: (opened: boolean) => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
  width?: number;
};

const AdEmojiIconPicker: FC<AdEmojiIconPickerProps> = ({
  anchor,
  onSelect,
  emojis = AD_COMPOSER_EMOJIS,
  iconKeys = AD_ICON_KEYS,
  opened: controlledOpened,
  onChange: controlledOnChange,
  position = 'top',
  width = 220,
}) => {
  const [internalOpened, setInternalOpened] = useState(false);
  const opened = controlledOpened ?? internalOpened;
  const onChange = controlledOnChange ?? setInternalOpened;

  const handleSelect = (value: string) => {
    onSelect(value);
    onChange(false);
  };

  return (
    <AdPopover
      opened={opened}
      onChange={onChange}
      position={position}
      width={width}
      anchor={anchor}
    >
      <AdEmojiPicker
        emojis={emojis}
        iconKeys={iconKeys}
        showIcons
        onSelect={handleSelect}
      />
    </AdPopover>
  );
};

export default AdEmojiIconPicker;
