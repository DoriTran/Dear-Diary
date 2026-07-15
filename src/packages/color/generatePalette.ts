import type { ColorPalette } from './types';

import { hexToHsl, hslToHex, normalizeHex } from './colorUtils';

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const buildLightPalette = (baseHex: string): ColorPalette => {
  const { h, s, l } = hexToHsl(baseHex);

  return {
    soft: hslToHex(h, clamp(s * 0.55, 18, 72), clamp(l + 28, 88, 96)),
    main: normalizeHex(baseHex),
    strong: hslToHex(h, clamp(s * 1.05, 35, 85), clamp(l - 18, 28, 58)),
  };
};

const buildDarkPalette = (baseHex: string): ColorPalette => {
  const { h, s } = hexToHsl(baseHex);

  return {
    soft: hslToHex(h, clamp(s * 0.45, 16, 55), 22),
    main: hslToHex(h, clamp(s * 0.75, 28, 70), 68),
    strong: hslToHex(h, clamp(s * 0.65, 24, 65), 90),
  };
};

export const generatePaletteFromBase = (
  baseHex: string,
): { light: ColorPalette; dark: ColorPalette } => {
  const normalized = normalizeHex(baseHex);

  return {
    light: buildLightPalette(normalized),
    dark: buildDarkPalette(normalized),
  };
};
