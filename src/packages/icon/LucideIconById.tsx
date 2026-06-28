import { lazy, Suspense, useMemo, type CSSProperties, type FC } from 'react';

import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { CircleQuestionMark, type LucideProps } from 'lucide-react';

import { getIcon } from './iconRegistry';
import type { IconId } from './types';

export const iconIdToKebab = (id: IconId): string =>
  getIcon(id)?.kebab ??
  id
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

type DynamicIconModule = {
  default: FC<LucideProps>;
};

const iconLoaders = dynamicIconImports as Record<
  string,
  () => Promise<DynamicIconModule>
>;

const iconComponentCache = new Map<string, FC<LucideProps>>();

const getLazyIconComponent = (kebab: string): FC<LucideProps> | null => {
  const cached = iconComponentCache.get(kebab);

  if (cached) {
    return cached;
  }

  const loader = iconLoaders[kebab];

  if (!loader) {
    return null;
  }

  const LazyIcon = lazy(loader);
  iconComponentCache.set(kebab, LazyIcon);

  return LazyIcon;
};

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
  const IconComponent = useMemo(() => getLazyIconComponent(kebab), [kebab]);

  const sharedProps: LucideProps = {
    size,
    color,
    strokeWidth,
    className,
    style: {
      cursor: onClick ? 'pointer' : undefined,
      ...style,
    },
    onClick,
  };

  if (!IconComponent) {
    return <CircleQuestionMark {...sharedProps} />;
  }

  return (
    <Suspense fallback={<CircleQuestionMark {...sharedProps} />}>
      <IconComponent {...sharedProps} />
    </Suspense>
  );
};

export default LucideIconById;
