import type { MediaItem, MediaStatus, MediaType } from '../types';
import { saveMediaItem, removeMediaItem } from '../db/syncService';
import { mediaCollection } from '../services/firebase';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

function mapMedia(doc: FirebaseFirestoreTypes.QueryDocumentSnapshot): MediaItem {
  const data = doc.data() as Omit<MediaItem, 'id'>;
  return { id: doc.id, ...data };
}

function sortByUpdated(items: MediaItem[]): MediaItem[] {
  return [...items].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function createMediaItem(
  userId: string,
  input: {
    title: string;
    type: MediaType;
    status: MediaStatus;
    rating?: number;
    notes?: string;
    tags?: string[];
    posterUrl?: string;
    startedAt?: string;
    completedAt?: string;
  },
): Promise<MediaItem> {
  const now = new Date().toISOString();
  const docRef = mediaCollection.doc();
  const item: MediaItem = {
    id: docRef.id,
    userId,
    title: input.title.trim(),
    type: input.type,
    status: input.status,
    rating: input.rating,
    notes: input.notes,
    tags: input.tags,
    posterUrl: input.posterUrl,
    startedAt: input.status === 'in_progress' ? input.startedAt ?? now : input.startedAt,
    completedAt: input.status === 'completed' ? input.completedAt ?? now : input.completedAt,
    createdAt: now,
    updatedAt: now,
  };

  return saveMediaItem(item);
}

export async function updateMediaItem(
  id: string,
  userId: string,
  updates: Partial<
    Pick<
      MediaItem,
      'title' | 'status' | 'rating' | 'notes' | 'type' | 'tags' | 'startedAt' | 'completedAt' | 'posterUrl'
    >
  >,
): Promise<MediaItem | null> {
  const doc = await mediaCollection.doc(id).get();
  if (!doc.exists) {
    return null;
  }

  const existing = { id: doc.id, ...(doc.data() as Omit<MediaItem, 'id'>) };
  const now = new Date().toISOString();
  const nextStatus = updates.status ?? existing.status;

  const item: MediaItem = {
    ...existing,
    ...updates,
    userId,
    startedAt:
      nextStatus === 'in_progress' && !existing.startedAt && !updates.startedAt
        ? now
        : updates.startedAt ?? existing.startedAt,
    completedAt:
      nextStatus === 'completed' && !existing.completedAt && !updates.completedAt
        ? now
        : updates.completedAt ?? existing.completedAt,
    updatedAt: now,
  };

  return saveMediaItem(item);
}

export async function deleteMediaItem(id: string): Promise<void> {
  await removeMediaItem(id);
}

export function subscribeToUserMedia(
  userId: string,
  onUpdate: (items: MediaItem[]) => void,
  onError?: (error: Error) => void,
) {
  return mediaCollection.where('userId', '==', userId).onSnapshot(
    snapshot => {
      onUpdate(sortByUpdated(snapshot.docs.map(mapMedia)));
    },
    error => onError?.(error),
  );
}

export { loadMediaForUser, importMediaItems, exportMediaItems } from '../db/syncService';
