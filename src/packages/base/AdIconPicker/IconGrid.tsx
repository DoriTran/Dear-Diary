import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
  type KeyboardEvent,
} from 'react';

import type { IconId } from '@/packages/icon';

import { useAppStore } from '@/store';

import styles from './IconGrid.module.css';
import IconGridCell from './IconGridCell';

const ICON_CELL_SIZE_PX = 36;
const ICON_GRID_GAP_PX = 4;

export type IconGridProps = {
  iconIds: IconId[];
  selectedId?: IconId;
  /** Maximum icons per row (keyboard navigation only; layout uses flex-wrap) */
  maxColumns?: number;
  showCheck?: boolean;
  emptyMessage?: string;
  onSelect: (iconId: IconId) => void;
  onEscape?: () => void;
};

const IconGrid: FC<IconGridProps> = ({
  iconIds,
  selectedId,
  maxColumns = 12,
  showCheck = true,
  emptyMessage = 'No icons found',
  onSelect,
  onEscape,
}) => {
  const toggleFavoriteIcon = useAppStore('toggleFavoriteIcon');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [rowColumns, setRowColumns] = useState(maxColumns);
  const wrapRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFocusedIndex(0);
  }, [iconIds]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) {
      return;
    }

    // Keep focus on the search input (or elsewhere) when results update;
    // only move focus between cells while navigating inside the grid.
    if (!grid.contains(document.activeElement)) {
      return;
    }

    const focusedCell = grid.querySelector<HTMLButtonElement>(`[tabindex="0"]`);
    focusedCell?.focus();
  }, [focusedIndex, iconIds]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) {
      return;
    }

    const updateRowColumns = () => {
      const width = wrap.clientWidth;
      const fittedColumns = Math.max(
        1,
        Math.floor(
          (width + ICON_GRID_GAP_PX) / (ICON_CELL_SIZE_PX + ICON_GRID_GAP_PX),
        ),
      );
      setRowColumns(Math.min(maxColumns, fittedColumns));
    };

    updateRowColumns();

    const observer = new ResizeObserver(updateRowColumns);
    observer.observe(wrap);
    window.addEventListener('resize', updateRowColumns);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateRowColumns);
    };
  }, [iconIds.length, maxColumns]);

  const handleToggleFavorite = useCallback(
    (iconId: IconId) => {
      toggleFavoriteIcon(iconId);
    },
    [toggleFavoriteIcon],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onEscape?.();
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelect(iconIds[index]);
        return;
      }

      let nextIndex = index;

      switch (event.key) {
        case 'ArrowRight':
          nextIndex = Math.min(index + 1, iconIds.length - 1);
          break;
        case 'ArrowLeft':
          nextIndex = Math.max(index - 1, 0);
          break;
        case 'ArrowDown':
          nextIndex = Math.min(index + rowColumns, iconIds.length - 1);
          break;
        case 'ArrowUp':
          nextIndex = Math.max(index - rowColumns, 0);
          break;
        default:
          return;
      }

      event.preventDefault();
      setFocusedIndex(nextIndex);
    },
    [iconIds, onEscape, onSelect, rowColumns],
  );

  if (iconIds.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  return (
    <div ref={wrapRef} className={styles.gridWrap}>
      <div ref={gridRef} className={styles.grid} role="grid">
        {iconIds.map((iconId, index) => (
          <IconGridCell
            key={iconId}
            iconId={iconId}
            selected={selectedId === iconId}
            showCheck={showCheck}
            tabIndex={index === focusedIndex ? 0 : -1}
            onSelect={onSelect}
            onToggleFavorite={handleToggleFavorite}
            onFocus={() => setFocusedIndex(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          />
        ))}
      </div>
    </div>
  );
};

export default IconGrid;
