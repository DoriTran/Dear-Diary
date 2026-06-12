import { useEffect, useMemo } from 'react';

import { useAppStore } from '@/store';

import type { DiaryFilterTab } from '../types';
import type { SidebarRow } from './sidebar.types';

import { filterSidebarViews, getMatchingGroupIds } from './sidebarFilter.utils';
import { useSidebarRowViews } from './useSidebarRowViews';

export const useFilteredSidebarRowViews = (
  rows: readonly SidebarRow[],
  searchQuery: string,
  filterTab: DiaryFilterTab,
) => {
  const expandGroup = useAppStore('expandGroup');
  const rowViews = useSidebarRowViews(rows);

  const filteredViews = useMemo(
    () => filterSidebarViews(rowViews, searchQuery, filterTab),
    [rowViews, searchQuery, filterTab],
  );

  useEffect(() => {
    const matchingGroupIds = getMatchingGroupIds(rowViews, searchQuery);

    matchingGroupIds.forEach((groupId) => {
      expandGroup(groupId);
    });
  }, [expandGroup, rowViews, searchQuery]);

  return filteredViews;
};
