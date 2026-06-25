# Contributing to OpenShelf

Thank you for helping build OpenShelf! This project is designed for easy, modular contributions.

## Quick start

1. Fork the repo and clone locally
2. Follow [README.md](README.md) Firebase setup
3. Create a branch: `git checkout -b feature/your-feature`
4. Run `npm run android` to verify
5. Open a PR with a clear description and screenshots

## Contribution lanes

| Label | Examples |
|-------|----------|
| `good first issue` | UI polish, copy tweaks, new filter chip |
| `media-type` | Add anime, podcasts, manga support |
| `provider` | TMDB, Open Library, IGDB integration |
| `platform` | Android widget improvements |
| `design` | Figma ↔ code token sync |

## Architecture notes

- **Redux** — Auth and media library state (`src/store/`)
- **Context** — Theme toggle and streak real-time UI (`src/contexts/`)
- **Firestore** — `users/{uid}` for profile + streak; `media/{id}` for items
- **Android widget** — Reads from SharedPreferences via `WidgetBridge` native module

## Adding a media type

1. Extend `MediaType` in `src/types/index.ts`
2. Add label in `AddMediaModal` and `MediaCard`
3. Add filter chip in `LibraryScreen`
4. Update README and open a PR

## Code style

- TypeScript strict mode
- Match existing file structure and naming
- Keep PRs focused — one feature per PR when possible

## Questions?

Open a [GitHub Discussion](https://github.com/NamanKyada01/OpenShelf/discussions) or issue.
