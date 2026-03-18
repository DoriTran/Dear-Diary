import type { FC } from 'react';

import Icon from '@/packages/base/AdIcon/AdIcon';

import {
  navigationCircles,
  navigationIcons,
  type NavigationPage,
} from '../Navigation.constants';
import styles from './PageCircle.module.css';

interface PageCircleProps {
  page: NavigationPage;
}

const PageCircle: FC<PageCircleProps> = ({ page }) => {
  return (
    <div
      className={styles.pageIcon}
      style={{
        backgroundImage: `url(${navigationCircles[page]})`,
      }}
    >
      <Icon icon={navigationIcons[page]} size={40} color={`var(--${page})`} />
    </div>
  );
};

export default PageCircle;
