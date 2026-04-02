import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

/**
 * Returns a Drizzle D1 client.
 *
 * In production (Cloudflare Pages / Workers) the D1 binding `DB` is injected
 * by the runtime and accessed via `getRequestContext()`.
 *
 * When called from routes that already have access to the env object (e.g.
 * wrangler pages dev), you can optionally pass it directly.
 */
export function getDb(env?: any) {
  // If env was passed explicitly (legacy / compat path), use it directly.
  if (env?.DB) {
    return drizzle(env.DB, { schema });
  }

  // Try the Cloudflare next-on-pages request context (production path).
  try {
    // Dynamic import avoids bundling errors in plain `npm run dev`
    const { getRequestContext } = require('@cloudflare/next-on-pages');
    const { env: cfEnv } = getRequestContext();
    if (cfEnv?.DB) {
      return drizzle(cfEnv.DB, { schema });
    }
  } catch {
    // Running in plain `npm run dev` – D1 is not available.
    // Routes should handle the resulting error gracefully.
  }

  throw new Error('D1 binding unavailable. Run via `wrangler pages dev` or deploy to Cloudflare Pages.');
}
