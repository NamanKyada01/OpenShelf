import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { upsertManyMediaLocal } from '../db/mediaRepository';
import { loadMediaForUser } from '../db/syncService';
import { StreakProvider } from '../contexts/StreakContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { onAuthStateChanged } from '../services/authService';
import { subscribeToUserMedia } from '../services/mediaService';
import { setUser, setAuthLoading } from '../store/slices/authSlice';
import { setMediaItems, setMediaError } from '../store/slices/mediaSlice';
import { LoginScreen } from '../screens/LoginScreen';
import { MainStack } from './MainStackNavigator';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppShell() {
  const { palette, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(setAuthLoading(true));
    const unsubscribe = onAuthStateChanged(profile => {
      dispatch(setUser(profile));
    });
    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      dispatch(setMediaItems([]));
      return;
    }

    let active = true;

    loadMediaForUser(user.uid)
      .then(items => {
        if (active) {
          dispatch(setMediaItems(items));
        }
      })
      .catch(error => dispatch(setMediaError(error.message)));

    const unsubscribe = subscribeToUserMedia(
      user.uid,
      items => {
        upsertManyMediaLocal(items);
        dispatch(setMediaItems(items));
      },
      error => dispatch(setMediaError(error.message)),
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [user, dispatch]);

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: palette.background,
      card: palette.surface,
      text: palette.textPrimary,
      border: palette.border,
      primary: palette.primary,
    },
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: palette.background }}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  return (
    <StreakProvider userId={user?.uid ?? null}>
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen name="Main" component={MainStack} />
          ) : (
            <Stack.Screen name="Auth">
              {() => <LoginScreen onAuthenticated={() => undefined} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </StreakProvider>
  );
}

export function AppNavigator() {
  return <AppShell />;
}
