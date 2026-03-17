import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { FC, CSSProperties } from 'react';

import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactSVG } from 'react-svg';

import { svgIcon } from './svgIcon';

export type IconValue = string | IconDefinition;

export interface IconProps {
  icon?: IconValue;
  color?: string;
  size?: string | number;
  custom?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
}

/**
 * Resolve FontAwesome icon from string
 * "folder" -> faFolder
 */
const resolveFaIcon = (icon: IconValue): IconDefinition => {
  if (typeof icon !== 'string') {
    return icon;
  }

  return (
    (solidIcons as unknown as Record<string, IconDefinition>)[icon] ||
    faQuestion
  );
};

const Icon: FC<IconProps> = ({
  icon = faQuestion,
  color = 'inherit',
  size = '1.5rem',
  custom = false,
  ...restProps
}) => {
  /* ---------- Custom SVG icons ---------- */
  if (custom) {
    if (typeof icon !== 'string') {
      console.warn('[Icon] Custom SVG icon expects a string key.');
      return null;
    }

    const src = svgIcon[icon];

    if (!src) {
      console.warn(`[Icon] Custom SVG icon "${icon}" not found`);
      return null;
    }

    return (
      <ReactSVG
        src={src}
        beforeInjection={(svg) => {
          svg.setAttribute('width', String(size));
          svg.setAttribute('height', String(size));
          svg.setAttribute('fill', color);
        }}
        {...restProps}
        style={{
          cursor: restProps.onClick ? 'pointer' : 'unset',
          ...restProps.style,
        }}
      />
    );
  }

  /* ---------- Font Awesome icons ---------- */
  const resolvedIcon = resolveFaIcon(icon);

  return (
    <FontAwesomeIcon
      icon={resolvedIcon}
      color={color}
      {...restProps}
      style={{
        fontSize: size,
        cursor: restProps.onClick ? 'pointer' : 'unset',
        ...restProps.style,
      }}
    />
  );
};

export default Icon;
