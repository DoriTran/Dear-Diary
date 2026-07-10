export type TicketShapeConfig = {
  notchRadius: number;
  notchSpacing: number;
  tearOffset: number;
  borderRadius: number;
  tiltDeg: number;
};

export const DEFAULT_TICKET_CONFIG: TicketShapeConfig = {
  notchRadius: 12,
  notchSpacing: 32,
  tearOffset: 56,
  borderRadius: 12,
  tiltDeg: 5,
};

export const TICKET_FILL = '#f5ebe0';
export const TICKET_BORDER = '#8b6914';
export const TICKET_BORDER_WIDTH = 2;
