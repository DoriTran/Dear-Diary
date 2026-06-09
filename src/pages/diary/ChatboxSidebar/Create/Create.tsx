import type { FC } from 'react';

import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { AdIcon } from '@/packages/base';

import styles from './Create.module.css';

const Create: FC = () => {
  return (
    <button className={styles.root} type="button" aria-label="New chatbox">
      <div className={styles.icon}>
        <AdIcon icon={faPlus} size={14} />
      </div>
    </button>
  );
};

export default Create;
