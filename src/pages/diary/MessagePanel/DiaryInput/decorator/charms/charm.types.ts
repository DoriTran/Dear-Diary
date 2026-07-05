import type { CSSProperties, ReactNode } from 'react';

import type {
  Attachment,
  TimerDecorator,
  MessageDecorator,
  MessageVariant,
  TicketDecorator,
} from '@/store/diary/type';

import type { ComposerDraft } from '../../input/composer.types';

export type CharmRegion =
  | 'header'
  | 'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'footer'
  | 'overlay'
  | 'container';

export type StyleTarget = 'container' | CharmRegion;

export type StyleContribution = {
  target: StyleTarget;
  priority?: number;
  styles: CSSProperties;
};

export type ElementContribution = {
  region: CharmRegion;
  order: number;
  render: (ctx: ComposerContext) => ReactNode;
};

export type InteractionContribution = {
  target: StyleTarget;
  mount: (ctx: ComposerContext, element: HTMLElement) => void | (() => void);
};

export type RuntimeContribution = {
  decoratorType: MessageDecorator['type'];
  shouldTick: (ctx: ComposerContext, decoration: MessageDecorator) => boolean;
  tick: (decoration: MessageDecorator, now: number) => MessageDecorator;
};

export type Charm = {
  id: string;
  region: CharmRegion;
  order: number;
  styles?: StyleContribution[];
  elements?: ElementContribution[];
  interactions?: InteractionContribution[];
  runtime?: RuntimeContribution;
};

export type ComposerRelationship =
  | { type: 'reply'; messageId: string }
  | { type: 'forward'; messageId: string };

export type ComposerEvent = {
  decorator: MessageDecorator['type'];
  action: string;
  payload?: unknown;
};

export type ComposerContext = {
  draft: ComposerDraft;
  variant: MessageVariant;
  decorators: MessageDecorator[];
  attachments: Attachment[];
  relationships: ComposerRelationship[];
  composing: boolean;
  updateDecorator: (index: number, decoration: MessageDecorator) => void;
  updateDraft: (updater: (draft: ComposerDraft) => ComposerDraft) => void;
  emit: (event: ComposerEvent) => void;
};

export type DecoratorEventHandler = (
  ctx: ComposerContext,
  decoratorIndex: number,
  decoration: MessageDecorator,
  payload?: unknown,
) => void;

export type DecoratorDefinition = {
  createCharms: (
    decoration: MessageDecorator,
    decoratorIndex: number,
    ctx: ComposerContext,
  ) => Charm[];
  handleEvent?: Record<string, DecoratorEventHandler>;
};

export type MergedRegionElements = Partial<
  Record<CharmRegion, ElementContribution[]>
>;

export type MergedPipeline = {
  containerStyles: CSSProperties;
  regionStyles: Partial<Record<CharmRegion, CSSProperties>>;
  regionElements: MergedRegionElements;
  interactions: InteractionContribution[];
  runtimes: RuntimeContribution[];
};

export type TimerDecoratorState = TimerDecorator;
export type TicketDecoratorState = TicketDecorator;
