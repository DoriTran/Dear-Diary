import type { CSSProperties, FC, ImgHTMLAttributes } from 'react';

import {
  getCustomEmojiByShortcode,
  toCustomEmojiShortcode,
} from './customEmojis';

export type AdEmojiGlyphProps = {
  /** Native emoji or custom shortcode like `:Angry:`. */
  value: string;
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
  imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>;
};

/** Renders a native emoji glyph or a custom image-based shortcode. */
const AdEmojiGlyph: FC<AdEmojiGlyphProps> = ({
  value,
  className,
  imgClassName,
  style,
  imgProps,
}) => {
  const custom = getCustomEmojiByShortcode(value);

  if (custom) {
    const label = toCustomEmojiShortcode(custom);

    return (
      <img
        {...imgProps}
        src={custom.imgUrl}
        alt={label}
        title={label}
        className={imgClassName ?? className}
        style={style}
        draggable={false}
      />
    );
  }

  return (
    <span className={className} style={style}>
      {value}
    </span>
  );
};

export default AdEmojiGlyph;
