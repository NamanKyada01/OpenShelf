import type { MediaItem } from '../types';
import {
  deleteMediaLocal,
  getAllMediaLocal,
  replaceUserMediaLocal,
  upsertMediaLocal,
} from './mediaRepository';
import { mediaCollection } from '../services/firebase';

function sortByUpdated(items: MediaItem[]): MediaItem[] {
  return [...items].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function loadMediaForUser(userId: string): Promise<MediaItem[]> {
  const local = getAllMediaLocal(userId);
  if (local.length > 0) {
    return sortByUpdated(local);
  }

  try {
    const snapshot = await mediaCollection.where('userId', '==', userId).get();
    const remote = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<MediaItem, 'id'>),
    }));
    replaceUserMediaLocal(userId, remote);
    return sortByUpdated(remote);
  } catch {
    return [];
  }
}

export async function saveMediaItem(item: MediaItem): Promise<MediaItem> {
  upsertMediaLocal(item);
  try {
    await mediaCollection.doc(item.id).set(item);
  } catch {
    // Offline — local copy remains source of truth
  }
  return item;
}

export async function removeMediaItem(id: string): Promise<void> {
  deleteMediaLocal(id);
  try {
    await mediaCollection.doc(id).delete();
  } catch {
    // Offline delete queued locally
  }
}

export async function importMediaItems(userId: string, items: MediaItem[]): Promise<MediaItem[]> {
  const normalized = items.map(item => ({
    ...item,
    userId,
    updatedAt: item.updatedAt ?? new Date().toISOString(),
    createdAt: item.createdAt ?? new Date().toISOString(),
  }));
  replaceUserMediaLocal(userId, normalized);
  for (const item of normalized) {
    try {
      await mediaCollection.doc(item.id).set(item);
    } catch {
      // continue offline
    }
  }
  return sortByUpdated(normalized);
}

export function exportMediaItems(userId: string): MediaItem[] {
  return getAllMediaLocal(userId);
}
