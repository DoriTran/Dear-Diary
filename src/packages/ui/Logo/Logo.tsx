import type { FC } from 'react';

import logo from '@/assets/logo/logo.png';

import styles from './Logo.module.css';

interface LogoProps {
  width?: number;
  height: number;
}

const Logo: FC<LogoProps> = ({ width = 135, height }) => {
  return (
    <div
      className={styles.base}
      style={{
        backgroundImage: `url(${logo})`,
        width: width ? width : height * 1.6875,
        height: height ? height : width * 0.5926,
      }}
    ></div>
  );
};

export default Logo;
