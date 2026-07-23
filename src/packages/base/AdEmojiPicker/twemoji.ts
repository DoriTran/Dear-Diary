import twemoji from 'twemoji';

const TWEMOJI_BASE_PATH = '/twemoji';

/** Twemoji asset filenames omit the `fe0f` variation selector codepoint. */
const stripVariationSelector = (unified: string): string =>
  unified
    .split('-')
    .filter((part) => part.toLowerCase() !== 'fe0f')
    .join('-');

/** Build the local Twemoji SVG path from a unified codepoint id, e.g. "1f600" or "1f1e6-1f1e8". */
export const unifiedToTwemojiSrc = (unified: string): string =>
  `${TWEMOJI_BASE_PATH}/${stripVariationSelector(unified.toLowerCase())}.svg`;

/** Build the local Twemoji SVG path from a raw native emoji glyph (unicode surrogate pairs). */
export const nativeToTwemojiSrc = (value: string): string =>
  unifiedToTwemojiSrc(twemoji.convert.toCodePoint(value));
