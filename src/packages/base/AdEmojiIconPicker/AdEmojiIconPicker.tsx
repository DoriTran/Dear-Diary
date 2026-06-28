import { useState, type FC, type ReactNode } from 'react';

import AdEmojiPicker from '../AdEmojiPicker/AdEmojiPicker';
import { AD_COMPOSER_EMOJIS, AD_COMPOSER_ICON_IDS } from '../AdEmojiPicker/emojiPresets';
import AdPopover from '../AdPopover/AdPopover';

export type AdEmojiIconPickerProps = {
  anchor: ReactNode;
  onSelect: (value: string) => void;
  emojis?: readonly string[];
  iconIds?: readonly string[];
  opened?: boolean;
  onChange?: (opened: boolean) => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
  width?: number;
};

const AdEmojiIconPicker: FC<AdEmojiIconPickerProps> = ({
  anchor,
  onSelect,
  emojis = AD_COMPOSER_EMOJIS,
  iconIds = AD_COMPOSER_ICON_IDS,
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
        iconIds={iconIds}
        showIcons
        onSelect={handleSelect}
      />
    </AdPopover>
  );
};

export default AdEmojiIconPicker;
