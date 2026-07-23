import emojiRegex from 'emoji-regex';
import type { FC, ReactNode } from 'react';

import AdEmojiGlyph from './AdEmojiGlyph';
import { CUSTOM_EMOJI_SHORTCODE_RE } from './customEmojis';

import styles from './AdEmojiText.module.css';

export type AdEmojiTextProps = {
  text: string;
  className?: string;
  imgClassName?: string;
};

/** Matches either a `:Shortcode:` custom emoji or a native unicode emoji sequence. */
const buildEmojiPattern = (): RegExp =>
  new RegExp(
    `${CUSTOM_EMOJI_SHORTCODE_RE.source}|${emojiRegex().source}`,
    'gu',
  );

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
