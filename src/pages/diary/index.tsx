import styles from './index.module.css';
import NotebookSidebar from './NotebookSidebar/NotebookSidebar';

const Diary = () => {
  return (
    <div className={styles.rootPage}>
      <NotebookSidebar />
    </div>
  );
};

export default Diary;
