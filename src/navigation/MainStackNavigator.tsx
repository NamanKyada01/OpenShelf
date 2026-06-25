import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MediaDetailScreen } from '../features/library/MediaDetailScreen';
import type { MainStackParamList } from './MainStack';
import { MainTabs } from './MainTabs';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen name="MediaDetail" component={MediaDetailScreen} />
    </Stack.Navigator>
  );
}
