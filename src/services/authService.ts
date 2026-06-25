import auth from '@react-native-firebase/auth';
import type { UserProfile } from '../types';
import { userDoc } from './firebase';

function mapUser(user: NonNullable<ReturnType<typeof auth>['currentUser']>): UserProfile {
  return {
    uid: user.uid,
    email: user.email ?? '',
    displayName: user.displayName ?? undefined,
    photoURL: user.photoURL ?? undefined,
  };
}

export async function signIn(email: string, password: string): Promise<UserProfile> {
  const result = await auth().signInWithEmailAndPassword(email.trim(), password);
  if (!result.user) {
    throw new Error('Sign in failed');
  }
  return mapUser(result.user);
}

export async function signUp(
  email: string,
  password: string,
  displayName?: string,
): Promise<UserProfile> {
  const result = await auth().createUserWithEmailAndPassword(email.trim(), password);
  if (!result.user) {
    throw new Error('Sign up failed');
  }

  if (displayName) {
    await result.user.updateProfile({ displayName });
  }

  await userDoc(result.user.uid).set(
    {
      email: result.user.email,
      displayName: displayName ?? null,
      createdAt: new Date().toISOString(),
      streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
        weeklyActivity: [false, false, false, false, false, false, false],
      },
    },
    { merge: true },
  );

  return mapUser(result.user);
}

export async function signOut(): Promise<void> {
  await auth().signOut();
}

export function onAuthStateChanged(callback: (user: UserProfile | null) => void) {
  return auth().onAuthStateChanged(firebaseUser => {
    callback(firebaseUser ? mapUser(firebaseUser) : null);
  });
}

export function getCurrentUser(): UserProfile | null {
  const user = auth().currentUser;
  return user ? mapUser(user) : null;
}
