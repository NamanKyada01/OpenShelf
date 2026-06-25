import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { MediaItem } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { radius, spacing } from '../theme/spacing';
import { StatusChip } from './StatusChip';

const TYPE_LABELS: Record<MediaItem['type'], string> = {
  movie: 'Movie',
  tv: 'TV',
  book: 'Book',
  game: 'Game',
};

interface MediaCardProps {
  item: MediaItem;
  onPress?: () => void;
}

export function MediaCard({ item }: MediaCardProps) {
  const { palette } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: palette.surface }]}>
      <View style={[styles.poster, { backgroundColor: palette.primary }]}>
        <Text style={styles.posterText}>{item.title.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: palette.textPrimary }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.meta, { color: palette.textSecondary }]}>
          {TYPE_LABELS[item.type]}
        </Text>
        <StatusChip status={item.status} />
      </View>
      {item.rating ? (
        <Text style={[styles.rating, { color: palette.streak }]}>★ {item.rating}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  poster: {
    width: 48,
    height: 68,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  meta: {
    fontSize: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '700',
  },
});
