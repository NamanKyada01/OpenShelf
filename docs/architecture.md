# Architecture

OpenShelf follows the **Shelf** open-source plan: offline-first local storage with optional Firebase cloud sync.

## Data flow

```
User action → SQLite (source of truth) → Firestore (background sync)
                    ↓
              Redux store → UI
```

1. **Reads** load from SQLite first for instant offline access.
2. **Writes** persist to SQLite immediately, then sync to Firestore when online.
3. **Firestore snapshots** update SQLite cache and Redux for multi-device consistency.

## Folder structure

```
src/
├── config/           # v1 scope constants
├── db/               # SQLite schema, repository, sync service
├── features/         # Domain screens + hooks (stats, library, settings)
├── media-types/      # Plugin registry per media type (movie, tv, book, game)
├── providers/        # Metadata API adapters (TMDB, Open Library, IGDB stubs)
├── components/       # Shared UI (MediaCard, RatingStars, AddMediaModal)
├── contexts/         # Theme + streak (React Context)
├── store/            # Redux Toolkit slices
├── services/         # Firebase auth + media orchestration
└── navigation/       # Stack + tab navigators
```

## State management

| Concern | Tool |
|---------|------|
| Auth + media list | Redux Toolkit |
| Theme mode | React Context |
| Daily streak | React Context + Firestore |
| Local persistence | op-sqlite |

## Navigation

- **Root stack:** Auth | Main
- **Main stack:** Tabs | MediaDetail
- **Tabs:** Home, Library, Stats, Streak, Profile

## v1 scope

- Media types: movie, tv, book, game
- Manual add first; provider search infrastructure ready for v0.2
- Dark-first minimal UI

## Contributing extensions

See [adding-a-media-type.md](./adding-a-media-type.md).
