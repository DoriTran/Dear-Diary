export type TicketDecoratorConfig = {
  notchRadius: number;
  notchSpacing: number;
  borderRadius: number;
  tearControlWidth: number;
};

export const TICKET_DECORATOR_CONFIG: TicketDecoratorConfig = {
  notchRadius: 10,
  notchSpacing: 28,
  borderRadius: 14,
  tearControlWidth: 72,
};

export const TICKET_DECORATOR_FILL =
  'color-mix(in srgb, var(--primary-light) 40%, var(--surface))';

export const TICKET_DECORATOR_STROKE =
  'color-mix(in srgb, var(--primary) 70%, var(--border-soft))';

export const TICKET_DECORATOR_STROKE_WIDTH = 2;

export const TICKET_DECORATOR_TEAR_DASH = '4 4';
