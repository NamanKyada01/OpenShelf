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
import { useTranslation } from 'react-i18next';
import { Screen } from '../components/Screen';
import { AddMediaModal } from '../components/AddMediaModal';
import { MediaCard } from '../components/MediaCard';
import { StreakBanner } from '../components/StreakFlame';
import { useStreak } from '../contexts/StreakContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import type { MainStackParamList } from '../navigation/MainStack';
import { createMediaItem } from '../services/mediaService';
import { addMediaItem } from '../store/slices/mediaSlice';
import { spacing } from '../theme/spacing';

type Nav = NativeStackNavigationProp<MainStackParamList>;

export function HomeScreen() {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { items } = useAppSelector(state => state.media);
  const { recordActivity } = useStreak();
  const [modalVisible, setModalVisible] = useState(false);

  const activeItems = useMemo(
    () => items.filter(i => i.status === 'in_progress').slice(0, 5),
    [items],
  );

  const handleAdd = async (data: Parameters<typeof createMediaItem>[1]) => {
    if (!user) {
      return;
    }
    const item = await createMediaItem(user.uid, data);
    dispatch(addMediaItem(item));
    await recordActivity();
  };

  return (
    <Screen>
      <FlatList
        data={activeItems}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <Text style={[styles.greeting, { color: palette.textPrimary }]}>
              {t('greeting')}{user?.displayName ? `, ${user.displayName}` : ''} 👋
            </Text>
            <StreakBanner />
            <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>
              {t('currently_active')}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={[styles.empty, { color: palette.textSecondary }]}>
            Nothing in progress. Add something to your shelf!
          </Text>
        }
        renderItem={({ item }) => (
          <MediaCard
            item={item}
            onPress={() => navigation.navigate('MediaDetail', { itemId: item.id })}
          />
        )}
      />

      <Pressable
        style={[styles.fab, { backgroundColor: palette.primary }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <AddMediaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAdd}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  headerBlock: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  empty: {
    textAlign: 'center',
    marginTop: spacing.xl,
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  fabText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '300',
    marginTop: -2,
  },
});
