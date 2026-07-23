import type { FC, ReactNode } from 'react';

import emojiRegex from 'emoji-regex';

import AdEmojiGlyph from './AdEmojiGlyph';
import styles from './AdEmojiText.module.css';
import { CUSTOM_EMOJI_SHORTCODE_RE } from './customEmojis';

export type AdEmojiTextProps = {
  text: string;
  className?: string;
  imgClassName?: string;
};

/** Matches either a `:Shortcode:` custom emoji or a native unicode emoji sequence. */
const buildEmojiPattern = (): RegExp => {
  // IMPORTANT: do NOT add the `u` flag. `emoji-regex`'s source is written for
  // non-unicode-mode RegExp; reconstructing it with `u` makes matches like 🤩 fail,
  // so AdEmojiText falls through to plain text and the OS (Microsoft) glyph shows.
  const emojiSource = emojiRegex().source;
  return new RegExp(`${CUSTOM_EMOJI_SHORTCODE_RE.source}|${emojiSource}`, 'g');
};

const renderEmojiText = (text: string, imgClassName: string): ReactNode[] => {
  const nodes: ReactNode[] = [];
  const pattern = buildEmojiPattern();
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    const token = match[0];

    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    nodes.push(
      <AdEmojiGlyph
        key={`emoji-${key++}`}
        value={token}
        imgClassName={imgClassName}
      />,
    );

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
};

/** Renders plain text with `:Angry:`-style custom emoji shortcodes and native unicode emoji as Twemoji/custom images. */
const AdEmojiText: FC<AdEmojiTextProps> = ({
  text,
  className,
  imgClassName = styles.inlineImg,
}) => {
  return (
    <span className={className}>{renderEmojiText(text, imgClassName)}</span>
  );
};

export default AdEmojiText;
