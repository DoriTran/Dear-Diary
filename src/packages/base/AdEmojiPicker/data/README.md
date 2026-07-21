# Emoji dataset (vendored)

Copied from `emoji-picker-react` v4.x published data (`dist/data/emojis-en.json`)
so we do not deep-import the package at runtime.

- `emojis-en.json` — category metadata + emoji entries (`n` names, `u` unified, `a` added-in, optional `v` skin variants)
- `categories.ts` — display labels + nav order
- `utils.ts` — `unifiedToNative`, search helper

Update by re-copying the JSON from a known package version when needed; do not import from `node_modules` paths in app code.
