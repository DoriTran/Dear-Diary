import type { FC } from 'react';

import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { AdIcon } from '@/packages/base';

import styles from './Create.module.css';

const Create: FC = () => {
  return (
    <button className={styles.root} type="button" aria-label="New chatbox">
      <AdIcon className={styles.icon} icon={faPlus} size={14} />
    </button>
  );
};

export default Create;
