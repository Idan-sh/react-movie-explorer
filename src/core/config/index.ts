/**
 * Config barrel export
 *
 * WHY INDEX FILES:
 * - Clean imports: `import { env } from '@/core/config'`
 * - Instead of: `import { env } from '@/core/config/env'`
 * - Single entry point for the module
 */

export { env } from './env';
