import { Blend } from 'lucide-react';
import { useState, type FC } from 'react';

import AdPopover from '../AdPopover/AdPopover';
import styles from './AdEmojiPicker.module.css';
import { ALL_SKIN_TONES, getSkinToneOption, type SkinToneId } from './data';

export type SkinTonePickerProps = {
  value: SkinToneId;
  onChange: (tone: SkinToneId) => void;
};

const SkinTonePicker: FC<SkinTonePickerProps> = ({ value, onChange }) => {
  const [opened, setOpened] = useState(false);
  const option = getSkinToneOption(value);

  const handleSelect = (tone: SkinToneId) => {
    onChange(tone);
    setOpened(false);
  };

  return (
    <AdPopover
      opened={opened}
      onChange={setOpened}
      position="bottom-end"
      width={220}
      shadow="md"
      withinPortal={false}
      classNames={{ dropdown: styles.skinToneDropdown }}
      anchor={
        <button
          type="button"
          className={styles.skinToneBtn}
          aria-label="Choose skin tone"
          aria-expanded={opened}
          style={{
            backgroundColor: option.buttonBg,
            borderColor: option.iconColor,
            color: option.iconColor,
          }}
          onClick={() => setOpened((current) => !current)}
        >
          <Blend size={16} strokeWidth={2.25} aria-hidden />
        </button>
      }
    >
      <div className={styles.skinTonePopover}>
        <div className={styles.skinToneHeader}>
          <p className={styles.skinToneTitle}>Choose Skin Tone</p>
          <p className={styles.skinToneSubtitle}>
            Select your referred emoji skin tone!
          </p>
        </div>
        <div
          className={styles.skinToneSwatches}
          role="listbox"
          aria-label="Skin tones"
        >
          {ALL_SKIN_TONES.map((swatch) => {
            const selected = value === swatch.id;

            return (
              <button
                key={swatch.id}
                type="button"
                role="option"
                aria-selected={selected}
                aria-label={swatch.label}
                className={styles.skinToneSwatch}
                data-selected={selected || undefined}
                style={{ backgroundColor: swatch.iconColor }}
                onClick={() => handleSelect(swatch.id)}
              />
            );
          })}
        </div>
      </div>
    </AdPopover>
  );
};

export default SkinTonePicker;
