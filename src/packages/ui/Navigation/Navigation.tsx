import type { FC } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import Bookmark from '@/packages/ui/Bookmark/Bookmark';
import Logo from '@/packages/ui/Logo/Logo';

import {
  navigationIcons,
  navigationPages,
  type NavigationPage,
} from './Navigation.constants';
import styles from './Navigation.module.css';
import PageCircle from './PageCircle/PageCircle';

const Navigation: FC = () => {
  const location = useLocation();
  const currentPage = (location.pathname.split('/')[1] ||
    'home') as NavigationPage;
  const navigate = useNavigate();

  return (
    <div className={styles.base}>
      <div className={styles.bookcover}></div>
      <div className={styles.paper}>
        <Logo height={80} />
        <PageCircle page={currentPage} />
      </div>
      <div className={styles.bookmarks}>
        {navigationPages.map((eachPage) => (
          <Bookmark
            key={eachPage}
            icon={navigationIcons[eachPage]}
            iconColor={`var(--background)`}
            color={`var(--${eachPage})`}
            gradient="to bottom"
            width={35}
            height={45}
            onClick={() => void navigate(`/${eachPage}`)}
            {...(currentPage === eachPage && { style: { marginTop: -45 } })}
          />
        ))}
      </div>
    </div>
  );
};

export default Navigation;
