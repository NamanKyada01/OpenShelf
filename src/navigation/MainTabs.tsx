import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { StatsScreen } from '../features/stats/StatsScreen';
import { useTheme } from '../contexts/ThemeContext';
import { HomeScreen } from '../screens/HomeScreen';
import { LibraryScreen } from '../screens/LibraryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { StreakScreen } from '../screens/StreakScreen';
import type { MainTabParamList } from './MainStack';

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ label, focused, color }: { label: string; focused: boolean; color: string }) {
  const icons: Record<string, string> = {
    Home: '🏠',
    Library: '📚',
    Stats: '📊',
    Streak: '🔥',
    Profile: '👤',
  };
  return (
    <Text style={{ fontSize: focused ? 22 : 20, opacity: focused ? 1 : 0.6 }}>
      {icons[label] ?? '•'}
      {' '}
      <Text style={{ fontSize: 10, color }}>{label}</Text>
    </Text>
  );
}

export function MainTabs() {
  const { palette } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.textMuted,
        tabBarIcon: ({ focused, color }) => (
          <TabIcon label={route.name} focused={focused} color={color} />
        ),
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Streak" component={StreakScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
