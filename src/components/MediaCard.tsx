import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import type { MediaItem } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { getMediaTypeConfig } from '../media-types';
import { radius, spacing } from '../theme/spacing';
import { StatusChip } from './StatusChip';

interface MediaCardProps {
  item: MediaItem;
  onPress?: () => void;
}

export function MediaCard({ item, onPress }: MediaCardProps) {
  const { palette } = useTheme();
  const config = getMediaTypeConfig(item.type);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 12, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 300 });
  };

  return (
    <Animated.View style={[animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, { backgroundColor: palette.surface }]}
      >
      <View style={[styles.poster, { backgroundColor: config.color }]}>
        <Text style={styles.posterText}>{config.icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: palette.textPrimary }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.meta, { color: palette.textSecondary }]}>
          {config.label}
          {item.tags?.length ? ` · ${item.tags.slice(0, 2).join(', ')}` : ''}
        </Text>
        <StatusChip status={item.status} />
      </View>
      {item.rating ? (
        <Text style={[styles.rating, { color: palette.streak }]}>★ {item.rating}</Text>
      ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  poster: {
    width: 48,
    height: 68,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  meta: {
    fontSize: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '700',
  },
});
