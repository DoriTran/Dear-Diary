import type { FC } from 'react';

import { faComments, faFolderPlus } from '@fortawesome/free-solid-svg-icons';

import { AdIcon } from '@/packages/base';

import styles from './Create.module.css';

export type CreateMenuProps = {
  onStartChatbox: () => void;
  onCreateGroup: () => void;
};

const CreateMenu: FC<CreateMenuProps> = ({ onStartChatbox, onCreateGroup }) => {
  return (
    <ul className={styles.menuList}>
      <li>
        <button
          type="button"
          className={styles.menuItem}
          onClick={onStartChatbox}
        >
          <AdIcon icon={faComments} size={14} />
          Start new chatbox
        </button>
      </li>
      <li>
        <button
          type="button"
          className={styles.menuItem}
          onClick={onCreateGroup}
        >
          <AdIcon icon={faFolderPlus} size={14} />
          Create new Group
        </button>
      </li>
    </ul>
  );
};

export default CreateMenu;
