import clsx from 'clsx';
import { Fragment, type FC, type ReactNode } from 'react';

import type { MessageDecorator } from '@/store/diary/type';

import type { ComposerDraft } from '../../input/composer.types';
import type {
  ComposerContext,
  OutsideCharmRegion,
} from '../charms/charm.types';

import { useComposerContext } from '../charms/buildComposerContext';
import { useCharmPipeline } from '../charms/useCharmPipeline';
import { useDecoratorRuntime } from '../charms/useDecoratorRuntime';
import ComposerSurface from '../ComposerSurface/ComposerSurface';
import styles from './DecoratedSurface.module.css';

export type DecoratedSurfaceProps = {
  draft: ComposerDraft;
  composing: boolean;
  borderless?: boolean;
  children: ReactNode;
  updateDecorator: (index: number, decoration: MessageDecorator) => void;
  updateDraft: (updater: (draft: ComposerDraft) => ComposerDraft) => void;
};

const renderOutsideRegionElements = (
  region: OutsideCharmRegion,
  ctx: ComposerContext,
  pipeline: ReturnType<typeof useCharmPipeline>,
) => {
  const elements = pipeline.outsideRegionElements[region];
  if (!elements?.length) {
    return null;
  }

  return elements.map((element) => (
    <Fragment key={`outside-${region}-${element.order}`}>
      {element.render(ctx)}
    </Fragment>
  ));
};

const DecoratedSurface: FC<DecoratedSurfaceProps> = ({
  draft,
  composing,
  borderless = false,
  children,
  updateDecorator,
  updateDraft,
}) => {
  const ctx = useComposerContext({
    draft,
    composing,
    updateDecorator,
    updateDraft,
  });

  const pipeline = useCharmPipeline(draft.decorators, ctx);
  const hasOutsideLeft = Boolean(pipeline.outsideRegionElements.left?.length);

  useDecoratorRuntime({
    ctx,
    runtimes: pipeline.runtimes,
  });

  const surfaceClass = clsx(
    composing ? styles.surfaceCard : styles.surfacePassThrough,
  );

  const content = (
    <div className={surfaceClass}>
      <ComposerSurface pipeline={pipeline} ctx={ctx} borderless={borderless}>
        {children}
      </ComposerSurface>
    </div>
  );

  if (!hasOutsideLeft) {
    return content;
  }

  return (
    <div className={styles.shell}>
      <div
        className={styles.outsideLeft}
        style={pipeline.outsideRegionStyles.left}
      >
        {renderOutsideRegionElements('left', ctx, pipeline)}
      </div>
      {content}
    </div>
  );
};

export default DecoratedSurface;
