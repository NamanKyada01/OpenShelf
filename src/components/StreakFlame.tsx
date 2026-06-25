import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useStreak } from '../contexts/StreakContext';
import { radius, spacing } from '../theme/spacing';

export function StreakBanner() {
  const { palette } = useTheme();
  const { streak } = useStreak();

  return (
    <View style={[styles.card, { backgroundColor: palette.surface }]}>
      <Text style={styles.flame}>🔥</Text>
      <View style={styles.content}>
        <Text style={[styles.title, { color: palette.streak }]}>
          {streak.currentStreak} day streak
        </Text>
        <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
          {streak.todayLogged
            ? 'Great job! You logged activity today.'
            : 'Add or update media today to keep your streak!'}
        </Text>
      </View>
      {!streak.todayLogged ? (
        <View style={[styles.dot, { backgroundColor: palette.danger }]} />
      ) : (
        <View style={[styles.dot, { backgroundColor: palette.success }]} />
      )}
    </View>
  );
}

export function WeeklyStreakRow() {
  const { palette } = useTheme();
  const { streak } = useStreak();
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <View style={styles.weekRow}>
      {streak.weeklyActivity.map((active, index) => (
        <View key={`${days[index]}-${index}`} style={styles.dayCol}>
          <View
            style={[
              styles.dayCircle,
              {
                backgroundColor: active ? palette.streak : palette.surfaceElevated,
                borderColor: active ? palette.streak : palette.border,
              },
            ]}
          >
            {active ? <Text style={styles.check}>✓</Text> : null}
          </View>
          <Text style={[styles.dayLabel, { color: palette.textMuted }]}>{days[index]}</Text>
        </View>
      ))}
    </View>
  );
}

export function StreakCheckInButton({ onPress }: { onPress: () => void }) {
  const { palette } = useTheme();
  const { streak } = useStreak();

  if (streak.todayLogged) {
    return (
      <View style={[styles.doneBtn, { backgroundColor: palette.success }]}>
        <Text style={styles.doneText}>Today's streak secured ✓</Text>
      </View>
    );
  }

  return (
    <Pressable
      style={[styles.checkInBtn, { backgroundColor: palette.streak }]}
      onPress={onPress}
    >
      <Text style={styles.checkInText}>Log today's activity</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  flame: {
    fontSize: 32,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  dayCol: {
    alignItems: 'center',
    gap: 6,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  checkInBtn: {
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  checkInText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  doneBtn: {
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  doneText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
