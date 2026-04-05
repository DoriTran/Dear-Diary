import type { FC } from 'react';

import clsx from 'clsx';

import chatBgPaper from '@/assets/pages/diary/chat bg paper.webp';

import ChatboxControl from './ChatboxControl/ChatboxControl';
import styles from './PaperChatbox.module.css';
import PaperedContent from './PaperedContent/PaperedContent';
import TearedPaperHeader from './TearedPaperHeader/TearedPaperHeader';

export type PaperChatboxProps = {
  className?: string;
};

const PaperChatbox: FC<PaperChatboxProps> = ({ className }) => {
  return (
    <div
      className={clsx(styles.root, className)}
      style={{ backgroundImage: `url(${chatBgPaper})` }}
    >
      <TearedPaperHeader />
      <PaperedContent />
      <ChatboxControl />
    </div>
  );
};

export default PaperChatbox;
