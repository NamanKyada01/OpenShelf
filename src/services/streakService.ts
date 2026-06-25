import firestore from '@react-native-firebase/firestore';
import type { StreakData } from '../types';
import { userDoc } from './firebase';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function buildWeeklyActivity(lastDates: string[]): boolean[] {
  const week: boolean[] = [false, false, false, false, false, false, false];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    week[i] = lastDates.includes(key);
  }
  return week;
}

function normalizeStreak(raw: Partial<StreakData> | undefined): StreakData {
  const today = todayKey();
  const lastActiveDate = raw?.lastActiveDate ?? null;
  return {
    currentStreak: raw?.currentStreak ?? 0,
    longestStreak: raw?.longestStreak ?? 0,
    lastActiveDate,
    todayLogged: lastActiveDate === today,
    weeklyActivity:
      raw?.weeklyActivity?.length === 7
        ? raw.weeklyActivity
        : buildWeeklyActivity(lastActiveDate ? [lastActiveDate] : []),
  };
}

export async function getStreakData(userId: string): Promise<StreakData> {
  const doc = await userDoc(userId).get();
  const streak = doc.data()?.streak as Partial<StreakData> | undefined;
  return normalizeStreak(streak);
}

export function subscribeToStreak(
  userId: string,
  onUpdate: (data: StreakData) => void,
) {
  return userDoc(userId).onSnapshot(snapshot => {
    const streak = snapshot.data()?.streak as Partial<StreakData> | undefined;
    onUpdate(normalizeStreak(streak));
  });
}

export async function recordDailyActivity(userId: string): Promise<StreakData> {
  const docRef = userDoc(userId);
  const today = todayKey();
  const yesterday = yesterdayKey();

  const result = await firestore().runTransaction(async transaction => {
    const doc = await transaction.get(docRef);
    const current = normalizeStreak(doc.data()?.streak);

    if (current.lastActiveDate === today) {
      return current;
    }

    let newStreak = 1;
    if (current.lastActiveDate === yesterday) {
      newStreak = current.currentStreak + 1;
    }

    const longestStreak = Math.max(current.longestStreak, newStreak);
    const weeklyActivity = [...current.weeklyActivity];
    weeklyActivity[6] = true;

    const updated: StreakData = {
      currentStreak: newStreak,
      longestStreak,
      lastActiveDate: today,
      todayLogged: true,
      weeklyActivity,
    };

    transaction.set(
      docRef,
      {
        streak: {
          currentStreak: updated.currentStreak,
          longestStreak: updated.longestStreak,
          lastActiveDate: updated.lastActiveDate,
          weeklyActivity: updated.weeklyActivity,
        },
      },
      { merge: true },
    );

    return updated;
  });

  return result;
}
