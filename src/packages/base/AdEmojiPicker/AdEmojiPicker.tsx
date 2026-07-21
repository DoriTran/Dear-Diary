import { useState, type FC, type ReactNode } from 'react';

import AdPopover from '../AdPopover/AdPopover';
import styles from './AdEmojiPicker.module.css';
import AdEmojiPickerPanel, {
  DEFAULT_PICKER_HEIGHT,
  DEFAULT_PICKER_WIDTH,
} from './AdEmojiPickerPanel';

export type AdEmojiPickerProps = {
  anchor: ReactNode;
  onSelect: (value: string) => void;
  opened?: boolean;
  onChange?: (opened: boolean) => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
  width?: number;
  height?: number;
};

const AdEmojiPicker: FC<AdEmojiPickerProps> = ({
  anchor,
  onSelect,
  opened: controlledOpened,
  onChange: controlledOnChange,
  position = 'top',
  width = DEFAULT_PICKER_WIDTH,
  height = DEFAULT_PICKER_HEIGHT,
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
      width="auto"
      shadow="md"
      classNames={{ dropdown: styles.dropdown }}
      styles={{
        dropdown: {
          maxWidth: 'calc(100vw - 1.5rem)',
        },
      }}
      anchor={anchor}
    >
      <AdEmojiPickerPanel
        onSelect={handleSelect}
        width={width}
        height={height}
      />
    </AdPopover>
  );
};

export default AdEmojiPicker;
