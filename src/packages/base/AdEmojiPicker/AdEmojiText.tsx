import type { FC, ReactNode } from 'react';

import AdEmojiGlyph from './AdEmojiGlyph';
import {
  CUSTOM_EMOJI_SHORTCODE_RE,
  getCustomEmojiByShortcode,
} from './customEmojis';

import styles from './AdEmojiText.module.css';

export type AdEmojiTextProps = {
  text: string;
  className?: string;
  imgClassName?: string;
};

const renderEmojiText = (
  text: string,
  imgClassName: string,
): ReactNode[] => {
  const nodes: ReactNode[] = [];
  const pattern = new RegExp(CUSTOM_EMOJI_SHORTCODE_RE.source, 'g');
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    const shortcode = match[0];

    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (getCustomEmojiByShortcode(shortcode)) {
      nodes.push(
        <AdEmojiGlyph
          key={`emoji-${key++}`}
          value={shortcode}
          imgClassName={imgClassName}
        />,
      );
    } else {
      nodes.push(shortcode);
    }

    lastIndex = match.index + shortcode.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
};

/** Renders plain text with `:Angry:`-style custom emoji shortcodes as images. */
const AdEmojiText: FC<AdEmojiTextProps> = ({
  text,
  className,
  imgClassName = styles.inlineImg,
}) => {
  if (!text.includes(':')) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>{renderEmojiText(text, imgClassName)}</span>
  );
};

export default AdEmojiText;
