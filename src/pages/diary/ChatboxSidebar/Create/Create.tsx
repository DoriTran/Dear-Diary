import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState, type FC } from 'react';

import { AdIcon, AdPopover } from '@/packages/base';

import styles from './Create.module.css';
import CreateMenu from './CreateMenu';
import CreateModal, { type CreateModalMode } from './CreateModal';

const Create: FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalMode, setModalMode] = useState<CreateModalMode>(null);

  const openModal = (mode: Exclude<CreateModalMode, null>) => {
    setMenuOpen(false);
    setModalMode(mode);
  };

  return (
    <>
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
            onClick={() => setMenuOpen((value) => !value)}
          >
            <div className={styles.icon}>
              <AdIcon icon={faPlus} size={14} />
            </div>
          </button>
        }
      >
        <CreateMenu
          onStartChatbox={() => openModal('chatbox')}
          onCreateGroup={() => openModal('group')}
        />
      </AdPopover>

      <CreateModal mode={modalMode} onClose={() => setModalMode(null)} />
    </>
  );
};

export default Create;
