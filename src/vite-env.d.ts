/// <reference types="vite/client" />

/**
 * Type-safe environment variables for Vite
 *
 * HOW IT WORKS:
 * - Vite exposes env vars via import.meta.env
 * - We extend ImportMetaEnv to add our custom vars
 * - TypeScript now knows about VITE_TMDB_* vars
 * - Use: import.meta.env.VITE_TMDB_API_KEY (with autocomplete!)
 *
 * RULES:
 * - Only VITE_ prefixed vars are exposed to client
 * - Values are statically replaced at build time
 * - Add new env vars here to get type safety
 */
interface ImportMetaEnv {
  readonly VITE_TMDB_API_KEY: string;
  readonly VITE_TMDB_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
