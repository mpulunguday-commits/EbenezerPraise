
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';

// Manually define __dirname for ESM environment
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env vars regardless of the `VITE_` prefix.
    // Fix: Accessing cwd() on process by casting to any to satisfy the type checker.
    const env = loadEnv(mode, (process as any).cwd(), '');
    
    // Support both API_KEY and GEMINI_API_KEY for deployment flexibility
    const apiKey = env.API_KEY || env.GEMINI_API_KEY || "";

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(apiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(apiKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
