import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import type { MediaStatus, MediaType } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { getMediaTypeOptions } from '../media-types';
import { radius, spacing } from '../theme/spacing';

const STATUSES: { label: string; value: MediaStatus }[] = [
  { label: 'Plan', value: 'plan' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Dropped', value: 'dropped' },
];

interface AddMediaModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    type: MediaType;
    status: MediaStatus;
    notes?: string;
    tags?: string[];
  }) => Promise<void>;
}

export function AddMediaModal({ visible, onClose, onSubmit }: AddMediaModalProps) {
  const { palette } = useTheme();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MediaType>('movie');
  const [status, setStatus] = useState<MediaStatus>('plan');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setTitle('');
    setType('movie');
    setStatus('plan');
    setNotes('');
    setTagsInput('');
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      return;
    }
    setLoading(true);
    try {
      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
      await onSubmit({
        title: title.trim(),
        type,
        status,
        notes: notes.trim() || undefined,
        tags: tags.length ? tags : undefined,
      });
      reset();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      backdropOpacity={0.6}
    >
      <View style={[styles.sheet, { backgroundColor: palette.surface }]}>
        <View style={[styles.handle, { backgroundColor: palette.border }]} />
        <Text style={[styles.heading, { color: palette.textPrimary }]}>Add to Shelf</Text>

        <Text style={[styles.label, { color: palette.textSecondary }]}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="What are you tracking?"
          placeholderTextColor={palette.textMuted}
          style={[
            styles.input,
            { color: palette.textPrimary, borderColor: palette.border, backgroundColor: palette.background },
          ]}
        />

        <Text style={[styles.label, { color: palette.textSecondary }]}>Type</Text>
        <View style={styles.row}>
          {getMediaTypeOptions().map(opt => (
            <Pressable
              key={opt.type}
              onPress={() => setType(opt.type)}
              style={[
                styles.chip,
                {
                  backgroundColor: type === opt.type ? palette.primary : palette.background,
                  borderColor: palette.border,
                },
              ]}
            >
              <Text
                style={{
                  color: type === opt.type ? '#FFF' : palette.textSecondary,
                  fontWeight: '600',
                  fontSize: 13,
                }}
              >
                {opt.icon} {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { color: palette.textSecondary }]}>Status</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusRow}>
          {STATUSES.map(opt => (
            <Pressable
              key={opt.value}
              onPress={() => setStatus(opt.value)}
              style={[
                styles.chip,
                {
                  backgroundColor: status === opt.value ? palette.primaryDark : palette.background,
                  borderColor: palette.border,
                },
              ]}
            >
              <Text
                style={{
                  color: status === opt.value ? '#FFF' : palette.textSecondary,
                  fontWeight: '600',
                  fontSize: 13,
                }}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={[styles.label, { color: palette.textSecondary }]}>Tags (optional)</Text>
        <TextInput
          value={tagsInput}
          onChangeText={setTagsInput}
          placeholder="favorite, rewatch, co-op"
          placeholderTextColor={palette.textMuted}
          style={[
            styles.input,
            { color: palette.textPrimary, borderColor: palette.border, backgroundColor: palette.background },
          ]}
        />

        <Text style={[styles.label, { color: palette.textSecondary }]}>Notes (optional)</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Thoughts..."
          placeholderTextColor={palette.textMuted}
          multiline
          style={[
            styles.input,
            styles.notes,
            { color: palette.textPrimary, borderColor: palette.border, backgroundColor: palette.background },
          ]}
        />

        <Pressable
          style={[styles.submit, { backgroundColor: palette.primary }]}
          onPress={handleSubmit}
          disabled={loading || !title.trim()}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitText}>Add to Shelf</Text>
          )}
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
  },
  notes: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statusRow: {
    flexGrow: 0,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  submit: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
