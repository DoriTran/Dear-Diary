import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { LucideProps } from 'lucide-react';
import type { FC, CSSProperties, ComponentType } from 'react';

import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircleQuestionMark } from 'lucide-react';
import { ReactSVG } from 'react-svg';

import { isValidIconId, LucideIconById } from '@/packages/icon';

import { svgIcon } from './svgIcon';

type LucideIcon = ComponentType<LucideProps>;

export type IconValue = string | IconDefinition | LucideIcon;
export type IconSource = 'custom' | 'fontawesome' | 'lucide';

export interface IconProps {
  icon?: IconValue;
  source?: IconSource;
  color?: string;
  size?: string | number;
  strokeWidth?: number;
  style?: CSSProperties;
  onClick?: () => void;
}

const REACT_FORWARD_REF = Symbol.for('react.forward_ref');

const isLucideIcon = (value: IconValue): value is LucideIcon => {
  if (typeof value === 'function') return true;

  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { $$typeof?: symbol }).$$typeof === REACT_FORWARD_REF
  );
};

const resolveFaIcon = (icon: IconValue): IconDefinition => {
  if (typeof icon !== 'string') return icon as IconDefinition;

  return (
    (solidIcons as unknown as Record<string, IconDefinition>)[icon] ||
    faQuestion
  );
};

const AdIcon: FC<IconProps> = ({
  icon = faQuestion,
  source = 'fontawesome',
  color = 'inherit',
  size = '1.5rem',
  strokeWidth = 2,
  style,
  onClick,
  ...restProps
}) => {
  const commonStyle: CSSProperties = {
    cursor: onClick ? 'pointer' : 'unset',
    ...style,
  };

  if (source === 'custom') {
    if (typeof icon !== 'string') return null;

    const src = svgIcon[icon];
    if (!src) return null;

    return (
      <ReactSVG
        src={src}
        beforeInjection={(svg) => {
          svg.setAttribute('width', String(size));
          svg.setAttribute('height', String(size));
          svg.setAttribute('fill', color);
        }}
        onClick={onClick}
        style={commonStyle}
        {...restProps}
      />
    );
  }

  if (source === 'lucide') {
    const lucideColor = color === 'inherit' ? 'currentColor' : color;

    if (typeof icon === 'string' && isValidIconId(icon)) {
      return (
        <LucideIconById
          iconId={icon}
          size={size}
          color={lucideColor}
          strokeWidth={strokeWidth}
          onClick={onClick}
          style={commonStyle}
          {...restProps}
        />
      );
    }

    const LucideComponent = isLucideIcon(icon) ? icon : CircleQuestionMark;

    return (
      <LucideComponent
        size={size}
        color={lucideColor}
        strokeWidth={strokeWidth}
        onClick={onClick}
        style={commonStyle}
        {...restProps}
      />
    );
  }

  const resolvedIcon = resolveFaIcon(icon);

  return (
    <FontAwesomeIcon
      icon={resolvedIcon}
      color={color}
      onClick={onClick}
      style={{
        fontSize: size,
        ...commonStyle,
      }}
      {...restProps}
    />
  );
};

export default AdIcon;
