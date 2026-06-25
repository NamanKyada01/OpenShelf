import { createStubProvider } from './types';

/** TMDB provider — wire API key via env for v0.2 */
export const tmdbProvider = createStubProvider('tmdb', 'TMDB', ['movie', 'tv']);

/** Open Library provider — free API, no key required (v0.2) */
export const openLibraryProvider = createStubProvider('openLibrary', 'Open Library', ['book']);

/** IGDB provider — requires Twitch dev credentials (v0.2) */
export const igdbProvider = createStubProvider('igdb', 'IGDB', ['game']);

export const providers = [tmdbProvider, openLibraryProvider, igdbProvider];

export function getProviderForType(type: string) {
  return providers.find(p => p.supportedTypes.includes(type));
}
