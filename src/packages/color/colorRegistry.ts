import type {
  ColorDefinition,
  ColorId,
  ColorPalette,
  CustomPalette,
  PresetColorId,
} from './types';

import { COLOR_PRESETS, PRESET_COLOR_IDS, PRESET_CATEGORIES } from './presets';

export const getPreset = (id: PresetColorId): ColorDefinition =>
  COLOR_PRESETS[id];

export const getPresetIds = (): PresetColorId[] => PRESET_COLOR_IDS;

export const getPresetsByCategory = () => PRESET_CATEGORIES;

export const isCustomColorId = (colorId: ColorId): boolean =>
  colorId.startsWith('custom:');

export const getCustomPaletteId = (colorId: ColorId): string | null =>
  isCustomColorId(colorId) ? colorId.slice('custom:'.length) : null;

export const isValidColorId = (
  colorId: string,
  customPalettes: Record<string, CustomPalette> = {},
): colorId is ColorId => {
  if (colorId in COLOR_PRESETS) {
    return true;
  }

  if (isCustomColorId(colorId as ColorId)) {
    const customId = getCustomPaletteId(colorId as ColorId);
    return Boolean(customId && customPalettes[customId]);
  }

  return false;
};

export const getColorName = (
  colorId: ColorId,
  customPalettes: Record<string, CustomPalette> = {},
): string => {
  if (isCustomColorId(colorId)) {
    const customId = getCustomPaletteId(colorId);

    if (customId && customPalettes[customId]) {
      return customPalettes[customId].name;
    }

    return 'Custom';
  }

  return COLOR_PRESETS[colorId as PresetColorId]?.name ?? 'Color';
};

export const getColorDefinition = (
  colorId: ColorId,
  customPalettes: Record<string, CustomPalette> = {},
): {
  name: string;
  personality?: string;
  icon?: string;
  light: ColorPalette;
  dark: ColorPalette;
} | null => {
  if (isCustomColorId(colorId)) {
    const customId = getCustomPaletteId(colorId);
    const palette = customId ? customPalettes[customId] : null;

    if (!palette) {
      return null;
    }

    return {
      name: palette.name,
      light: palette.light,
      dark: palette.dark,
    };
  }

  const preset = COLOR_PRESETS[colorId as PresetColorId];

  if (!preset) {
    return null;
  }

  return {
    name: preset.name,
    personality: preset.personality,
    icon: preset.icon,
    light: preset.light,
    dark: preset.dark,
  };
};
