import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import clsx from 'clsx';

import styles from './LayoutCard.module.css';

type LayoutCardProps<T extends ElementType = 'div'> = {
  tag?: T;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'children' | 'tag'>;

function LayoutCard<T extends ElementType = 'div'>({
  tag,
  children,
  className,
  ...props
}: LayoutCardProps<T>) {
  const Component = tag ?? 'div';

  return (
    <Component className={clsx(styles.layoutCard, className)} {...props}>
      {children}
    </Component>
  );
}

export default LayoutCard;
