import { useMediaQuery } from '@mantine/hooks';
import { useCallback, useState, type FC } from 'react';

import type { ColorId } from '@/packages/color';

import CreatePalettePanel from './CreatePalettePanel';
import styles from './PalettePickerPopover.module.css';
import PaletteSelectionPanel from './PaletteSelectionPanel';

export type PalettePickerPopoverProps = {
  value: ColorId;
  onChange: (value: ColorId) => void;
  onValueChange: (value: ColorId) => void;
  onClose: () => void;
};

type PopoverView = 'browse' | 'create';

const PalettePickerPopover: FC<PalettePickerPopoverProps> = ({
  value,
  onChange,
  onValueChange,
  onClose,
}) => {
  const [view, setView] = useState<PopoverView>('browse');
  const isWide = useMediaQuery('(min-width: 56rem)');
  const hideCreateNew = isWide || view === 'create';

  const handleSelect = useCallback(
    (colorId: ColorId) => {
      onChange(colorId);
      onClose();
    },
    [onChange, onClose],
  );

  const handleSaved = useCallback(
    (colorId: ColorId) => {
      onChange(colorId);
      onClose();
    },
    [onChange, onClose],
  );

  return (
    <div className={styles.root}>
      <div className={styles.layout} data-view={view}>
        <div className={styles.selectionPanel}>
          <PaletteSelectionPanel
            value={value}
            onSelect={handleSelect}
            onValueChange={onValueChange}
            onClose={onClose}
            onCreateNew={() => setView('create')}
            hideCreateNew={hideCreateNew}
          />
        </div>
        <div className={styles.createPanel}>
          <CreatePalettePanel
            onCancel={() => setView('browse')}
            onSaved={handleSaved}
            showBack={view === 'create'}
          />
        </div>
      </div>
    </div>
  );
};

export default PalettePickerPopover;
