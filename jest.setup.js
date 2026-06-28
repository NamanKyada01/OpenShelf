import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Removed deprecated NativeAnimatedHelper mock
// Mock Notifee
jest.mock('@notifee/react-native', () => ({
  requestPermission: jest.fn(),
  cancelAllNotifications: jest.fn(),
  createChannel: jest.fn(),
  createTriggerNotification: jest.fn(),
}));

// Mock Firebase
jest.mock('@react-native-firebase/app', () => ({
  app: jest.fn(),
}));
jest.mock('@react-native-firebase/auth', () => () => ({
  currentUser: null,
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));
jest.mock('@react-native-firebase/firestore', () => () => ({
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      set: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
    })),
    where: jest.fn(() => ({
      get: jest.fn(),
      onSnapshot: jest.fn(),
    })),
  })),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock op-sqlite
jest.mock('@op-engineering/op-sqlite', () => ({
  open: jest.fn(() => ({
    execute: jest.fn(),
    transaction: jest.fn(),
    close: jest.fn(),
  })),
}));
