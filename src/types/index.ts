export type MediaType = 'movie' | 'tv' | 'book' | 'game';

export type MediaStatus = 'plan' | 'in_progress' | 'completed' | 'dropped';

export interface MediaItem {
  id: string;
  userId: string;
  title: string;
  type: MediaType;
  status: MediaStatus;
  rating?: number;
  notes?: string;
  posterUrl?: string;
  tags?: string[];
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  todayLogged: boolean;
  weeklyActivity: boolean[];
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}
