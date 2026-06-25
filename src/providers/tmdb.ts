import type { MetadataProvider, MetadataResult } from './types';

// Replace with your actual TMDB API key
const TMDB_API_KEY = '';

export const tmdbProvider: MetadataProvider = {
  key: 'tmdb',
  label: 'TMDB',
  supportedTypes: ['movie', 'tv'],
  async search(query: string): Promise<MetadataResult[]> {
    if (!query.trim() || !TMDB_API_KEY) return [];

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          query,
        )}&include_adult=false`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch from TMDB');
      }

      const data = await response.json();
      
      return (data.results || [])
        .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
        .map((item: any) => {
          let posterUrl;
          if (item.poster_path) {
            posterUrl = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
          }

          return {
            externalId: item.id.toString(),
            title: item.title || item.name,
            posterUrl,
            year: item.release_date
              ? new Date(item.release_date).getFullYear()
              : item.first_air_date
              ? new Date(item.first_air_date).getFullYear()
              : undefined,
            description: item.overview,
          };
        });
    } catch (error) {
      console.error('TMDB search error:', error);
      return [];
    }
  },
};
