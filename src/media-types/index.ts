import type { MediaType } from '../types';

export interface MediaTypeConfig {
  type: MediaType;
  label: string;
  icon: string;
  color: string;
  providerKey?: 'tmdb' | 'openLibrary' | 'igdb';
}

export const mediaTypeRegistry: Record<MediaType, MediaTypeConfig> = {
  movie: {
    type: 'movie',
    label: 'Movie',
    icon: '🎬',
    color: '#6C63FF',
    providerKey: 'tmdb',
  },
  tv: {
    type: 'tv',
    label: 'TV',
    icon: '📺',
    color: '#554FD9',
    providerKey: 'tmdb',
  },
  book: {
    type: 'book',
    label: 'Book',
    icon: '📖',
    color: '#58CC02',
    providerKey: 'openLibrary',
  },
  game: {
    type: 'game',
    label: 'Game',
    icon: '🎮',
    color: '#FF9600',
    providerKey: 'igdb',
  },
};

export function getMediaTypeOptions(): MediaTypeConfig[] {
  return Object.values(mediaTypeRegistry);
}

export function getMediaTypeConfig(type: MediaType): MediaTypeConfig {
  return mediaTypeRegistry[type];
}
