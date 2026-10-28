CREATE TABLE IF NOT EXISTS conceptlab_kv (
  store TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT,
  metadata TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (store, key)
);
CREATE INDEX IF NOT EXISTS idx_conceptlab_kv_store ON conceptlab_kv(store);
