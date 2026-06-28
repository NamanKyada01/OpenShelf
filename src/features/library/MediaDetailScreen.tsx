import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Markdown from 'react-native-markdown-display';
import { RatingStars } from '../../components/RatingStars';
import { Screen } from '../../components/Screen';
import { StatusChip } from '../../components/StatusChip';
import { useStreak } from '../../contexts/StreakContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getMediaTypeConfig } from '../../media-types';
import type { MainStackParamList } from '../../navigation/MainStack';
import { updateMediaItem, deleteMediaItem } from '../../services/mediaService';
import { updateMediaItem as updateMediaInStore, removeMediaItem as removeFromStore } from '../../store/slices/mediaSlice';
import type { MediaStatus } from '../../types';
import { radius, spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<MainStackParamList, 'MediaDetail'>;

const STATUSES: MediaStatus[] = ['plan', 'in_progress', 'completed', 'dropped'];

export function MediaDetailScreen({ route, navigation }: Props) {
  const { itemId } = route.params;
  const { palette } = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const item = useAppSelector(state => state.media.items.find(i => i.id === itemId));
  const { recordActivity } = useStreak();
  const [notes, setNotes] = useState(item?.notes ?? '');
  const [tagsInput, setTagsInput] = useState(item?.tags?.join(', ') ?? '');
  const [saving, setSaving] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  if (!item || !user) {
    return (
      <Screen style={styles.center}>
        <Text style={{ color: palette.textSecondary }}>Item not found</Text>
      </Screen>
    );
  }

  const config = getMediaTypeConfig(item.type);

  const persist = async (
    updates: Parameters<typeof updateMediaItem>[2],
  ) => {
    setSaving(true);
    try {
      const updated = await updateMediaItem(item.id, user.uid, updates);
      if (updated) {
        dispatch(updateMediaInStore(updated));
        await recordActivity();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete item', `Remove "${item.title}" from your shelf?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteMediaItem(item.id);
          dispatch(removeFromStore(item.id));
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={{ color: palette.primary, fontWeight: '600' }}>← Back</Text>
        </Pressable>

        <View style={[styles.poster, { backgroundColor: config.color }]}>
          <Text style={styles.posterIcon}>{config.icon}</Text>
        </View>

        <Text style={[styles.title, { color: palette.textPrimary }]}>{item.title}</Text>
        <Text style={[styles.meta, { color: palette.textSecondary }]}>
          {config.label}
        </Text>
        <StatusChip status={item.status} />

        <Text style={[styles.section, { color: palette.textPrimary }]}>Status</Text>
        <View style={styles.statusRow}>
          {STATUSES.map(status => (
            <Pressable
              key={status}
              onPress={() => persist({ status })}
              style={[
                styles.statusChip,
                {
                  backgroundColor: item.status === status ? palette.primary : palette.surface,
                  borderColor: palette.border,
                },
              ]}
            >
              <Text
                style={{
                  color: item.status === status ? '#FFF' : palette.textSecondary,
                  fontSize: 12,
                  fontWeight: '600',
                }}
              >
                {status.replace('_', ' ')}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.section, { color: palette.textPrimary }]}>Rating</Text>
        <RatingStars
          value={item.rating ?? 0}
          onChange={rating => persist({ rating })}
        />

        <Text style={[styles.section, { color: palette.textPrimary }]}>Tags</Text>
        <TextInput
          value={tagsInput}
          onChangeText={setTagsInput}
          placeholder="sci-fi, favorite, rewatch"
          placeholderTextColor={palette.textMuted}
          style={[styles.input, { color: palette.textPrimary, borderColor: palette.border, backgroundColor: palette.surface }]}
          onBlur={() =>
            persist({
              tags: tagsInput
                .split(',')
                .map(t => t.trim())
                .filter(Boolean),
            })
          }
        />

        <View style={styles.notesHeader}>
          <Text style={[styles.section, { color: palette.textPrimary, marginTop: 0, marginBottom: 0 }]}>Notes / Journal</Text>
          <Pressable onPress={() => setIsEditingNotes(!isEditingNotes)}>
            <Text style={{ color: palette.primary, fontWeight: '600' }}>
              {isEditingNotes ? 'Preview' : 'Edit'}
            </Text>
          </Pressable>
        </View>

        {isEditingNotes ? (
          <TextInput
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder="Your thoughts... (Markdown supported)"
            placeholderTextColor={palette.textMuted}
            style={[styles.input, styles.notes, { color: palette.textPrimary, borderColor: palette.border, backgroundColor: palette.surface }]}
            onBlur={() => persist({ notes })}
          />
        ) : (
          <View style={[styles.markdownContainer, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            {notes ? (
              <Markdown
                style={{
                  body: { color: palette.textPrimary },
                  link: { color: palette.primary },
                  heading1: { color: palette.textPrimary },
                  heading2: { color: palette.textPrimary },
                }}
              >
                {notes}
              </Markdown>
            ) : (
              <Text style={{ color: palette.textMuted }}>No notes yet. Tap Edit to write a journal entry.</Text>
            )}
          </View>
        )}

        {item.startedAt ? (
          <Text style={[styles.date, { color: palette.textMuted }]}>
            Started: {item.startedAt.slice(0, 10)}
          </Text>
        ) : null}
        {item.completedAt ? (
          <Text style={[styles.date, { color: palette.textMuted }]}>
            Completed: {item.completedAt.slice(0, 10)}
          </Text>
        ) : null}

        <Pressable style={[styles.deleteBtn, { borderColor: palette.danger }]} onPress={handleDelete}>
          <Text style={{ color: palette.danger, fontWeight: '600' }}>Delete from shelf</Text>
        </Pressable>

        {saving ? (
          <Text style={[styles.saving, { color: palette.textMuted }]}>Saving...</Text>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  back: {
    marginBottom: spacing.md,
  },
  poster: {
    width: 80,
    height: 112,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  posterIcon: {
    fontSize: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  section: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 14,
  },
  notes: {
    minHeight: 150,
    textAlignVertical: 'top',
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  markdownContainer: {
    minHeight: 150,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  date: {
    fontSize: 12,
    marginTop: spacing.sm,
  },
  deleteBtn: {
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  saving: {
    textAlign: 'center',
    marginTop: spacing.sm,
    fontSize: 12,
  },
});
