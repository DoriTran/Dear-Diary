import type { CSSProperties } from 'react';

import type {
  Charm,
  CharmRegion,
  MergedPipeline,
  OutsideCharmRegion,
  StyleContribution,
} from './charm.types';

type IndexedStyleContribution = StyleContribution & { index: number };

const OUTSIDE_REGIONS = new Set<OutsideCharmRegion>([
  'left',
  'right',
  'top',
  'bottom',
]);

const isOutsideCharmRegion = (
  region: CharmRegion,
): region is OutsideCharmRegion =>
  OUTSIDE_REGIONS.has(region as OutsideCharmRegion);

const mergeStylesForTarget = (
  contributions: IndexedStyleContribution[],
): CSSProperties => {
  const sorted = [...contributions].sort((a, b) => {
    const priorityDiff = (a.priority ?? 0) - (b.priority ?? 0);
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return a.index - b.index;
  });

  return sorted.reduce<CSSProperties>(
    (merged, contribution) => ({ ...merged, ...contribution.styles }),
    {},
  );
};

export const mergeContributions = (charms: Charm[]): MergedPipeline => {
  const containerStyleEntries: IndexedStyleContribution[] = [];
  const regionStyleEntries: Partial<
    Record<CharmRegion, IndexedStyleContribution[]>
  > = {};
  const outsideRegionStyleEntries: Partial<
    Record<OutsideCharmRegion, IndexedStyleContribution[]>
  > = {};
  const regionElements: MergedPipeline['regionElements'] = {};
  const outsideRegionElements: MergedPipeline['outsideRegionElements'] = {};
  const interactions: MergedPipeline['interactions'] = [];
  const runtimes: MergedPipeline['runtimes'] = [];
  let styleIndex = 0;

  for (const charm of charms) {
    const placement = charm.placement ?? 'inside';

    if (charm.styles) {
      for (const style of charm.styles) {
        const indexed: IndexedStyleContribution = {
          ...style,
          index: styleIndex++,
        };

        if (style.target === 'container') {
          containerStyleEntries.push(indexed);
        } else if (
          placement === 'outside' &&
          isOutsideCharmRegion(style.target)
        ) {
          outsideRegionStyleEntries[style.target] ??= [];
          outsideRegionStyleEntries[style.target]!.push(indexed);
        } else {
          const region = style.target;
          regionStyleEntries[region] ??= [];
          regionStyleEntries[region].push(indexed);
        }
      }
    }

    if (charm.elements) {
      for (const element of charm.elements) {
        if (placement === 'outside' && isOutsideCharmRegion(element.region)) {
          outsideRegionElements[element.region] ??= [];
          outsideRegionElements[element.region]!.push(element);
        } else {
          regionElements[element.region] ??= [];
          regionElements[element.region]!.push(element);
        }
      }
    }

    if (charm.interactions) {
      interactions.push(...charm.interactions);
    }

    if (charm.runtime) {
      runtimes.push(charm.runtime);
    }
  }

  for (const region of Object.keys(regionElements) as CharmRegion[]) {
    regionElements[region]?.sort((a, b) => a.order - b.order);
  }

  for (const region of Object.keys(
    outsideRegionElements,
  ) as OutsideCharmRegion[]) {
    outsideRegionElements[region]?.sort((a, b) => a.order - b.order);
  }

  const regionStyles: Partial<Record<CharmRegion, CSSProperties>> = {};

  for (const region of Object.keys(regionStyleEntries) as CharmRegion[]) {
    const entries = regionStyleEntries[region];
    if (entries?.length) {
      regionStyles[region] = mergeStylesForTarget(entries);
    }
  }

  const outsideRegionStyles: Partial<
    Record<OutsideCharmRegion, CSSProperties>
  > = {};

  for (const region of Object.keys(
    outsideRegionStyleEntries,
  ) as OutsideCharmRegion[]) {
    const entries = outsideRegionStyleEntries[region];
    if (entries?.length) {
      outsideRegionStyles[region] = mergeStylesForTarget(entries);
    }
  }

  return {
    containerStyles: mergeStylesForTarget(containerStyleEntries),
    regionStyles,
    regionElements,
    outsideRegionStyles,
    outsideRegionElements,
    interactions,
    runtimes,
  };
};
