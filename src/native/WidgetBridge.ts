import { NativeModules, Platform } from 'react-native';

interface WidgetBridgeModule {
  updateStreakWidget(streakCount: number, todayLogged: boolean): void;
}

const WidgetBridgeNative = NativeModules.WidgetBridge as
  | WidgetBridgeModule
  | undefined;

export function syncWidgetStreak(streakCount: number, todayLogged: boolean) {
  if (Platform.OS !== 'android') {
    return;
  }
  WidgetBridgeNative?.updateStreakWidget(streakCount, todayLogged);
}
