import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { FC } from 'react';

import { AdIcon } from '@/packages/base';

import styles from './Create.module.css';

const Create: FC = () => {
  return (
    <button className={styles.root} type="button" aria-label="New chatbox">
      <AdIcon icon={faPlus} size={16} />
    </button>
  );
};

export default Create;
