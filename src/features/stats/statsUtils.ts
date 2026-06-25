import type { MediaItem } from '../../types';

export interface MediaStats {
  total: number;
  completed: number;
  inProgress: number;
  plan: number;
  dropped: number;
  averageRating: number | null;
  byType: Record<string, number>;
  completedByMonth: Array<{ month: string; count: number }>;
}

export function computeMediaStats(items: MediaItem[]): MediaStats {
  const completed = items.filter(i => i.status === 'completed');
  const rated = completed.filter(i => i.rating != null && i.rating > 0);
  const averageRating =
    rated.length > 0
      ? rated.reduce((sum, i) => sum + (i.rating ?? 0), 0) / rated.length
      : null;

  const byType: Record<string, number> = {};
  items.forEach(i => {
    byType[i.type] = (byType[i.type] ?? 0) + 1;
  });

  const monthMap = new Map<string, number>();
  completed.forEach(i => {
    const date = i.completedAt ?? i.updatedAt;
    const month = date.slice(0, 7);
    monthMap.set(month, (monthMap.get(month) ?? 0) + 1);
  });

  const completedByMonth = [...monthMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, count]) => ({ month, count }));

  return {
    total: items.length,
    completed: completed.length,
    inProgress: items.filter(i => i.status === 'in_progress').length,
    plan: items.filter(i => i.status === 'plan').length,
    dropped: items.filter(i => i.status === 'dropped').length,
    averageRating,
    byType,
    completedByMonth,
  };
}
