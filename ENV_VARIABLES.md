# Environment Variables in JSON Generator UI

This document explains how to set up and use environment variables in this Vite React project.

## Environment Files

Vite uses dotenv to load environment variables from the following files:

- `.env` - Loaded in all cases
- `.env.local` - Loaded in all cases, ignored by git
- `.env.[mode]` - Loaded only in specified mode
- `.env.[mode].local` - Loaded only in specified mode, ignored by git

Where `[mode]` can be `development`, `production`, or `test`.

## Variable Naming

In Vite, only variables prefixed with `VITE_` are exposed to your client source code.

```
VITE_API_URL=https://api.example.com  # ✅ Exposed to your app
API_SECRET=super-secret-value         # ❌ NOT exposed to your app (use for server-side only)
```

## Accessing Environment Variables

You can access environment variables in two ways:

### 1. Using `process.env` (After our configuration)

```jsx
// Access environment variables with process.env
const apiUrl = process.env.VITE_API_URL;
const appName = process.env.VITE_APP_NAME;
```

### 2. Using Vite's native `import.meta.env`

```jsx
// Access environment variables with import.meta.env (Vite's native approach)
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
```

## Adding New Environment Variables

1. Add your variable to the appropriate `.env` file
2. Make sure it starts with `VITE_`
3. Use it in your code with either `process.env.VITE_YOUR_VARIABLE` or `import.meta.env.VITE_YOUR_VARIABLE`
4. Restart your development server to pick up changes

## Example Files

### `.env` (shared configuration, checked into git)

```
VITE_API_URL=https://api.example.com
VITE_APP_NAME=JSON Generator UI
```

### `.env.local` (local overrides, not checked into git)

```
VITE_API_URL=http://localhost:3000/api
VITE_DEBUG_MODE=true
```

## Type Definitions (for TypeScript)

For TypeScript projects, you may want to add type definitions for your environment variables in a `env.d.ts` file:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_DEBUG_MODE: string;
  // Add more variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## Deployment Considerations

When deploying to production:

1. Set environment variables directly on your hosting platform (Vercel, Netlify, etc.)
2. Or use a `.env.production` file
3. Remember that all `VITE_` prefixed variables are included in your client bundle, so don't put sensitive information there
