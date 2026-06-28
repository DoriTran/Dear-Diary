import { type CSSProperties, type FC } from 'react';

import { CircleQuestionMark, type LucideProps } from 'lucide-react';
import { DynamicIcon, iconNames, type IconName } from 'lucide-react/dynamic';

import { getIcon } from './iconRegistry';
import type { IconId } from './types';

export const iconIdToKebab = (id: IconId): string =>
  getIcon(id)?.kebab ??
  id
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

const isIconName = (name: string): name is IconName =>
  (iconNames as readonly string[]).includes(name);

export type LucideIconByIdProps = {
  iconId: IconId;
  size?: string | number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
};

const LucideIconById: FC<LucideIconByIdProps> = ({
  iconId,
  size = 16,
  color = 'currentColor',
  strokeWidth = 2,
  className,
  style,
  onClick,
}) => {
  const kebab = iconIdToKebab(iconId);

  const sharedProps: LucideProps = {
    size,
    color,
    strokeWidth,
    className,
    style: {
      cursor: onClick ? 'pointer' : undefined,
      flexShrink: 0,
      ...style,
    },
    onClick,
  };

  if (!isIconName(kebab)) {
    return <CircleQuestionMark {...sharedProps} />;
  }

  const iconName = kebab as unknown as IconName;

  return (
    <DynamicIcon
      fallback={() => <CircleQuestionMark {...sharedProps} />}
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      style={sharedProps.style}
      onClick={onClick}
      name={iconName}
    />
  );
};

export default LucideIconById;
