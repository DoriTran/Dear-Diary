import type { FC } from 'react';

import { Modal, type ModalProps } from '@mantine/core';

import styles from './AdModal.module.css';

export type AdModalProps = ModalProps;

const AdModal: FC<AdModalProps> = ({
  classNames,
  radius = 'lg',
  centered = true,
  ...props
}) => {
  return (
    <Modal
      centered={centered}
      radius={radius}
      classNames={{
        content: styles.content,
        header: styles.header,
        title: styles.title,
        body: styles.body,
        overlay: styles.overlay,
        close: styles.close,
        ...classNames,
      }}
      {...props}
    />
  );
};

export default AdModal;
