# Feature Flags

This directory contains feature flag configurations that allow you to easily enable or disable features across the application.

## How to Use

### Toggling the Data Collection Game

To enable or disable the Data Collection Game:

1. Open `src/config/features.ts`
2. Find the `DATA_COLLECTION_GAME` property
3. Set it to:
   - `true` - Game button appears on homepage, game is playable
   - `false` - Game button is hidden, game is disabled

```typescript
export const FEATURES = {
  DATA_COLLECTION_GAME: true,  // Change to false to disable
} as const;
```

### Changes Take Effect Immediately

- In **development mode** (`npm run dev`): Changes are reflected immediately after saving
- In **production**: You'll need to rebuild the application (`npm run build`)

## Adding New Feature Flags

To add a new feature flag:

1. Add a new property to the `FEATURES` object in `features.ts`
2. Add a JSDoc comment describing what the flag controls
3. Import and use the flag in your components:

```typescript
import { FEATURES } from '@/config/features';

// In your component
{FEATURES.YOUR_FEATURE && <YourComponent />}
```
