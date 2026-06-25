export interface MetadataResult {
  externalId: string;
  title: string;
  posterUrl?: string;
  year?: number;
  description?: string;
}

export interface MetadataProvider {
  key: string;
  label: string;
  supportedTypes: string[];
  search(query: string): Promise<MetadataResult[]>;
}

export function createStubProvider(
  key: string,
  label: string,
  supportedTypes: string[],
): MetadataProvider {
  return {
    key,
    label,
    supportedTypes,
    async search(_query: string) {
      return [];
    },
  };
}
