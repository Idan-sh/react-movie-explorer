/** Validated env vars; fails fast if required vars are missing. */

const requiredVars = [
  'VITE_TMDB_API_KEY',
  'VITE_TMDB_API_READ_ACCESS_TOKEN',
  'VITE_TMDB_BASE_URL',
] as const;

for (const key of requiredVars) {
  if (!import.meta.env[key]) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
        'Make sure you have a .env file with all required variables.',
    );
  }
}

export const env = {
  tmdb: {
    apiKey: import.meta.env.VITE_TMDB_API_KEY,
    apiReadAccessToken: import.meta.env.VITE_TMDB_API_READ_ACCESS_TOKEN,
    baseUrl: import.meta.env.VITE_TMDB_BASE_URL,
  },
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
