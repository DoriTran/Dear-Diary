import {
  Car,
  Cat,
  Clock,
  Flag,
  Heart,
  Music,
  Search,
  Shirt,
  Smile,
  Sparkles,
  Trophy,
  Utensils,
} from 'lucide-react';
import {
  useDeferredValue,
  useMemo,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from 'react';

import moodSticker from '@/assets/decoration/Emoji 1.png';
import { useAppStore } from '@/store';

import styles from './AdEmojiPicker.module.css';
import {
  AD_CUSTOM_EMOJIS,
  getCustomEmojiByShortcode,
  toCustomEmojiShortcode,
  type AdCustomEmoji,
} from './customEmojis';
import {
  EMOJI_CATEGORY_LABELS,
  EMOJI_CATEGORY_ORDER,
  FREQUENT_EMOJI_UNIFIED,
  applySkinTone,
  filterEmojisByQuery,
  getAllStandardEmojis,
  getEmojisByCategory,
  getStandardEmojiEntry,
  readStoredSkinTone,
  unifiedToNative,
  writeStoredSkinTone,
  type EmojiCategoryId,
  type EmojiEntry,
  type SkinToneId,
} from './data';
import EmojiTile from './EmojiTile';
import SkinTonePicker from './SkinTonePicker';

export type AdEmojiPickerPanelProps = {
  onSelect: (value: string) => void;
  width?: number;
  height?: number;
};

export const DEFAULT_PICKER_WIDTH = 360;
export const DEFAULT_PICKER_HEIGHT = 400;

type PrefTile =
  | { kind: 'native'; id: string; entry: EmojiEntry }
  | { kind: 'custom'; id: string; emoji: AdCustomEmoji };

const NAV_CATEGORIES: Array<{
  id: EmojiCategoryId;
  label: string;
  icon: ReactNode;
}> = [
  { id: 'suggested', label: 'Frequently Used', icon: <Clock size={16} /> },
  { id: 'custom', label: 'Custom Emojis', icon: <Sparkles size={16} /> },
  {
    id: 'smileys_people',
    label: 'Smileys & People',
    icon: <Smile size={16} />,
  },
  { id: 'animals_nature', label: 'Animals & Nature', icon: <Cat size={16} /> },
  { id: 'food_drink', label: 'Food & Drink', icon: <Utensils size={16} /> },
  { id: 'travel_places', label: 'Travel & Places', icon: <Car size={16} /> },
  { id: 'activities', label: 'Activities', icon: <Trophy size={16} /> },
  { id: 'objects', label: 'Objects', icon: <Shirt size={16} /> },
  { id: 'symbols', label: 'Symbols', icon: <Music size={16} /> },
  { id: 'flags', label: 'Flags', icon: <Flag size={16} /> },
];

const resolvePrefId = (id: string): PrefTile | null => {
  const custom = getCustomEmojiByShortcode(id);
  if (custom) {
    return { kind: 'custom', id, emoji: custom };
  }

  const entry = getStandardEmojiEntry(id);
  if (entry) {
    return { kind: 'native', id, entry };
  }

  return null;
};

const resolvePrefIds = (ids: readonly string[]): PrefTile[] =>
  ids
    .map(resolvePrefId)
    .filter((tile): tile is PrefTile => tile !== null);

const presetFrequentTiles = (): PrefTile[] =>
  resolvePrefIds(FREQUENT_EMOJI_UNIFIED);

const AdEmojiPickerPanel: FC<AdEmojiPickerPanelProps> = ({
  onSelect,
  width = DEFAULT_PICKER_WIDTH,
  height = DEFAULT_PICKER_HEIGHT,
}) => {
  const emojiPickerPrefs = useAppStore('emojiPickerPrefs');
  const addFrequentEmoji = useAppStore('addFrequentEmoji');
  const toggleFavoriteEmoji = useAppStore('toggleFavoriteEmoji');

  const [query, setQuery] = useState('');
  const [skinTone, setSkinTone] = useState<SkinToneId>(() =>
    readStoredSkinTone(),
  );
  const [activeCategory, setActiveCategory] =
    useState<EmojiCategoryId>('suggested');
  const deferredQuery = useDeferredValue(query);
  const bodyRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<
    Partial<Record<EmojiCategoryId, HTMLElement | null>>
  >({});

  const frequentTiles = useMemo(() => {
    if (emojiPickerPrefs.frequent.length === 0) {
      return presetFrequentTiles();
    }

    return resolvePrefIds(emojiPickerPrefs.frequent);
  }, [emojiPickerPrefs.frequent]);

  const favoriteTiles = useMemo(
    () => resolvePrefIds(emojiPickerPrefs.favorites),
    [emojiPickerPrefs.favorites],
  );

  const isSearching = deferredQuery.trim().length > 0;

  const searchResults = useMemo(() => {
    if (!isSearching) {
      return null;
    }

    const standard = filterEmojisByQuery(getAllStandardEmojis(), deferredQuery);
    const custom = AD_CUSTOM_EMOJIS.filter((emoji) =>
      emoji.names.some((name) =>
        name.toLowerCase().includes(deferredQuery.trim().toLowerCase()),
      ),
    );

    return { standard, custom };
  }, [deferredQuery, isSearching]);

  const handleSkinToneChange = (tone: SkinToneId) => {
    setSkinTone(tone);
    writeStoredSkinTone(tone);
  };

  const scrollToCategory = (categoryId: EmojiCategoryId) => {
    setActiveCategory(categoryId);
    const node = sectionRefs.current[categoryId];
    node?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNativeSelect = (entry: EmojiEntry) => {
    addFrequentEmoji(entry.u);
    onSelect(applySkinTone(entry, skinTone));
  };

  const handleCustomSelect = (emoji: AdCustomEmoji) => {
    const shortcode = toCustomEmojiShortcode(emoji);
    addFrequentEmoji(shortcode);
    onSelect(shortcode);
  };

  const handleToggleNativeFavorite = (entry: EmojiEntry) => {
    toggleFavoriteEmoji(entry.u);
  };

  const handleToggleCustomFavorite = (emoji: AdCustomEmoji) => {
    toggleFavoriteEmoji(toCustomEmojiShortcode(emoji));
  };

  const handlePrefSelect = (tile: PrefTile) => {
    if (tile.kind === 'native') {
      handleNativeSelect(tile.entry);
      return;
    }

    handleCustomSelect(tile.emoji);
  };

  const handlePrefToggleFavorite = (tile: PrefTile) => {
    if (tile.kind === 'native') {
      handleToggleNativeFavorite(tile.entry);
      return;
    }

    handleToggleCustomFavorite(tile.emoji);
  };

  const renderPrefTile = (tile: PrefTile) => {
    if (tile.kind === 'native') {
      return (
        <EmojiTile
          key={tile.id}
          ariaLabel={tile.entry.n[tile.entry.n.length - 1] ?? tile.entry.u}
          onSelect={() => handlePrefSelect(tile)}
          onToggleFavorite={() => handlePrefToggleFavorite(tile)}
        >
          <span className={styles.emojiGlyph}>
            {applySkinTone(tile.entry, skinTone)}
          </span>
        </EmojiTile>
      );
    }

    return (
      <EmojiTile
        key={tile.id}
        ariaLabel={tile.emoji.names[0] ?? tile.emoji.id}
        onSelect={() => handlePrefSelect(tile)}
        onToggleFavorite={() => handlePrefToggleFavorite(tile)}
      >
        <img
          className={styles.customImg}
          src={tile.emoji.imgUrl}
          alt=""
          draggable={false}
        />
      </EmojiTile>
    );
  };

  return (
    <div
      className={styles.root}
      style={{
        width: `min(${width}px, calc(100vw - 1.5rem))`,
        maxHeight: height,
      }}
    >
      <div className={styles.header}>
        <div className={styles.searchRow}>
          <label className={styles.searchField}>
            <Search size={14} className={styles.searchIcon} aria-hidden />
            <input
              className={styles.searchInput}
              value={query}
              placeholder="Search emoji..."
              aria-label="Search emoji"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <SkinTonePicker value={skinTone} onChange={handleSkinToneChange} />
        </div>

        {!isSearching ? (
          <div
            className={styles.categoryNav}
            role="tablist"
            aria-label="Emoji categories"
          >
            {NAV_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === category.id}
                aria-label={category.label}
                className={styles.categoryBtn}
                data-active={activeCategory === category.id || undefined}
                onClick={() => scrollToCategory(category.id)}
              >
                {category.icon}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className={styles.body} ref={bodyRef}>
        <div className={styles.bodyInner}>
          {isSearching && searchResults ? (
            <>
              {searchResults.custom.length > 0 ? (
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <p className={styles.sectionLabel}>Custom Emojis</p>
                  </div>
                  <div className={styles.grid}>
                    {searchResults.custom.map((emoji) => (
                      <EmojiTile
                        key={emoji.id}
                        ariaLabel={emoji.names[0] ?? emoji.id}
                        onSelect={() => handleCustomSelect(emoji)}
                        onToggleFavorite={() =>
                          handleToggleCustomFavorite(emoji)
                        }
                      >
                        <img
                          className={styles.customImg}
                          src={emoji.imgUrl}
                          alt=""
                          draggable={false}
                        />
                      </EmojiTile>
                    ))}
                  </div>
                </section>
              ) : null}
              {searchResults.standard.length > 0 ? (
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <p className={styles.sectionLabel}>Results</p>
                  </div>
                  <div className={styles.grid}>
                    {searchResults.standard.map((entry) => (
                      <EmojiTile
                        key={entry.u}
                        ariaLabel={entry.n[entry.n.length - 1] ?? entry.u}
                        onSelect={() => handleNativeSelect(entry)}
                        onToggleFavorite={() =>
                          handleToggleNativeFavorite(entry)
                        }
                      >
                        <span className={styles.emojiGlyph}>
                          {unifiedToNative(entry.u)}
                        </span>
                      </EmojiTile>
                    ))}
                  </div>
                </section>
              ) : null}
              {searchResults.custom.length === 0 &&
              searchResults.standard.length === 0 ? (
                <p className={styles.empty}>No emojis found</p>
              ) : null}
            </>
          ) : (
            <>
              <section
                className={styles.section}
                ref={(node) => {
                  sectionRefs.current.suggested = node;
                }}
              >
                <div className={styles.sectionHeader}>
                  <p className={styles.sectionLabel}>
                    {EMOJI_CATEGORY_LABELS.suggested}
                  </p>
                </div>
                <div className={styles.grid}>
                  {frequentTiles.map(renderPrefTile)}
                </div>
              </section>

              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <p className={styles.sectionLabel}>Favorites</p>
                  <Heart
                    size={12}
                    className={styles.sectionHeart}
                    aria-hidden
                  />
                </div>
                {favoriteTiles.length === 0 ? (
                  <p className={styles.favoriteHint}>
                    Right-click an emoji to pin or unpin it here.
                    <span className={styles.favoriteHintTouch}>
                      On touch devices, press and hold.
                    </span>
                  </p>
                ) : (
                  <div className={styles.grid}>
                    {favoriteTiles.map(renderPrefTile)}
                  </div>
                )}
              </section>

              <section
                className={styles.section}
                ref={(node) => {
                  sectionRefs.current.custom = node;
                }}
              >
                <div className={styles.sectionHeader}>
                  <p className={styles.sectionLabel}>
                    {EMOJI_CATEGORY_LABELS.custom}
                  </p>
                </div>
                <div className={styles.grid}>
                  {AD_CUSTOM_EMOJIS.map((emoji) => (
                    <EmojiTile
                      key={emoji.id}
                      ariaLabel={emoji.names[0] ?? emoji.id}
                      onSelect={() => handleCustomSelect(emoji)}
                      onToggleFavorite={() =>
                        handleToggleCustomFavorite(emoji)
                      }
                    >
                      <img
                        className={styles.customImg}
                        src={emoji.imgUrl}
                        alt=""
                        draggable={false}
                      />
                    </EmojiTile>
                  ))}
                </div>
              </section>

              {EMOJI_CATEGORY_ORDER.map((categoryId) => {
                const entries = getEmojisByCategory(categoryId);

                return (
                  <section
                    key={categoryId}
                    className={styles.section}
                    ref={(node) => {
                      sectionRefs.current[categoryId] = node;
                    }}
                  >
                    <div className={styles.sectionHeader}>
                      <p className={styles.sectionLabel}>
                        {EMOJI_CATEGORY_LABELS[categoryId]}
                      </p>
                    </div>
                    <div className={styles.grid}>
                      {entries.map((entry) => (
                        <EmojiTile
                          key={entry.u}
                          ariaLabel={entry.n[entry.n.length - 1] ?? entry.u}
                          onSelect={() => handleNativeSelect(entry)}
                          onToggleFavorite={() =>
                            handleToggleNativeFavorite(entry)
                          }
                        >
                          <span className={styles.emojiGlyph}>
                            {unifiedToNative(entry.u)}
                          </span>
                        </EmojiTile>
                      ))}
                    </div>
                  </section>
                );
              })}
            </>
          )}
        </div>
      </div>

      <div className={styles.footer} aria-hidden>
        <img
          className={styles.footerSticker}
          src={moodSticker}
          alt=""
          draggable={false}
        />
        <p className={styles.footerLabel}>What&apos;s Your Mood?</p>
      </div>
    </div>
  );
};

export default AdEmojiPickerPanel;
