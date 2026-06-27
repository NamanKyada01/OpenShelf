import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAppSelector } from '../hooks/redux';
import { radius, spacing } from '../theme/spacing';

export function ActivityHeatmap() {
  const { palette } = useTheme();
  const { items } = useAppSelector(state => state.media);

  // Generate last 30 days
  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const counts: Record<string, number> = {};
    
    // Count activity per day based on updated_at or created_at
    items.forEach(item => {
      const dateStr = (item.updatedAt || item.createdAt).split('T')[0];
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });

    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      last30Days.push({
        date: dateStr,
        count: counts[dateStr] || 0,
      });
    }
    return last30Days;
  }, [items]);

  return (
    <View style={[styles.container, { backgroundColor: palette.surface }]}>
      <Text style={[styles.title, { color: palette.textPrimary }]}>30-Day Activity</Text>
      <View style={styles.grid}>
        {days.map(day => {
          // Opacity based on count (0 = very dim, 1+ = brighter)
          let opacity = 0.1;
          if (day.count === 1) opacity = 0.4;
          if (day.count === 2) opacity = 0.7;
          if (day.count >= 3) opacity = 1.0;

          return (
            <View
              key={day.date}
              style={[
                styles.cell,
                {
                  backgroundColor: day.count > 0 ? palette.primary : palette.border,
                  opacity: day.count > 0 ? opacity : 0.3,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  cell: {
    width: 14,
    height: 14,
    borderRadius: 2,
  },
});
