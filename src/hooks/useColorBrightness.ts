import { useMemo } from 'react';

export type ColorBrightness = 'light' | 'dark';

function getRgb(color: string): [number, number, number] | null {
  if (/^#([A-Fa-f0-9]{3})$/.test(color)) {
    const hex = color.slice(1);

    return [
      parseInt(hex[0] + hex[0], 16),
      parseInt(hex[1] + hex[1], 16),
      parseInt(hex[2] + hex[2], 16),
    ];
  }

  if (/^#([A-Fa-f0-9]{6})$/.test(color)) {
    return [
      parseInt(color.slice(1, 3), 16),
      parseInt(color.slice(3, 5), 16),
      parseInt(color.slice(5, 7), 16),
    ];
  }

  const rgbMatch = color.match(/^rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/i);

  if (rgbMatch) {
    return [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])];
  }

  return null;
}

function getBrightness(r: number, g: number, b: number): ColorBrightness {
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  return luminance > 0.5 ? 'light' : 'dark';
}

export function useColorBrightness(color?: string) {
  return useMemo(() => {
    if (!color) {
      return {
        brightness: 'light' as ColorBrightness,
        isLight: true,
        isDark: false,
        textColor: '#000',
      };
    }

    const rgb = getRgb(color);

    if (!rgb) {
      return {
        brightness: 'light' as ColorBrightness,
        isLight: true,
        isDark: false,
        textColor: '#000',
      };
    }

    const brightness = getBrightness(...rgb);

    return {
      brightness,
      isLight: brightness === 'light',
      isDark: brightness === 'dark',
      textColor: brightness === 'light' ? '#000' : '#fff',
    };
  }, [color]);
}
