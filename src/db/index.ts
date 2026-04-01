import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export function getDb(env: any) {
  // `env.DB` is the D1 database binding injected by Cloudflare Workers
  return drizzle(env.DB, { schema });
}
