// Cloudflare D1/R2 adapter compatible with the small subset of Netlify Blobs used by the API.
const encoder = new TextEncoder();
function parseType(value, type) {
  if (value == null) return null;
  if (type === 'json') { try { return JSON.parse(value); } catch { return null; } }
  if (type === 'arrayBuffer') return encoder.encode(value).buffer;
  return value;
}
function d1Store(env, name) {
  const db = env.DB;
  const get = async (key, options = {}) => {
    const row = await db.prepare('SELECT value FROM conceptlab_kv WHERE store = ? AND key = ?').bind(name, String(key)).first();
    return row ? parseType(row.value, options.type) : null;
  };
  return {
    get,
    async set(key, value, options = {}) {
      const stored = typeof value === 'string' ? value : JSON.stringify(value);
      await db.prepare('INSERT INTO conceptlab_kv (store, key, value, metadata, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP) ON CONFLICT(store, key) DO UPDATE SET value = excluded.value, metadata = excluded.metadata, updated_at = CURRENT_TIMESTAMP')
        .bind(name, String(key), stored, options.metadata ? JSON.stringify(options.metadata) : null).run();
    },
    async setJSON(key, value) { return this.set(key, JSON.stringify(value)); },
    async delete(key) { await db.prepare('DELETE FROM conceptlab_kv WHERE store = ? AND key = ?').bind(name, String(key)).run(); },
    async list() {
      const rows = await db.prepare('SELECT key FROM conceptlab_kv WHERE store = ? ORDER BY key').bind(name).all();
      return { blobs: (rows.results || []).map((row) => ({ key: row.key })) };
    },
    async getMetadata(key) {
      const row = await db.prepare('SELECT metadata FROM conceptlab_kv WHERE store = ? AND key = ?').bind(name, String(key)).first();
      let metadata = null; try { metadata = row?.metadata ? JSON.parse(row.metadata) : null; } catch {}
      return metadata ? { metadata } : null;
    }
  };
}
function r2Store(env) {
  const bucket = env.MEDIA;
  return {
    async getWithMetadata(key) {
      const obj = await bucket.get(String(key));
      if (!obj) return null;
      const data = await obj.arrayBuffer();
      return { data, metadata: obj.customMetadata || {} };
    },
    async set(key, value, options = {}) {
      await bucket.put(String(key), value, { customMetadata: options.metadata || {} });
    },
    async delete(key) { await bucket.delete(String(key)); },
    async getMetadata(key) {
      const obj = await bucket.head(String(key));
      return obj ? { metadata: obj.customMetadata || {} } : null;
    },
    async list() {
      const objects = [];
      let cursor;
      do {
        const page = await bucket.list({ cursor, limit: 1000 });
        objects.push(...page.objects.map((o) => ({ key: o.key })));
        cursor = page.truncated ? page.cursor : undefined;
      } while (cursor);
      return { blobs: objects };
    }
  };
}
export function getStore(env, name) {
  if (!env?.DB || !env?.MEDIA) throw new Error('Cloudflare bindings missing. Configure DB (D1) and MEDIA (R2) in wrangler.jsonc.');
  return name === 'media' ? r2Store(env) : d1Store(env, name);
}
