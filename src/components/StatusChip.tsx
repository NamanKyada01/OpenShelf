import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { MediaStatus } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { radius } from '../theme/spacing';

const LABELS: Record<MediaStatus, string> = {
  plan: 'Plan',
  in_progress: 'In Progress',
  completed: 'Completed',
  dropped: 'Dropped',
};

const STATUS_COLORS: Record<MediaStatus, string> = {
  plan: '#6B6B80',
  in_progress: '#6C63FF',
  completed: '#58CC02',
  dropped: '#FF4B4B',
};

export function StatusChip({ status }: { status: MediaStatus }) {
  const { palette } = useTheme();
  const color = STATUS_COLORS[status];

  return (
    <View style={[styles.chip, { backgroundColor: `${color}22`, borderColor: color }]}>
      <Text style={[styles.text, { color: palette.textPrimary }]}>{LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
