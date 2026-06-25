import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface RatingStarsProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: number;
}

export function RatingStars({ value, onChange, size = 24 }: RatingStarsProps) {
  const { palette } = useTheme();

  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map(star => (
        <Pressable
          key={star}
          onPress={() => onChange?.(star)}
          disabled={!onChange}
          hitSlop={8}
        >
          <Text
            style={{
              fontSize: size,
              color: star <= value ? palette.streak : palette.textMuted,
            }}
          >
            ★
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
  },
});
