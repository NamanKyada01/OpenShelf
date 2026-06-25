# Contributing to OpenShelf

OpenShelf implements the **Shelf** open-source media backlog plan. We welcome PRs!

## Architecture

Read [docs/architecture.md](docs/architecture.md) before contributing.

## Quick start

1. Fork + clone
2. Firebase setup (see README)
3. `npm run android`
4. Branch: `feature/your-feature`
5. `npm run lint` && `npx tsc --noEmit`

## Contribution lanes

| Label | Examples |
|-------|----------|
| `good first issue` | Locales, filter chips, README |
| `media-type` | Anime, podcasts, manga |
| `provider` | TMDB, Open Library, IGDB |
| `platform` | Android widget, iOS |
| `design` | Figma token sync |
| `testing` | Jest, Detox |

## Adding a media type

Full walkthrough: [docs/adding-a-media-type.md](docs/adding-a-media-type.md)

## Code conventions

- TypeScript strict
- SQLite first, Firestore sync second
- Redux for auth/media; Context for theme/streak
- One feature per PR when possible
