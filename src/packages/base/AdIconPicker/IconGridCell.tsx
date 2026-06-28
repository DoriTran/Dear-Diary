import { useRef, type FC, type KeyboardEvent, type MouseEvent, type TouchEvent } from 'react';

import { LucideIconById } from '@/packages/icon';
import type { IconId } from '@/packages/icon';

import styles from './IconGridCell.module.css';

const LONG_PRESS_MS = 500;

export type IconGridCellProps = {
  iconId: IconId;
  selected?: boolean;
  showCheck?: boolean;
  tabIndex?: number;
  ariaLabel?: string;
  onSelect: (iconId: IconId) => void;
  onToggleFavorite?: (iconId: IconId) => void;
  onFocus?: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
};

const IconGridCell: FC<IconGridCellProps> = ({
  iconId,
  selected = false,
  showCheck = false,
  tabIndex = -1,
  ariaLabel,
  onSelect,
  onToggleFavorite,
  onFocus,
  onKeyDown,
}) => {
  const longPressTimer = useRef<number | null>(null);
  const longPressTriggered = useRef(false);

  const clearLongPress = () => {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleToggleFavorite = () => {
    onToggleFavorite?.(iconId);
  };

  const handleContextMenu = (event: MouseEvent<HTMLButtonElement>) => {
    if (!onToggleFavorite) {
      return;
    }

    event.preventDefault();
    handleToggleFavorite();
  };

  const handleTouchStart = () => {
    if (!onToggleFavorite) {
      return;
    }

    longPressTriggered.current = false;
    clearLongPress();
    longPressTimer.current = window.setTimeout(() => {
      longPressTriggered.current = true;
      handleToggleFavorite();
    }, LONG_PRESS_MS);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLButtonElement>) => {
    clearLongPress();

    if (longPressTriggered.current) {
      event.preventDefault();
    }
  };

  const handleTouchMove = () => {
    clearLongPress();
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (longPressTriggered.current) {
      event.preventDefault();
      longPressTriggered.current = false;
      return;
    }

    event.preventDefault();
    onSelect(iconId);
  };

  return (
    <button
      type="button"
      className={styles.cell}
      data-selected={selected || undefined}
      aria-label={ariaLabel ?? iconId}
      aria-pressed={selected}
      tabIndex={tabIndex}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchCancel={clearLongPress}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
    >
      <LucideIconById iconId={iconId} size={16} />
      {showCheck && selected ? (
        <span className={styles.checkBadge} aria-hidden>
          <LucideIconById iconId="Check" size={8} color="white" strokeWidth={3} />
        </span>
      ) : null}
    </button>
  );
};

export default IconGridCell;
