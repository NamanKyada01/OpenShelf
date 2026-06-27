import type { MetadataProvider, MetadataResult } from './types';

export const itunesProvider: MetadataProvider = {
  key: 'itunes',
  label: 'iTunes (Music)',
  supportedTypes: ['music'],
  async search(query: string): Promise<MetadataResult[]> {
    if (!query.trim()) return [];

    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          query,
        )}&entity=album&limit=10`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch from iTunes');
      }

      const data = await response.json();
      
      return (data.results || []).map((item: any) => {
        // iTunes provides 100x100 images, we can replace 100x100bb.jpg with 600x600bb.jpg for higher res
        let posterUrl = item.artworkUrl100;
        if (posterUrl) {
          posterUrl = posterUrl.replace('100x100bb.jpg', '600x600bb.jpg');
        }

        return {
          externalId: item.collectionId.toString(),
          title: item.collectionName,
          posterUrl,
          year: item.releaseDate ? new Date(item.releaseDate).getFullYear() : undefined,
          description: `By ${item.artistName}`,
        };
      });
    } catch (error) {
      console.error('iTunes search error:', error);
      return [];
    }
  },
};
