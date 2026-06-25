import { open } from '@op-engineering/op-sqlite';
import type { MediaItem } from '../types';

const DB_NAME = 'openshelf.db';

let db: ReturnType<typeof open> | null = null;

export function getDatabase() {
  if (!db) {
    db = open({ name: DB_NAME });
    initSchema(db);
  }
  return db;
}

function initSchema(database: ReturnType<typeof open>) {
  database.executeSync(`
    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      rating REAL,
      notes TEXT,
      posterUrl TEXT,
      tags TEXT,
      startedAt TEXT,
      completedAt TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      syncedAt TEXT
    );
  `);
  database.executeSync(`
    CREATE INDEX IF NOT EXISTS idx_media_user ON media(userId);
  `);
}

function rowToMedia(row: Record<string, unknown>): MediaItem {
  const tagsRaw = row.tags as string | null;
  return {
    id: row.id as string,
    userId: row.userId as string,
    title: row.title as string,
    type: row.type as MediaItem['type'],
    status: row.status as MediaItem['status'],
    rating: row.rating != null ? Number(row.rating) : undefined,
    notes: (row.notes as string) || undefined,
    posterUrl: (row.posterUrl as string) || undefined,
    tags: tagsRaw ? JSON.parse(tagsRaw) : undefined,
    startedAt: (row.startedAt as string) || undefined,
    completedAt: (row.completedAt as string) || undefined,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  };
}

export function getAllMediaLocal(userId: string): MediaItem[] {
  const database = getDatabase();
  const result = database.executeSync(
    'SELECT * FROM media WHERE userId = ? ORDER BY updatedAt DESC',
    [userId],
  );
  return (result.rows ?? []).map(rowToMedia);
}

export function upsertMediaLocal(item: MediaItem): void {
  const database = getDatabase();
  database.executeSync(
    `INSERT OR REPLACE INTO media
      (id, userId, title, type, status, rating, notes, posterUrl, tags, startedAt, completedAt, createdAt, updatedAt, syncedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      item.id,
      item.userId,
      item.title,
      item.type,
      item.status,
      item.rating ?? null,
      item.notes ?? null,
      item.posterUrl ?? null,
      item.tags ? JSON.stringify(item.tags) : null,
      item.startedAt ?? null,
      item.completedAt ?? null,
      item.createdAt,
      item.updatedAt,
      new Date().toISOString(),
    ],
  );
}

export function upsertManyMediaLocal(items: MediaItem[]): void {
  items.forEach(upsertMediaLocal);
}

export function deleteMediaLocal(id: string): void {
  getDatabase().executeSync('DELETE FROM media WHERE id = ?', [id]);
}

export function replaceUserMediaLocal(userId: string, items: MediaItem[]): void {
  const database = getDatabase();
  database.executeSync('DELETE FROM media WHERE userId = ?', [userId]);
  upsertManyMediaLocal(items);
}

export function getUnsyncedMedia(userId: string): MediaItem[] {
  const database = getDatabase();
  const result = database.executeSync(
    'SELECT * FROM media WHERE userId = ? AND syncedAt IS NULL',
    [userId],
  );
  return (result.rows ?? []).map(rowToMedia);
}

export function markMediaSynced(id: string): void {
  getDatabase().executeSync('UPDATE media SET syncedAt = ? WHERE id = ?', [
    new Date().toISOString(),
    id,
  ]);
}
