export type TicketDecoratorConfig = {
  notchRadius: number;
  compactNotchRadius: number;
  notchSpacing: number;
  borderRadius: number;
  compactBorderRadius: number;
  compactHeightThreshold: number;
  tearControlWidth: number;
};

export const TICKET_DECORATOR_CONFIG: TicketDecoratorConfig = {
  notchRadius: 10,
  compactNotchRadius: 5,
  notchSpacing: 28,
  borderRadius: 14,
  compactBorderRadius: 6,
  compactHeightThreshold: 40,
  tearControlWidth: 85,
};

export const TICKET_DECORATOR_FILL =
  'color-mix(in srgb, var(--primary-light) 40%, var(--surface))';

export const TICKET_DECORATOR_STROKE =
  'color-mix(in srgb, var(--primary) 70%, var(--border-soft))';

export const TICKET_DECORATOR_STROKE_WIDTH = 2;

export const TICKET_DECORATOR_GHOST_FILL =
  'color-mix(in srgb, var(--primary-light) 18%, transparent)';

export const TICKET_DECORATOR_GHOST_STROKE =
  'color-mix(in srgb, var(--primary) 35%, transparent)';
