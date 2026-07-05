import type { ColorId, PresetColorId } from './types';

import { colorDistance, normalizeHex } from './colorUtils';
import { COLOR_PRESETS, DEFAULT_COLOR_ID } from './presets';

const isPresetColorId = (value: string): value is PresetColorId =>
  value in COLOR_PRESETS;

export const migrateHexToColorId = (hex: string): ColorId => {
  const normalized = normalizeHex(hex);

  let closest: PresetColorId = DEFAULT_COLOR_ID;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const preset of Object.values(COLOR_PRESETS)) {
    const distance = colorDistance(normalized, preset.light.main);

    if (distance < closestDistance) {
      closestDistance = distance;
      closest = preset.id;
    }
  }

  return closest;
};

export const normalizeColorId = (
  value: string | undefined | null,
  customPalettes: Record<string, { id: string }> = {},
): ColorId => {
  if (!value) {
    return DEFAULT_COLOR_ID;
  }

  if (isPresetColorId(value)) {
    return value;
  }

  if (value.startsWith('custom:')) {
    const customId = value.slice('custom:'.length);

    if (customPalettes[customId]) {
      return value as ColorId;
    }
  }

  if (value.startsWith('#')) {
    return migrateHexToColorId(value);
  }

  return DEFAULT_COLOR_ID;
};

export const toCustomColorId = (id: string): ColorId => `custom:${id}`;
