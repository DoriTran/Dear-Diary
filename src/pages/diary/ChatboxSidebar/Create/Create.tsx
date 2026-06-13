import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect, useRef, useState, type FC } from 'react';

import { AdIcon, AdPopover } from '@/packages/base';

import styles from './Create.module.css';
import CreateMenu from './CreateMenu';

export type CreateProps = {
  onOpenCreate: (entity: 'chatbox' | 'group') => void;
};

const HOVER_CLOSE_DELAY_MS = 120;

const Create: FC<CreateProps> = ({ onOpenCreate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const canHoverRef = useRef(true);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    canHoverRef.current = window.matchMedia('(hover: hover)').matches;
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openMenu = useCallback(() => {
    clearCloseTimer();
    setMenuOpen(true);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    if (!canHoverRef.current) {
      return;
    }

    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setMenuOpen(false);
    }, HOVER_CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  useEffect(() => {
    return () => clearCloseTimer();
  }, [clearCloseTimer]);

  const openModal = (entity: 'chatbox' | 'group') => {
    setMenuOpen(false);
    onOpenCreate(entity);
  };

  return (
    <AdPopover
      classNames={{ dropdown: styles.menu }}
      offset={8}
      onChange={setMenuOpen}
      opened={menuOpen}
      position="bottom"
      width={220}
      anchor={
        <button
          className={styles.root}
          type="button"
          aria-label="New chatbox or group"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          onClick={() => {
            if (canHoverRef.current) {
              openMenu();
              return;
            }

            setMenuOpen((value) => !value);
          }}
          onMouseEnter={() => {
            if (canHoverRef.current) {
              openMenu();
            }
          }}
          onMouseLeave={scheduleClose}
        >
          <div className={styles.icon}>
            <AdIcon icon={faPlus} size={14} />
          </div>
        </button>
      }
    >
      <div onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
        <CreateMenu
          onStartChatbox={() => openModal('chatbox')}
          onCreateGroup={() => openModal('group')}
        />
      </div>
    </AdPopover>
  );
};

export default Create;
