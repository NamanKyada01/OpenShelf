import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MediaCard } from '../components/MediaCard';
import { Screen } from '../components/Screen';
import { useTheme } from '../contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setFilterStatus, setFilterType } from '../store/slices/mediaSlice';
import type { MediaStatus, MediaType } from '../types';
import { radius, spacing } from '../theme/spacing';

const STATUS_FILTERS: Array<{ label: string; value: MediaStatus | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Plan', value: 'plan' },
  { label: 'Active', value: 'in_progress' },
  { label: 'Done', value: 'completed' },
];

const TYPE_FILTERS: Array<{ label: string; value: MediaType | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Movies', value: 'movie' },
  { label: 'TV', value: 'tv' },
  { label: 'Books', value: 'book' },
  { label: 'Games', value: 'game' },
];

export function LibraryScreen() {
  const { palette } = useTheme();
  const dispatch = useAppDispatch();
  const { items, filterStatus, filterType } = useAppSelector(state => state.media);

  const filtered = useMemo(() => {
    return items.filter(item => {
      const statusMatch = filterStatus === 'all' || item.status === filterStatus;
      const typeMatch = filterType === 'all' || item.type === filterType;
      return statusMatch && typeMatch;
    });
  }, [items, filterStatus, filterType]);

  return (
    <Screen style={styles.container}>
      <Text style={[styles.title, { color: palette.textPrimary }]}>Library</Text>

      <View style={styles.filters}>
        {STATUS_FILTERS.map(f => (
          <Pressable
            key={f.value}
            onPress={() => dispatch(setFilterStatus(f.value))}
            style={[
              styles.chip,
              {
                backgroundColor:
                  filterStatus === f.value ? palette.primary : palette.surface,
                borderColor: palette.border,
              },
            ]}
          >
            <Text
              style={{
                color: filterStatus === f.value ? '#FFF' : palette.textSecondary,
                fontWeight: '600',
                fontSize: 12,
              }}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.filters}>
        {TYPE_FILTERS.map(f => (
          <Pressable
            key={f.value}
            onPress={() => dispatch(setFilterType(f.value))}
            style={[
              styles.chip,
              {
                backgroundColor:
                  filterType === f.value ? palette.primaryDark : palette.surface,
                borderColor: palette.border,
              },
            ]}
          >
            <Text
              style={{
                color: filterType === f.value ? '#FFF' : palette.textSecondary,
                fontWeight: '600',
                fontSize: 12,
              }}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: palette.textSecondary }]}>
            No items match your filters.
          </Text>
        }
        renderItem={({ item }) => <MediaCard item={item} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  list: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  empty: {
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
