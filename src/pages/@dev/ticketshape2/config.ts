export type TicketShape2Config = {
  notchRadius: number;
  notchSpacing: number;
  tearOffset: number;
  borderRadius: number;
  tiltDeg: number;
};

export const DEFAULT_TICKET2_CONFIG: TicketShape2Config = {
  notchRadius: 10,
  notchSpacing: 28,
  tearOffset: 64,
  borderRadius: 14,
  tiltDeg: 3,
};

export const TICKET2_FILL = '#eef4f8';
export const TICKET2_BORDER = '#3d5a73';
export const TICKET2_BORDER_WIDTH = 2;
