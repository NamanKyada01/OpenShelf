/**
 * OpenShelf v1 scope (Shelf plan)
 * - Media types: movie, tv, book, game
 * - Manual add first; provider search optional enrichment
 * - UI: dark-first minimal with playful streak accents
 */
export const V1_MEDIA_TYPES = ['movie', 'tv', 'book', 'game'] as const;

export const V1_CONFIG = {
  appName: 'OpenShelf',
  manualAddFirst: true,
  enableProviderSearch: false,
  uiStyle: 'minimal-dark' as const,
} as const;
