import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'fix-window-fetch',
        transformIndexHtml(html) {
          return html.replace(
            '<head>',
            `<head>
            <script>
              (function() {
                function fixFetch(obj) {
                  if (!obj) return;
                  try {
                    var originalFetch = obj.fetch;
                    Object.defineProperty(obj, 'fetch', {
                      get: function() { return originalFetch; },
                      set: function(v) { 
                        console.warn('Something tried to overwrite fetch, ignoring');
                      },
                      configurable: true,
                      enumerable: true
                    });
                  } catch (e) {
                    console.warn('fixFetch failed', e);
                  }
                }
                fixFetch(window);
                fixFetch(globalThis);
                if (typeof global !== 'undefined') fixFetch(global);
                if (typeof Window !== 'undefined' && Window.prototype) fixFetch(Window.prototype);
              })();
            </script>`
          );
        }
      }
    ],
    resolve: {
      alias: [
        { find: 'formdata-polyfill', replacement: path.resolve(__dirname, 'empty-module.js') },
        { find: 'whatwg-fetch', replacement: path.resolve(__dirname, 'empty-module.js') },
        { find: 'node-fetch', replacement: path.resolve(__dirname, 'empty-module.js') },
        { find: 'undici', replacement: path.resolve(__dirname, 'empty-module.js') },
        { find: 'fetch-blob', replacement: path.resolve(__dirname, 'empty-module.js') },
        { find: 'node-domexception', replacement: path.resolve(__dirname, 'empty-module.js') },
        { find: 'cross-fetch', replacement: path.resolve(__dirname, 'empty-module.js') },
        { find: 'isomorphic-fetch', replacement: path.resolve(__dirname, 'empty-module.js') },
        { find: /^formdata-polyfill(\/.*)?$/, replacement: path.resolve(__dirname, 'empty-module.js') },
        { find: /^node-fetch(\/.*)?$/, replacement: path.resolve(__dirname, 'empty-module.js') },
        { find: /^whatwg-fetch(\/.*)?$/, replacement: path.resolve(__dirname, 'empty-module.js') },
        { find: /^undici(\/.*)?$/, replacement: path.resolve(__dirname, 'empty-module.js') },
        { find: /^fetch-blob(\/.*)?$/, replacement: path.resolve(__dirname, 'empty-module.js') },
        { find: /^node-domexception(\/.*)?$/, replacement: path.resolve(__dirname, 'empty-module.js') },
        { find: /^cross-fetch(\/.*)?$/, replacement: path.resolve(__dirname, 'empty-module.js') },
        { find: /^isomorphic-fetch(\/.*)?$/, replacement: path.resolve(__dirname, 'empty-module.js') },
        { find: '@', replacement: path.resolve(__dirname, '.') },
      ],
    },
    optimizeDeps: {
      include: ['@google/genai', 'p-retry'],
      exclude: ['formdata-polyfill', 'whatwg-fetch', 'node-fetch', 'undici', 'fetch-blob', 'node-domexception', 'cross-fetch', 'isomorphic-fetch'],
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/flutter_app/**', '**/dist/**', '**/.git/**', '**/build/**']
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor-react';
              }
              if (id.includes('@editorjs')) {
                return 'vendor-editorjs';
              }
              if (id.includes('lucide-react') || id.includes('motion') || id.includes('canvas-confetti')) {
                return 'vendor-ui';
              }
              if (id.includes('@supabase')) {
                return 'vendor-supabase';
              }
            }
          }
        }
      }
    }
  };
});
