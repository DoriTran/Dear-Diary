import styles from './index.module.css';
import NotebookSidebar from './NotebookSidebar/NotebookSidebar';
import PaperChatbox from './PaperChatbox/PaperChatbox';

const Diary = () => {
  return (
    <div className={styles.rootPage}>
      <NotebookSidebar />
      <PaperChatbox />
    </div>
  );
};

export default Diary;
