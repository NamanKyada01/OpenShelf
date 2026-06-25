# OpenShelf

Open-source Android media backlog tracker built with **React Native CLI**. Track movies, TV, books, and games — build a Duolingo-style daily streak, and show it on your home screen with a custom widget.

[![Figma Design](https://img.shields.io/badge/Figma-Design-6C63FF?style=flat&logo=figma)](https://www.figma.com/design/EMgclf9mGfRbhuUSWl9x6y/OpenShelf-Mobile)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?style=flat&logo=react)](https://reactnative.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?style=flat&logo=firebase)](https://firebase.google.com/)

## Features

- **Media backlog** — Track movies, TV, books, and games with status (Plan → In Progress → Completed)
- **Firebase Auth** — Email/password sign in and sign up
- **Cloud sync** — Firestore-backed library synced across sessions
- **Daily streak** — Duolingo-style streak when you log media activity each day
- **Android home widget** — Live streak count on your home screen
- **Modern UI** — Dark-first design with `react-native-modal` bottom sheets
- **Redux + Context** — Redux Toolkit for auth/media state; React Context for theme and streak

## Design

UI tokens and screens are defined in Figma:

**[OpenShelf Mobile — Figma file](https://www.figma.com/design/EMgclf9mGfRbhuUSWl9x6y/OpenShelf-Mobile)**

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | React Native CLI 0.86 + TypeScript |
| Navigation | React Navigation (native stack + bottom tabs) |
| State | Redux Toolkit + React Context (theme, streak) |
| Backend | Firebase Auth + Cloud Firestore |
| Modals | react-native-modal |
| Platform | Android-first (custom widget) |

## Getting started

### Prerequisites

- Node.js 22+
- Android Studio + SDK
- Java 17
- A [Firebase project](https://console.firebase.google.com/)

### 1. Clone and install

```bash
git clone https://github.com/NamanKyada01/OpenShelf.git
cd OpenShelf
npm install
```

### 2. Firebase setup

1. Create a Firebase project and enable **Email/Password** authentication.
2. Create a **Cloud Firestore** database.
3. Download `google-services.json` from Firebase Console → Project settings → Your apps → Android (`com.openshelf`).
4. Replace `android/app/google-services.json` with your file.
5. Deploy Firestore rules from `firestore.rules` (or paste in Firebase Console).

### 3. Run on Android

```bash
npm run android
```

### 4. Add the streak widget

Long-press your Android home screen → Widgets → **OpenShelf Streak**.

## Project structure

```
src/
├── components/     # MediaCard, AddMediaModal, StreakFlame
├── contexts/       # ThemeContext, StreakContext
├── navigation/     # AppNavigator, MainTabs
├── screens/        # Home, Library, Streak, Profile, Login
├── services/       # Firebase, auth, media, streak
├── store/          # Redux slices (auth, media)
└── native/         # WidgetBridge JS interface
android/            # Native Android widget + Firebase config
```

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Adding a new media type
- Wiring a metadata API (TMDB, Open Library, etc.)
- Improving the Android widget
- Translations and accessibility

## Roadmap

- [x] Auth + Firestore sync
- [x] Media CRUD with filters
- [x] Daily streak system
- [x] Android home screen widget
- [ ] TMDB / Open Library search
- [ ] Stats dashboard & yearly recap
- [ ] iOS support

## License

MIT — see [LICENSE](LICENSE).
