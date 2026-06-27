# Contributing to OpenShelf

First off, thank you for considering contributing to OpenShelf! It's people like you that make the open-source community such a great place to learn, inspire, and create.

## 🛠 How to Contribute

### 1. Reporting Bugs
If you find a bug, please use the **Bug Report** issue template. Include as much detail as possible:
- Steps to reproduce the bug.
- Expected vs. actual behavior.
- The platform (iOS/Android) and OS version.

### 2. Suggesting Enhancements
Have an idea for a new feature? Great! Use the **Feature Request** issue template. Describe how it should work and why it would be beneficial to the community.

### 3. Adding New Media Types
Currently, OpenShelf supports Movies, TV, Books, and Games. To add a new media type (e.g., Music, Board Games):
1. Update `MediaType` in `src/types.ts`.
2. Add a new configuration block in `src/media-types/index.ts` with a custom label and icon.
3. Update the Type Breakdown in `src/screens/ProfileScreen.tsx`.

### 4. Adding New API Providers
Want to support a new search API? 
1. Create a new provider file in `src/providers/yourProvider.ts`.
2. Implement the `MetadataProvider` interface from `src/providers/types.ts`.
3. Export your provider in `src/providers/index.ts` and add it to the `providers` array.

## 💻 Development Setup
1. Fork the repo and create your branch from `main`.
2. Install dependencies with `npm install`.
3. Ensure your code passes linting: `npm run lint`.
4. Check TypeScript types: `npx tsc --noEmit`.
5. Submit a Pull Request with a clear description of your changes!

We look forward to seeing your pull requests!
