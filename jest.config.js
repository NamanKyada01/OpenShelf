module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native(-community)?|@react-navigation|react-redux|@op-engineering/op-sqlite|immer|@reduxjs/toolkit|react-native-worklets)',
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
};
