import type { MetadataProvider, MetadataResult } from './types';

export const openLibraryProvider: MetadataProvider = {
  key: 'openLibrary',
  label: 'Open Library',
  supportedTypes: ['book'],
  async search(query: string): Promise<MetadataResult[]> {
    if (!query.trim()) return [];

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch from Open Library');
      }

      const data = await response.json();
      
      return (data.docs || []).map((doc: any) => {
        let posterUrl;
        if (doc.cover_i) {
          posterUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
        }

        return {
          externalId: doc.key,
          title: doc.title,
          posterUrl,
          year: doc.first_publish_year,
          description: doc.author_name ? `By ${doc.author_name.join(', ')}` : undefined,
        };
      });
    } catch (error) {
      console.error('Open Library search error:', error);
      return [];
    }
  },
};
