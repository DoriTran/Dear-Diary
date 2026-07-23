import {
  useState,
  type CSSProperties,
  type FC,
  type ImgHTMLAttributes,
} from 'react';

import {
  getCustomEmojiByShortcode,
  toCustomEmojiShortcode,
} from './customEmojis';
import { nativeToTwemojiSrc } from './twemoji';

export type AdEmojiGlyphProps = {
  /** Native emoji or custom shortcode like `:Angry:`. */
  value: string;
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
  imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>;
};

/** Renders a native emoji as a Twemoji SVG (with unicode text fallback) or a custom image-based shortcode. */
const AdEmojiGlyph: FC<AdEmojiGlyphProps> = ({
  value,
  className,
  imgClassName,
  style,
  imgProps,
}) => {
  const [twemojiFailed, setTwemojiFailed] = useState(false);
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
        loading="lazy"
        decoding="async"
      />
    );
  }

  if (!twemojiFailed) {
    return (
      <img
        {...imgProps}
        src={nativeToTwemojiSrc(value)}
        alt={value}
        title={value}
        className={imgClassName ?? className}
        style={style}
        draggable={false}
        loading="lazy"
        decoding="async"
        onError={() => setTwemojiFailed(true)}
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
