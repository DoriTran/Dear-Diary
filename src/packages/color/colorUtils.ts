export const normalizeHex = (hex: string): string => {
  const cleaned = hex.trim().replace(/^#/, '');

  if (cleaned.length === 3) {
    return `#${cleaned
      .split('')
      .map((char) => `${char}${char}`)
      .join('')
      .toUpperCase()}`;
  }

  if (cleaned.length === 6) {
    return `#${cleaned.toUpperCase()}`;
  }

  return '#C7B2FF';
};

export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const normalized = normalizeHex(hex).slice(1);
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  return { r, g, b };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (value: number) =>
    Math.round(Math.min(255, Math.max(0, value)))
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const rgbToHsl = (
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  const l = (max + min) / 2;
  let s = 0;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case rn:
        h = ((gn - bn) / delta) % 6;
        break;
      case gn:
        h = (bn - rn) / delta + 2;
        break;
      default:
        h = (rn - gn) / delta + 4;
        break;
    }

    h *= 60;

    if (h < 0) {
      h += 360;
    }
  }

  return { h, s: s * 100, l: l * 100 };
};

export const hslToRgb = (
  h: number,
  s: number,
  l: number,
): { r: number; g: number; b: number } => {
  const sn = s / 100;
  const ln = l / 100;

  const chroma = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - chroma / 2;

  let rn = 0;
  let gn = 0;
  let bn = 0;

  if (h < 60) {
    rn = chroma;
    gn = x;
  } else if (h < 120) {
    rn = x;
    gn = chroma;
  } else if (h < 180) {
    gn = chroma;
    bn = x;
  } else if (h < 240) {
    gn = x;
    bn = chroma;
  } else if (h < 300) {
    rn = x;
    bn = chroma;
  } else {
    rn = chroma;
    bn = x;
  }

  return {
    r: (rn + m) * 255,
    g: (gn + m) * 255,
    b: (bn + m) * 255,
  };
};

export const hexToHsl = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
};

export const hslToHex = (h: number, s: number, l: number): string => {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
};

export const rgbToHsv = (
  r: number,
  g: number,
  b: number,
): { h: number; s: number; v: number } => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;

  if (delta !== 0) {
    if (max === rn) {
      h = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
      h = (bn - rn) / delta + 2;
    } else {
      h = (rn - gn) / delta + 4;
    }

    h *= 60;

    if (h < 0) {
      h += 360;
    }
  }

  return {
    h,
    s: max === 0 ? 0 : (delta / max) * 100,
    v: max * 100,
  };
};

export const hsvToRgb = (
  h: number,
  s: number,
  v: number,
): { r: number; g: number; b: number } => {
  const sn = s / 100;
  const vn = v / 100;
  const chroma = vn * sn;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vn - chroma;

  let rn = 0;
  let gn = 0;
  let bn = 0;

  if (h < 60) {
    rn = chroma;
    gn = x;
  } else if (h < 120) {
    rn = x;
    gn = chroma;
  } else if (h < 180) {
    gn = chroma;
    bn = x;
  } else if (h < 240) {
    gn = x;
    bn = chroma;
  } else if (h < 300) {
    rn = x;
    bn = chroma;
  } else {
    rn = chroma;
    bn = x;
  }

  return {
    r: (rn + m) * 255,
    g: (gn + m) * 255,
    b: (bn + m) * 255,
  };
};

export const hexToHsv = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsv(r, g, b);
};

export const hsvToHex = (h: number, s: number, v: number): string => {
  const { r, g, b } = hsvToRgb(h, s, v);
  return rgbToHex(r, g, b);
};

export const colorDistance = (hexA: string, hexB: string): number => {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);

  return Math.sqrt(
    (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2,
  );
};
