import type { ComponentType } from 'react';

import BrushHighlightDev from './brushhighlight';
import DragDropSortableDev from './dragdropsortable';

export type DevTestEntry = {
  key: string;
  displayName: string;
  component: ComponentType;
};

export const devTests: readonly DevTestEntry[] = [
  {
    key: 'dragdropsortable',
    displayName: 'dragdropsortable (useScrollOffset)',
    component: DragDropSortableDev,
  },
  {
    key: 'brushhighlight',
    displayName: 'BrushHighlight',
    component: BrushHighlightDev,
  },
] as const;

export type DevTestKey = (typeof devTests)[number]['key'];

export const getDevTestByKey = (key: string): DevTestEntry | undefined =>
  devTests.find((t) => t.key === key);

export const getDevTestByIndex = (id: number): DevTestEntry | undefined => {
  if (!Number.isFinite(id) || id < 1 || id > devTests.length) return undefined;
  return devTests[id - 1];
};

export const resolveActiveDevTest = (params: {
  test: string | null;
  id: string | null;
}): DevTestEntry | undefined => {
  const { test, id } = params;
  if (test) return getDevTestByKey(test);
  if (id) return getDevTestByIndex(Number(id));
  return undefined;
};
