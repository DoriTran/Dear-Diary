import { existsSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Copies Twemoji SVGs into `public/twemoji/` for self-hosted serving.
 *
 * Production cache guidance (hosting-platform config required):
 *   Path: `/twemoji/*.svg`
 *   Header: `Cache-Control: public, max-age=31536000, immutable`
 *
 * Filenames are emoji codepoints and only change when `@twemoji/svg` is bumped,
 * so immutable long-lived caching is safe. Vite dev/preview already apply this
 * header via the `twemoji-cache-headers` plugin in `vite.config.ts`.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const sourceDir = join(root, 'node_modules/@twemoji/svg');
const targetDir = join(root, 'public/twemoji');

if (!existsSync(sourceDir)) {
  console.warn(
    '[copy-twemoji-assets] @twemoji/svg not found in node_modules, skipping.',
  );
  process.exit(0);
}

mkdirSync(targetDir, { recursive: true });

const files = readdirSync(sourceDir).filter((file) => file.endsWith('.svg'));

for (const file of files) {
  copyFileSync(join(sourceDir, file), join(targetDir, file));
}

console.log(
  `[copy-twemoji-assets] Copied ${files.length} Twemoji SVGs to public/twemoji`,
);
