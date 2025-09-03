# Migration to TypeScript and Vite

This document outlines the migration of the React Redux API Helpers library from JavaScript/Babel to TypeScript and Vite.

## Changes Made

### 1. Build System Migration
- **From**: Babel + Webpack
- **To**: TypeScript + Vite
- Added `tsconfig.json` with modern TypeScript configuration
- Added `vite.config.ts` with library build settings
- Updated package.json scripts to use TypeScript and Vite

### 2. Dependencies Updated
- **Removed**: All Babel-related packages, Flow, old webpack dependencies
- **Added**: TypeScript, Vite, Vitest, and necessary type definitions
- **Updated**: Core dependencies to latest compatible versions (axios, redux-saga, etc.)

### 3. TypeScript Conversion
All source files converted from `.js` to `.ts` with proper TypeScript types:

#### Axios Module (`src/axios/`)
- Added interfaces for `ApiRequestParams` and `ApiErrorResponse`
- Proper typing for axios instance and error handling

#### Helpers Module (`src/helpers/`)
- `actionCreator.ts`: Added interfaces for `ReducerOptions`, `ActionOptions`, `ExtendedAction`
- `apiSelector.ts`: Added interfaces for `ApiSelectorOptions`, `ApiState`, `ApiResult`
- `constants.ts`: Added `ActionConstants` interface

#### Modules (`src/modules/`)
- `apiDefaultReducer.ts`: Added interfaces for `ApiStateItem`, `ApiReducerState`, `ApiAction`
- `apiRoutes.ts`: Converted to class-based implementation with proper interfaces
- `apiWatchRequest.ts`: Added comprehensive typing for saga functions and options

### 4. Testing Migration
- **From**: Jest
- **To**: Vitest
- Updated test files to use Vitest imports
- Fixed test cases to work with new TypeScript interfaces
- Added test setup file for Vitest

### 5. Package Configuration
- Added proper module exports in package.json
- Added TypeScript declaration files support
- Updated build outputs for both CommonJS and ESM

## New Scripts

```bash
# Development
npm run type-check    # Check TypeScript types
npm run test          # Run tests with Vitest
npm run test:run      # Run tests once

# Build
npm run build         # Build with TypeScript + Vite
npm run clean         # Clean dist folder
```

## Breaking Changes

### For Library Users
1. **Import paths remain the same** - no changes needed for existing users
2. **Runtime behavior unchanged** - all functionality preserved
3. **New TypeScript support** - full type definitions now available

### For Contributors
1. **All files must be TypeScript** - `.ts` extension required
2. **Type definitions required** - proper interfaces must be defined
3. **Vitest for testing** - use Vitest instead of Jest

## Type Safety Improvements

The migration adds comprehensive type safety:

- **API calls**: Proper typing for request/response structures
- **Redux actions**: Type-safe action creators and reducers
- **Selectors**: Generic selectors with proper return types
- **Sagas**: Full typing for saga effects and generators

## Compatibility

- **Node.js**: Requires Node.js 16+ (for Vite)
- **Browsers**: Modern browsers with ES2020 support
- **React**: Compatible with React 16+ (peer dependency)
- **Redux**: Compatible with Redux 3+ (peer dependency)
- **Redux-Saga**: Compatible with Redux-Saga 1+ (peer dependency)

## Migration Benefits

1. **Type Safety**: Catch errors at compile time
2. **Better IDE Support**: IntelliSense, refactoring, navigation
3. **Modern Build**: Faster builds with Vite
4. **Tree Shaking**: Better bundle optimization
5. **Developer Experience**: Improved debugging and development workflow
