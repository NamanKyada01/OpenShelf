import { tmdbProvider } from './tmdb';
import { openLibraryProvider } from './openLibrary';
import { createStubProvider } from './types';

/** IGDB provider — requires Twitch dev credentials (v0.2) */
export const igdbProvider = createStubProvider('igdb', 'IGDB', ['game']);

export const providers = [tmdbProvider, openLibraryProvider, igdbProvider];

export function getProviderForType(type: string) {
  return providers.find(p => p.supportedTypes.includes(type));
}
