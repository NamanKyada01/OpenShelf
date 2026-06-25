import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  StreakCheckInButton,
  WeeklyStreakRow,
} from '../components/StreakFlame';
import { Screen } from '../components/Screen';
import { useStreak } from '../contexts/StreakContext';
import { useTheme } from '../contexts/ThemeContext';
import { radius, spacing } from '../theme/spacing';

export function StreakScreen() {
  const { palette } = useTheme();
  const { streak, recordActivity } = useStreak();

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
      <Text style={styles.heroEmoji}>🔥</Text>
      <Text style={[styles.count, { color: palette.streak }]}>
        {streak.currentStreak}
      </Text>
      <Text style={[styles.label, { color: palette.textPrimary }]}>day streak</Text>

      <View style={[styles.card, { backgroundColor: palette.surface }]}>
        <Text style={[styles.cardTitle, { color: palette.textSecondary }]}>
          This week
        </Text>
        <WeeklyStreakRow />
      </View>

      <View style={[styles.statsRow, { backgroundColor: palette.surface }]}>
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: palette.textPrimary }]}>
            {streak.longestStreak}
          </Text>
          <Text style={[styles.statLabel, { color: palette.textSecondary }]}>
            Longest
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: palette.border }]} />
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: palette.textPrimary }]}>
            {streak.todayLogged ? '✓' : '—'}
          </Text>
          <Text style={[styles.statLabel, { color: palette.textSecondary }]}>
            Today
          </Text>
        </View>
      </View>

      <Text style={[styles.hint, { color: palette.textMuted }]}>
        Log any media activity each day — add, update, or complete something on your shelf.
        Duolingo-style consistency, for your backlog.
      </Text>

      <StreakCheckInButton onPress={recordActivity} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    alignItems: 'center',
    paddingBottom: spacing.xxl,
  },
  heroEmoji: {
    fontSize: 64,
    marginTop: spacing.lg,
  },
  count: {
    fontSize: 72,
    fontWeight: '800',
    lineHeight: 80,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: spacing.xl,
  },
  card: {
    width: '100%',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  statsRow: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 13,
    marginTop: 4,
  },
  divider: {
    width: 1,
    marginHorizontal: spacing.md,
  },
  hint: {
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
});
