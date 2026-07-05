export { default as DecoratedSurface } from './DecoratedSurface/DecoratedSurface';
export type { DecoratedSurfaceProps } from './DecoratedSurface/DecoratedSurface';
export { default as ComposerSurface } from './ComposerSurface/ComposerSurface';
export {
  getDecoratorDefinition,
  handleDecoratorEvent,
} from './decoratorRegistry';
export {
  createDefaultTimerDecorator,
  defaultTimerTargetDate,
  formatTimerDisplay,
  getTimerDisplayText,
  getTimerRemainingMs,
  tickTimerDecorator,
} from './timer/timer.utils';
