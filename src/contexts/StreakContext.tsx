import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { StreakData } from '../types';
import {
  getStreakData,
  recordDailyActivity,
  subscribeToStreak,
} from '../services/streakService';
import { syncWidgetStreak } from '../native/WidgetBridge';

interface StreakContextValue {
  streak: StreakData;
  loading: boolean;
  recordActivity: () => Promise<void>;
  refreshStreak: () => Promise<void>;
}

const defaultStreak: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  todayLogged: false,
  weeklyActivity: [false, false, false, false, false, false, false],
};

const StreakContext = createContext<StreakContextValue | null>(null);

export function StreakProvider({
  userId,
  children,
}: {
  userId: string | null;
  children: React.ReactNode;
}) {
  const [streak, setStreak] = useState<StreakData>(defaultStreak);
  const [loading, setLoading] = useState(true);

  const refreshStreak = useCallback(async () => {
    if (!userId) {
      setStreak(defaultStreak);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getStreakData(userId);
      setStreak(data);
      syncWidgetStreak(data.currentStreak, data.todayLogged);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const recordActivity = useCallback(async () => {
    if (!userId) {
      return;
    }
    const updated = await recordDailyActivity(userId);
    setStreak(updated);
    syncWidgetStreak(updated.currentStreak, updated.todayLogged);
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setStreak(defaultStreak);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToStreak(userId, data => {
      setStreak(data);
      syncWidgetStreak(data.currentStreak, data.todayLogged);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  const value = useMemo(
    () => ({ streak, loading, recordActivity, refreshStreak }),
    [streak, loading, recordActivity, refreshStreak],
  );

  return (
    <StreakContext.Provider value={value}>{children}</StreakContext.Provider>
  );
}

export function useStreak() {
  const ctx = useContext(StreakContext);
  if (!ctx) {
    throw new Error('useStreak must be used within StreakProvider');
  }
  return ctx;
}
