import { defineConfig, type Plugin, type PreviewServer, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

/** Twemoji SVG filenames are codepoint-stable; cache forever. */
const TWEMOJI_CACHE_CONTROL = 'public, max-age=31536000, immutable';

const attachTwemojiCacheHeaders = (
  server: ViteDevServer | PreviewServer,
): void => {
  server.middlewares.use((req, res, next) => {
    if (req.url?.startsWith('/twemoji/')) {
      res.setHeader('Cache-Control', TWEMOJI_CACHE_CONTROL);
    }
    next();
  });
};

/** Path-scoped Cache-Control for self-hosted Twemoji assets in dev/preview. */
const twemojiCacheHeadersPlugin = (): Plugin => ({
  name: 'twemoji-cache-headers',
  configureServer: attachTwemojiCacheHeaders,
  configurePreviewServer: attachTwemojiCacheHeaders,
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), twemojiCacheHeadersPlugin()],
  server: {
    port: 8888,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
