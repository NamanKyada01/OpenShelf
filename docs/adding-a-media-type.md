# Adding a Media Type

Example: adding **Anime** support.

## 1. Extend the type union

In `src/types/index.ts`:

```typescript
export type MediaType = 'movie' | 'tv' | 'book' | 'game' | 'anime';
```

## 2. Register in media-types plugin

In `src/media-types/index.ts`:

```typescript
anime: {
  type: 'anime',
  label: 'Anime',
  icon: '🎌',
  color: '#E91E63',
  providerKey: 'anilist', // optional, for v0.2
},
```

## 3. Add provider stub (optional)

In `src/providers/index.ts`:

```typescript
export const anilistProvider = createStubProvider('anilist', 'AniList', ['anime']);
```

## 4. UI updates

- `AddMediaModal` — auto-picks up types from `getMediaTypeOptions()`
- `LibraryScreen` filters — auto-picks up from registry
- `StatsScreen` — auto-includes in type breakdown

## 5. Test checklist

- [ ] Add anime item manually
- [ ] Filter library by anime
- [ ] See anime count in Stats tab
- [ ] Export/import JSON preserves type
- [ ] SQLite + Firestore sync works offline/online

## 6. Open a PR

- Title: `feat(media-type): add anime support`
- Label: `media-type`
- Include screenshot of add modal + library filter
