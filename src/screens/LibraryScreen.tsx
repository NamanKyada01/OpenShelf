import React, { useMemo } from 'react';
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
import { setFilterStatus, setFilterType } from '../store/slices/mediaSlice';
import { radius, spacing } from '../theme/spacing';

type Nav = NativeStackNavigationProp<MainStackParamList>;

const STATUS_FILTERS: Array<{ label: string; value: MediaStatus | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Plan', value: 'plan' },
  { label: 'Active', value: 'in_progress' },
  { label: 'Done', value: 'completed' },
  { label: 'Dropped', value: 'dropped' },
];

export function LibraryScreen() {
  const { palette } = useTheme();
  const navigation = useNavigation<Nav>();
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
  list: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  empty: {
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
