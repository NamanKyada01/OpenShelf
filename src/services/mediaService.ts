import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import type { MediaItem, MediaStatus, MediaType } from '../types';
import { mediaCollection, userMediaQuery } from './firebase';

function mapMedia(doc: FirebaseFirestoreTypes.QueryDocumentSnapshot): MediaItem {
  const data = doc.data() as Omit<MediaItem, 'id'>;
  return { id: doc.id, ...data };
}

function sortByUpdated(items: MediaItem[]): MediaItem[] {
  return [...items].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function fetchUserMedia(userId: string): Promise<MediaItem[]> {
  const snapshot = await userMediaQuery(userId).get();
  return sortByUpdated(snapshot.docs.map(mapMedia));
}

export function subscribeToUserMedia(
  userId: string,
  onUpdate: (items: MediaItem[]) => void,
  onError?: (error: Error) => void,
) {
  return userMediaQuery(userId).onSnapshot(
    snapshot => {
      onUpdate(sortByUpdated(snapshot.docs.map(mapMedia)));
    },
    error => onError?.(error),
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
    createdAt: now,
    updatedAt: now,
  };

  await docRef.set(item);
  return item;
}

export async function updateMediaItem(
  id: string,
  updates: Partial<Pick<MediaItem, 'title' | 'status' | 'rating' | 'notes' | 'type'>>,
): Promise<void> {
  await mediaCollection.doc(id).update({
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteMediaItem(id: string): Promise<void> {
  await mediaCollection.doc(id).delete();
}

export async function getActiveMediaCount(userId: string): Promise<number> {
  const snapshot = await mediaCollection
    .where('userId', '==', userId)
    .where('status', '==', 'in_progress')
    .get();
  return snapshot.size;
}
