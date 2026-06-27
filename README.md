# 📚 OpenShelf

OpenShelf is a fast, offline-first personal media tracking application built with React Native. It allows you to organize your Movies, TV Shows, Books, and Games all in one beautiful dark-mode interface!

## ✨ Features
- **Offline-First**: Built with `@op-engineering/op-sqlite` for blazing fast local database queries.
- **Cross-Platform**: Runs on Android and iOS seamlessly.
- **Smart Search**: Integrated with live APIs (TMDB for Movies/TV and Open Library for Books).
- **Personalized Stats**: Keep track of your completed items and activity streaks.
- **Backup & Restore**: Easily export your entire library to JSON and import it on any device.

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 22.11.0)
- React Native CLI environment setup (Android Studio / Xcode)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NamanKyada01/OpenShelf.git
   cd OpenShelf
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the App:**
   ```bash
   # For Android
   npm run android

   # For iOS
   npm run ios
   ```

## ⚙️ Configuration (API Keys)
To enable live search for Movies and TV shows, you will need a TMDB API key.
1. Get a free API key from [The Movie Database (TMDB)](https://www.themoviedb.org/).
2. Open `src/providers/tmdb.ts` and set your key:
   ```typescript
   const TMDB_API_KEY = 'YOUR_API_KEY_HERE';
   ```

## 🤝 Contributing
We love contributions! Please check out our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how you can add new features, media types, or API providers.

## 📄 License
This project is open-source and available under the MIT License.
