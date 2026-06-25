import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import { Screen } from '../components/Screen';
import { useTheme } from '../contexts/ThemeContext';
import { signIn, signUp } from '../services/authService';
import { radius, spacing } from '../theme/spacing';

interface AuthScreenProps {
  onAuthenticated: () => void;
}

export function LoginScreen({ onAuthenticated }: AuthScreenProps) {
  const { palette } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await signUp(email, password, displayName.trim() || undefined);
      } else {
        await signIn(email, password);
      }
      onAuthenticated();
    } catch (error) {
      Alert.alert('Auth error', error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen style={styles.container}>
      <Text style={[styles.logo, { color: palette.primary }]}>OpenShelf</Text>
      <Text style={[styles.tagline, { color: palette.textSecondary }]}>
        Track your media backlog. Build your streak.
      </Text>

      {isRegister ? (
        <>
          <Text style={[styles.label, { color: palette.textSecondary }]}>Display name</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your name"
            placeholderTextColor={palette.textMuted}
            style={[styles.input, inputStyle(palette)]}
          />
        </>
      ) : null}

      <Text style={[styles.label, { color: palette.textSecondary }]}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@example.com"
        placeholderTextColor={palette.textMuted}
        style={[styles.input, inputStyle(palette)]}
      />

      <Text style={[styles.label, { color: palette.textSecondary }]}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••••"
        placeholderTextColor={palette.textMuted}
        style={[styles.input, inputStyle(palette)]}
      />

      <Pressable
        style={[styles.button, { backgroundColor: palette.primary }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>{isRegister ? 'Create account' : 'Sign in'}</Text>
        )}
      </Pressable>

      <Pressable onPress={() => setIsRegister(prev => !prev)}>
        <Text style={[styles.switch, { color: palette.textSecondary }]}>
          {isRegister ? 'Already have an account? Sign in' : 'New here? Create an account'}
        </Text>
      </Pressable>
    </Screen>
  );
}

function inputStyle(palette: {
  textPrimary: string;
  border: string;
  surface: string;
}) {
  return {
    color: palette.textPrimary,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  };
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: spacing.lg,
  },
  logo: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: 15,
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: spacing.md,
  },
  button: {
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  switch: {
    textAlign: 'center',
    marginTop: spacing.lg,
    fontSize: 14,
  },
});
