/**
 * Environment configuration with startup validation
 *
 * WHY A WRAPPER:
 * 1. Fail fast - app crashes immediately if env var missing (not later in API call)
 * 2. Single import - `import { env } from '@/core/config'`
 * 3. Derived values - can compute URLs, add defaults
 *
 * TYPES: Defined in src/vite-env.d.ts (no duplication here)
 */

// Validate required env vars exist at startup
const requiredVars = ['VITE_TMDB_API_KEY', 'VITE_TMDB_BASE_URL'] as const;

for (const key of requiredVars) {
  if (!import.meta.env[key]) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
        'Make sure you have a .env file with all required variables.'
    );
  }
}

// Export validated env vars
export const env = {
  tmdb: {
    apiKey: import.meta.env.VITE_TMDB_API_KEY,
    baseUrl: import.meta.env.VITE_TMDB_BASE_URL,
  },
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
