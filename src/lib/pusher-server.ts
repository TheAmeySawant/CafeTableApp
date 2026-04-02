/**
 * Edge-compatible Pusher server-side trigger
 *
 * Uses:
 *  - Inline pure-JS MD5  (Web Crypto does not support MD5)
 *  - Web Crypto HMAC-SHA256 for request signing
 *  - Native fetch() to call the Pusher REST API
 *
 * NO Node.js dependencies → works on Cloudflare Workers edge runtime.
 */

// ---------------------------------------------------------------------------
// Pure-JS MD5 — required by Pusher's body_md5 auth scheme
// ---------------------------------------------------------------------------
function md5(input: string): string {
  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];

  const K = new Uint32Array(64);
  for (let i = 0; i < 64; i++) {
    K[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0;
  }

  // UTF-8 encode
  const msgBytes = new TextEncoder().encode(input);
  const len = msgBytes.length;

  // Padding: 0x80 byte, then zeros, then 64-bit LE length
  const padLen = ((len + 8) >>> 6 << 6) + 64 - len;
  const padded = new Uint8Array(len + padLen);
  padded.set(msgBytes);
  padded[len] = 0x80;
  const bitLen = len * 8;
  // Write bit-length as 64-bit little-endian (only lower 32 bits needed for reasonable inputs)
  padded[len + padLen - 8] =  bitLen         & 0xff;
  padded[len + padLen - 7] = (bitLen >>>  8) & 0xff;
  padded[len + padLen - 6] = (bitLen >>> 16) & 0xff;
  padded[len + padLen - 5] = (bitLen >>> 24) & 0xff;

  let h0 = 0x67452301, h1 = 0xEFCDAB89, h2 = 0x98BADCFE, h3 = 0x10325476;

  const view = new DataView(padded.buffer);
  for (let i = 0; i < padded.length; i += 64) {
    const M = Array.from({ length: 16 }, (_, j) => view.getUint32(i + j * 4, true));
    let a = h0, b = h1, c = h2, d = h3;

    for (let j = 0; j < 64; j++) {
      let f: number, g: number;
      if      (j < 16) { f = (b & c) | (~b & d);  g = j; }
      else if (j < 32) { f = (d & b) | (~d & c);  g = (5 * j + 1) % 16; }
      else if (j < 48) { f = b ^ c ^ d;            g = (3 * j + 5) % 16; }
      else             { f = c ^ (b | ~d);          g = (7 * j) % 16; }

      const tmp = (a + f + K[j] + M[g]) >>> 0;
      a = d; d = c; c = b;
      b = (b + ((tmp << S[j]) | (tmp >>> (32 - S[j])))) >>> 0;
    }

    h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
  }

  // Serialize as little-endian hex
  return [h0, h1, h2, h3]
    .map(h =>
      Array.from({ length: 4 }, (_, i) =>
        ((h >>> (i * 8)) & 0xff).toString(16).padStart(2, '0'),
      ).join(''),
    )
    .join('');
}

// ---------------------------------------------------------------------------
// HMAC-SHA256 via Web Crypto API
// ---------------------------------------------------------------------------
async function hmacSHA256(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Trigger a Pusher Channels event via the Pusher HTTP API.
 *
 * Required env vars:
 *   PUSHER_APP_ID  NEXT_PUBLIC_PUSHER_APP_KEY  PUSHER_SECRET  PUSHER_CLUSTER
 *
 * Failures are logged but never thrown — Pusher outages won't break order flow.
 */
export async function triggerPusherEvent(
  channel: string,
  event: string,
  data: object,
): Promise<void> {
  try {
    const appId   = process.env.PUSHER_APP_ID;
    const key     = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const secret  = process.env.PUSHER_SECRET;
    const cluster = process.env.PUSHER_CLUSTER ?? 'ap2';

    if (!appId || !key || !secret) {
      console.warn('[Pusher] Credentials missing — event not sent');
      return;
    }

    const body    = JSON.stringify({ name: event, channel, data: JSON.stringify(data) });
    const bodyMd5 = md5(body);
    const ts      = Math.floor(Date.now() / 1000).toString();

    // Sort params alphabetically (required by Pusher auth spec)
    const paramEntries: [string, string][] = [
      ['auth_key',       key],
      ['auth_timestamp', ts],
      ['auth_version',  '1.0'],
      ['body_md5',       bodyMd5],
    ];
    paramEntries.sort(([a], [b]) => a.localeCompare(b));
    const sortedQuery = paramEntries.map(([k, v]) => `${k}=${v}`).join('&');

    const path      = `/apps/${appId}/events`;
    const toSign    = `POST\n${path}\n${sortedQuery}`;
    const signature = await hmacSHA256(secret, toSign);

    const url = `https://api-${cluster}.pusher.com${path}?${sortedQuery}&auth_signature=${signature}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (!res.ok) {
      console.error('[Pusher] HTTP error:', res.status, await res.text());
    }
  } catch (err) {
    console.error('[Pusher] Trigger error:', err);
  }
}
