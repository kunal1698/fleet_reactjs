import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Ensure API_URL starts with a slash
  const API_URL = `/${env.VITE_APP_BASE_NAME || ''}`;

  // Default port to 3000 if not defined in environment
  const PORT = env.VITE_APP_PORT || '3000';

  return {
    server: {
      open: true,
      port: PORT
    },
    define: {
      global: 'window'
    },
    alias: {
      './runtimeConfig': './runtimeConfig.browser'
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false
        },
        less: {
          charset: false
        }
      },
      charset: false,
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    },
    base: API_URL,
    plugins: [react(), jsconfigPaths()]
  };
});
