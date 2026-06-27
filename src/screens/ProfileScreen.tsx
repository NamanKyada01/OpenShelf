import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { ActivityHeatmap } from '../components/ActivityHeatmap';
import { useBackupRestore } from '../features/settings/useBackupRestore';
import { useTheme } from '../contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { signOut } from '../services/authService';
import { clearAuth } from '../store/slices/authSlice';
import { setMediaItems } from '../store/slices/mediaSlice';
import { radius, spacing } from '../theme/spacing';

export function ProfileScreen() {
  const { palette, toggleTheme, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { items } = useAppSelector(state => state.media);

  const completed = items.filter(i => i.status === 'completed').length;
  
  const typeCounts = {
    movie: items.filter(i => i.type === 'movie').length,
    tv: items.filter(i => i.type === 'tv').length,
    book: items.filter(i => i.type === 'book').length,
    game: items.filter(i => i.type === 'game').length,
    music: items.filter(i => i.type === 'music').length,
  };

  const { handleExport, openImport, ImportModal } = useBackupRestore();

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          dispatch(clearAuth());
          dispatch(setMediaItems([]));
        },
      },
    ]);
  };

  return (
    <Screen style={styles.container}>
      <Text style={[styles.title, { color: palette.textPrimary }]}>Profile</Text>

      <View style={[styles.card, { backgroundColor: palette.surface }]}>
        <Text style={[styles.name, { color: palette.textPrimary }]}>
          {user?.displayName ?? 'OpenShelf User'}
        </Text>
        <Text style={[styles.email, { color: palette.textSecondary }]}>
          {user?.email}
        </Text>
      </View>

      <View style={[styles.statsRow, { backgroundColor: palette.surface }]}>
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: palette.primary }]}>{items.length}</Text>
          <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Total</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: palette.border }]} />
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: palette.success }]}>{completed}</Text>
          <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Completed</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: palette.textPrimary, marginTop: spacing.md }]}>
        Type Breakdown
      </Text>
      <View style={[styles.typeRow, { backgroundColor: palette.surface }]}>
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: palette.textPrimary }]}>{typeCounts.movie}</Text>
          <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Movies</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: palette.textPrimary }]}>{typeCounts.tv}</Text>
          <Text style={[styles.statLabel, { color: palette.textSecondary }]}>TV</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: palette.textPrimary }]}>{typeCounts.book}</Text>
          <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Books</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: palette.textPrimary }]}>{typeCounts.game}</Text>
          <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Games</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: palette.textPrimary }]}>{typeCounts.music}</Text>
          <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Music</Text>
        </View>
      </View>

      <ActivityHeatmap />

      <Pressable
        style={[styles.button, { backgroundColor: palette.surface, borderColor: palette.border }]}
        onPress={handleExport}
      >
        <Text style={[styles.buttonText, { color: palette.textPrimary }]}>
          Export shelf (JSON)
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, { backgroundColor: palette.surface, borderColor: palette.border }]}
        onPress={openImport}
      >
        <Text style={[styles.buttonText, { color: palette.textPrimary }]}>
          Import shelf (JSON)
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, { backgroundColor: palette.surface, borderColor: palette.border }]}
        onPress={toggleTheme}
      >
        <Text style={[styles.buttonText, { color: palette.textPrimary }]}>
          Switch to {isDark ? 'light' : 'dark'} theme
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.signOut, { borderColor: palette.danger }]}
        onPress={handleSignOut}
      >
        <Text style={[styles.buttonText, { color: palette.danger }]}>Sign out</Text>
      </Pressable>
      {ImportModal}
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
    marginBottom: spacing.lg,
  },
  card: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
  },
  email: {
    fontSize: 14,
    marginTop: 4,
  },
  statsRow: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  typeRow: {
    flexDirection: 'row',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
    justifyContent: 'space-around',
  },
  divider: {
    width: 1,
  },
  button: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  signOut: {
    backgroundColor: 'transparent',
    marginTop: spacing.md,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
