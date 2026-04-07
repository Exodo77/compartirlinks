import { createClient } from "@vercel/kv";

// Creamos un cliente de manera diferida que se llame cuando sea necesario y que sea independiente de Server Actions
export function getKvClient() {
  return createClient({
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "https://dummy.upstash.io",
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "dummy",
  });
}
