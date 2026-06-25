# OpenShelf

Open-source **personal media backlog** (Shelf plan) built with React Native CLI. Track movies, TV, books, and games — offline-first with cloud sync, daily streaks, stats, and an Android home widget.

[![Figma Design](https://img.shields.io/badge/Figma-Design-6C63FF?style=flat&logo=figma)](https://www.figma.com/design/EMgclf9mGfRbhuUSWl9x6y/OpenShelf-Mobile)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?style=flat&logo=react)](https://reactnative.dev/)

## Features

- **Media backlog** — Plan → In Progress → Completed / Dropped pipeline
- **Offline-first** — SQLite local DB; works without network
- **Cloud sync** — Firebase Auth + Firestore (optional when online)
- **Rating, notes, tags, dates** — Full detail screen per item
- **Stats dashboard** — Completed by month, type breakdown, avg rating
- **Export / import JSON** — No vendor lock-in
- **Daily streak** — Duolingo-style consistency tracking
- **Android widget** — Streak on your home screen
- **Contributor-ready** — Plugin media types, provider stubs, issue templates, CI

## v1 media types

Movies · TV · Books · Games (manual add first; TMDB/Open Library/IGDB stubs ready for v0.2)

## Design

**[OpenShelf Mobile — Figma](https://www.figma.com/design/EMgclf9mGfRbhuUSWl9x6y/OpenShelf-Mobile)**

## Project structure

```
src/
├── config/           # v1 scope
├── db/               # SQLite + sync
├── features/         # stats, library detail, settings
├── media-types/      # plugin registry
├── providers/        # metadata API adapters
├── components/       # shared UI
├── contexts/         # theme + streak
├── store/            # Redux
└── navigation/
docs/
├── architecture.md
└── adding-a-media-type.md
.github/              # CI + issue templates
```

## Getting started

```bash
git clone https://github.com/NamanKyada01/OpenShelf.git
cd OpenShelf
npm install
```

1. Replace `android/app/google-services.json` with your Firebase file
2. Enable Email/Password auth + Firestore
3. Deploy `firestore.rules`
4. `npm run android`

## Roadmap

- [x] Offline SQLite + Firestore sync
- [x] Media CRUD, filters, detail screen
- [x] Stats dashboard
- [x] Export/import JSON
- [x] Daily streak + Android widget
- [x] Contributor docs + CI
- [ ] TMDB / Open Library search (v0.2)
- [ ] Yearly recap charts
- [ ] iOS support

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/adding-a-media-type.md](docs/adding-a-media-type.md).

## License

MIT
