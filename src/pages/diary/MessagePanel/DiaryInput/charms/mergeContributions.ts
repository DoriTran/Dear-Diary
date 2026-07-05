import type { CSSProperties } from 'react';

import type {
  Charm,
  CharmRegion,
  MergedPipeline,
  StyleContribution,
} from './charm.types';

type IndexedStyleContribution = StyleContribution & { index: number };

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
  const regionElements: MergedPipeline['regionElements'] = {};
  const interactions: MergedPipeline['interactions'] = [];
  const runtimes: MergedPipeline['runtimes'] = [];
  let styleIndex = 0;

  for (const charm of charms) {
    if (charm.styles) {
      for (const style of charm.styles) {
        const indexed: IndexedStyleContribution = {
          ...style,
          index: styleIndex++,
        };

        if (style.target === 'container') {
          containerStyleEntries.push(indexed);
        } else {
          const region = style.target;
          regionStyleEntries[region] ??= [];
          regionStyleEntries[region].push(indexed);
        }
      }
    }

    if (charm.elements) {
      for (const element of charm.elements) {
        regionElements[element.region] ??= [];
        regionElements[element.region]!.push(element);
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

  const regionStyles: Partial<Record<CharmRegion, CSSProperties>> = {};

  for (const region of Object.keys(regionStyleEntries) as CharmRegion[]) {
    const entries = regionStyleEntries[region];
    if (entries?.length) {
      regionStyles[region] = mergeStylesForTarget(entries);
    }
  }

  return {
    containerStyles: mergeStylesForTarget(containerStyleEntries),
    regionStyles,
    regionElements,
    interactions,
    runtimes,
  };
};
