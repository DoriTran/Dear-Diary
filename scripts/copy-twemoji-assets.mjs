import { existsSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

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
