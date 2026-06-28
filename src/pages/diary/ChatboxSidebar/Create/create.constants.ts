import { DEFAULT_ICON_ID, normalizeIconId, type IconId } from '@/packages/icon';

export { DEFAULT_ICON_ID as CREATE_DEFAULT_ICON_ID };

export const resolveCreateIconId = (icon: string): IconId =>
  normalizeIconId(icon);
