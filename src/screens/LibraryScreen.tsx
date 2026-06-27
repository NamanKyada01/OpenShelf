import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MediaCard } from '../components/MediaCard';
import { Screen } from '../components/Screen';
import { useTheme } from '../contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { getMediaTypeOptions } from '../media-types';
import type { MainStackParamList } from '../navigation/MainStack';
import { toggleFilterStatus, clearFilterStatuses, setFilterType } from '../store/slices/mediaSlice';
import type { MediaStatus } from '../types';
import { radius, spacing } from '../theme/spacing';

type Nav = NativeStackNavigationProp<MainStackParamList>;

const STATUS_FILTERS: Array<{ label: string; value: MediaStatus | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Plan', value: 'plan' },
  { label: 'Active', value: 'in_progress' },
  { label: 'Done', value: 'completed' },
  { label: 'Dropped', value: 'dropped' },
];

type SortOption = 'date_added_desc' | 'date_added_asc' | 'alpha_asc' | 'alpha_desc' | 'rating_desc';

const SORT_OPTIONS: Array<{ label: string; value: SortOption }> = [
  { label: 'Newest', value: 'date_added_desc' },
  { label: 'Oldest', value: 'date_added_asc' },
  { label: 'A-Z', value: 'alpha_asc' },
  { label: 'Z-A', value: 'alpha_desc' },
  { label: 'Top Rated', value: 'rating_desc' },
];

export function LibraryScreen() {
  const { palette } = useTheme();
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { items, filterStatuses, filterType } = useAppSelector(state => state.media);

  const [sortOption, setSortOption] = useState<SortOption>('date_added_desc');

  const filteredAndSorted = useMemo(() => {
    let result = items.filter(item => {
      const statusMatch = filterStatuses.length === 0 || filterStatuses.includes(item.status);
      const typeMatch = filterType === 'all' || item.type === filterType;
      return statusMatch && typeMatch;
    });

    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case 'date_added_desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date_added_asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'alpha_asc':
          return a.title.localeCompare(b.title);
        case 'alpha_desc':
          return b.title.localeCompare(a.title);
        case 'rating_desc':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [items, filterStatuses, filterType, sortOption]);

  return (
    <Screen style={styles.container}>
      <Text style={[styles.title, { color: palette.textPrimary }]}>Library</Text>

      <View style={styles.filters}>
        {STATUS_FILTERS.map(f => (
          <Pressable
            key={f.value}
            onPress={() => {
              if (f.value === 'all') {
                dispatch(clearFilterStatuses());
              } else {
                dispatch(toggleFilterStatus(f.value as MediaStatus));
              }
            }}
            style={[
              styles.chip,
              {
                backgroundColor:
                  (f.value === 'all' && filterStatuses.length === 0) || (f.value !== 'all' && filterStatuses.includes(f.value as MediaStatus))
                    ? palette.primary
                    : palette.surface,
                borderColor: palette.border,
              },
            ]}
          >
            <Text style={[styles.chipText, { color: (f.value === 'all' && filterStatuses.length === 0) || (f.value !== 'all' && filterStatuses.includes(f.value as MediaStatus)) ? '#FFF' : palette.textSecondary }]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.filters}>
        {[{ label: 'All', value: 'all' as const }, ...getMediaTypeOptions().map(t => ({ label: t.label + 's', value: t.type }))].map(f => (
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
            <Text style={[styles.chipText, { color: filterType === f.value ? '#FFF' : palette.textSecondary }]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.filters}>
        {SORT_OPTIONS.map(opt => (
          <Pressable
            key={opt.value}
            onPress={() => setSortOption(opt.value)}
            style={[
              styles.chip,
              {
                backgroundColor: sortOption === opt.value ? palette.success : palette.surface,
                borderColor: palette.border,
              },
            ]}
          >
            <Text
              style={[styles.chipText, { color: sortOption === opt.value ? '#FFF' : palette.textSecondary }]}
            >
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredAndSorted}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: palette.textSecondary }]}>
            No items match your filters.
          </Text>
        }
        renderItem={({ item }) => (
          <MediaCard
            item={item}
            onPress={() => navigation.navigate('MediaDetail', { itemId: item.id })}
          />
        )}
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
  chipText: {
    fontWeight: '600',
    fontSize: 12,
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
