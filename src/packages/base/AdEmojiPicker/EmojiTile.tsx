import {
  useRef,
  type FC,
  type MouseEvent,
  type ReactNode,
  type TouchEvent,
} from 'react';

import styles from './AdEmojiPicker.module.css';

const LONG_PRESS_MS = 500;

export type EmojiTileProps = {
  ariaLabel: string;
  children: ReactNode;
  onSelect: () => void;
  onToggleFavorite?: () => void;
};

const EmojiTile: FC<EmojiTileProps> = ({
  ariaLabel,
  children,
  onSelect,
  onToggleFavorite,
}) => {
  const longPressTimer = useRef<number | null>(null);
  const longPressTriggered = useRef(false);

  const clearLongPress = () => {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleContextMenu = (event: MouseEvent<HTMLButtonElement>) => {
    if (!onToggleFavorite) {
      return;
    }

    event.preventDefault();
    onToggleFavorite();
  };

  const handleTouchStart = () => {
    if (!onToggleFavorite) {
      return;
    }

    longPressTriggered.current = false;
    clearLongPress();
    longPressTimer.current = window.setTimeout(() => {
      longPressTriggered.current = true;
      onToggleFavorite();
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

    onSelect();
  };

  /**
   * Keep the composer textarea focused (and its selection intact) when pressing
   * an emoji tile — otherwise mousedown blurs the input before click fires and
   * insertAtCursor can no-op or insert at the wrong place.
   */
  const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <button
      type="button"
      className={styles.emojiTile}
      aria-label={ariaLabel}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchCancel={clearLongPress}
    >
      {children}
    </button>
  );
};

export default EmojiTile;
