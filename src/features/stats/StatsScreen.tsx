import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppSelector } from '../../hooks/redux';
import { getMediaTypeConfig } from '../../media-types';
import type { MediaType } from '../../types';
import { radius, spacing } from '../../theme/spacing';
import { computeMediaStats } from './statsUtils';

export function StatsScreen() {
  const { palette } = useTheme();
  const { items } = useAppSelector(state => state.media);
  const stats = useMemo(() => computeMediaStats(items), [items]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: palette.textPrimary }]}>Stats</Text>

        <View style={[styles.heroCard, { backgroundColor: palette.surface }]}>
          <Text style={[styles.heroNum, { color: palette.primary }]}>
            {stats.completed}
          </Text>
          <Text style={[styles.heroLabel, { color: palette.textSecondary }]}>
            completed this shelf
          </Text>
          {stats.averageRating != null ? (
            <Text style={[styles.rating, { color: palette.streak }]}>
              ★ {stats.averageRating.toFixed(1)} avg rating
            </Text>
          ) : null}
        </View>

        <Text style={[styles.section, { color: palette.textPrimary }]}>By type</Text>
        <View style={styles.typeGrid}>
          {(Object.keys(stats.byType) as MediaType[]).map(type => {
            const config = getMediaTypeConfig(type);
            return (
              <View
                key={type}
                style={[styles.typeCard, { backgroundColor: palette.surface }]}
              >
                <Text style={styles.typeIcon}>{config.icon}</Text>
                <Text style={[styles.typeCount, { color: palette.textPrimary }]}>
                  {stats.byType[type]}
                </Text>
                <Text style={[styles.typeLabel, { color: palette.textSecondary }]}>
                  {config.label}
                </Text>
              </View>
            );
          })}
        </View>

        <Text style={[styles.section, { color: palette.textPrimary }]}>
          Completed by month
        </Text>
        {stats.completedByMonth.length === 0 ? (
          <Text style={[styles.empty, { color: palette.textMuted }]}>
            Finish something to see your timeline.
          </Text>
        ) : (
          stats.completedByMonth.map(entry => (
            <View key={entry.month} style={styles.barRow}>
              <Text style={[styles.barLabel, { color: palette.textSecondary }]}>
                {entry.month}
              </Text>
              <View style={[styles.barTrack, { backgroundColor: palette.surfaceElevated }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      backgroundColor: palette.primary,
                      width: `${Math.min(100, entry.count * 20)}%`,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.barCount, { color: palette.textPrimary }]}>
                {entry.count}
              </Text>
            </View>
          ))
        )}

        <View style={[styles.summaryRow, { backgroundColor: palette.surface }]}>
          <SummaryCell label="Active" value={stats.inProgress} palette={palette} />
          <SummaryCell label="Plan" value={stats.plan} palette={palette} />
          <SummaryCell label="Dropped" value={stats.dropped} palette={palette} />
        </View>
      </ScrollView>
    </Screen>
  );
}

function SummaryCell({
  label,
  value,
  palette,
}: {
  label: string;
  value: number;
  palette: Record<string, string>;
}) {
  return (
    <View style={styles.summaryCell}>
      <Text style={[styles.summaryNum, { color: palette.textPrimary }]}>{value}</Text>
      <Text style={[styles.summaryLabel, { color: palette.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  heroCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  heroNum: {
    fontSize: 48,
    fontWeight: '800',
  },
  heroLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  rating: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  section: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  typeCard: {
    width: '47%',
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 24,
  },
  typeCount: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
  typeLabel: {
    fontSize: 12,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  barLabel: {
    width: 64,
    fontSize: 12,
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  barCount: {
    width: 24,
    textAlign: 'right',
    fontWeight: '600',
  },
  empty: {
    marginBottom: spacing.lg,
    fontSize: 13,
  },
  summaryRow: {
    flexDirection: 'row',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  summaryCell: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNum: {
    fontSize: 22,
    fontWeight: '700',
  },
  summaryLabel: {
    fontSize: 12,
    marginTop: 2,
  },
});
