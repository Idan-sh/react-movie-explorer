# React Movie Explorer - Project Guidelines

## Project Overview
- **App**: React Movie Explorer - TMDB API integration
- **Tech Stack**: React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS 4 + Redux Toolkit + Redux-Saga
- **Path alias**: `@/` maps to `src/` (configured in tsconfig + vite)

---

## Project Structure

```
src/
├── main.tsx                 # React entry point (routing + lazy loading)
├── index.css                # Global styles + Tailwind @theme tokens
│
├── core/                    # App-wide infrastructure
│   ├── api/                 # API client and endpoints
│   │   ├── tmdbClient.ts    # Axios instance with interceptors (10s timeout)
│   │   └── endpoints.ts     # All API endpoint paths (centralized)
│   ├── config/              # Environment variables only (env.ts)
│   └── store/               # Redux store setup
│       ├── store.ts         # configureStore with saga middleware
│       ├── rootReducer.ts   # combineReducers (all feature slices)
│       ├── rootSaga.ts      # Root saga (fork all feature sagas)
│       └── hooks.ts         # Typed hooks: useAppDispatch, useAppSelector
│
├── modules/                 # Feature modules (self-contained)
│   ├── movies/              # Movie listing, details, pagination
│   │   ├── components/
│   │   │   ├── MovieCard/       # MovieCard, FavoriteButton, MoviePoster, MovieRating, MovieInfo
│   │   │   ├── MovieGrid/       # MovieGrid, LoadMoreButton, MovieGridEmpty, MovieGridError, MovieGridSkeleton
│   │   │   └── MovieDetails/    # MovieDetails, MovieDetailsPoster, MovieDetailsGenres, MovieDetailsMeta, MovieDetailsOverview
│   │   ├── hooks/           # useMoviesInit, useMovieGrid, useMovieCard, useLoadMore, useMovieDetails
│   │   ├── store/           # movies.slice/saga/selectors + movieDetails.slice/saga/selectors
│   │   ├── types/           # movie.types, movies.store.types
│   │   ├── utils/           # movieCard.utils, movies.utils
│   │   └── constants.ts     # MOVIE_LIST, TMDB_IMAGE, PAGINATION
│   ├── navigation/          # Keyboard navigation system
│   │   ├── hooks/           # useKeyboardNav, usePageNavigation, useGridColumns
│   │   ├── types/           # navigation.types (NavState, NavZone, etc.)
│   │   ├── utils/           # navigation.utils (resolveNavigation, grid math)
│   │   └── constants.ts     # NAV_KEY, NAV_ZONE, NAV_ID_PREFIX
│   ├── favorites/           # Favorites with localStorage persistence
│   │   ├── components/
│   │   │   └── FavoritesGrid/   # FavoritesGrid, FavoritesEmpty
│   │   ├── hooks/           # useFavoriteToggle
│   │   ├── services/        # favorites.storage (localStorage)
│   │   ├── store/           # favorites.slice, favorites.selectors
│   │   └── types/           # favorites.types
│   └── search/              # (SCAFFOLDED - not yet implemented)
│
├── shared/                  # Reusable across modules
│   ├── components/
│   │   ├── AppHeader/       # AppHeader, HamburgerButton, MobileMenu
│   │   └── CategoryTabs/    # CategoryTabs, CategoryTab
│   ├── hooks/               # useCategoryTabs, useHamburgerMenu
│   ├── types/               # request.types, views.types (derived from constants)
│   └── constants/           # Shared constants (organized by responsibility)
│       ├── request.constants.ts    # REQUEST_STATUS (idle, loading, success, error)
│       ├── slices.constants.ts     # SLICE_NAMES (movies, search, favorites)
│       ├── views.constants.ts      # APP_VIEW, APP_VIEW_LABELS, APP_VIEW_TABS
│       ├── routes.constants.ts     # Route path constants
│       └── animation.constants.ts  # Animation timing/easing constants
│
└── pages/                   # Route-level components (thin, no hooks)
    ├── HomePage/            # Composes modules for home view
    └── MovieDetailsPage/    # Movie details route
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `MovieCard.tsx` |
| Hooks | camelCase with "use" prefix | `useKeyboardNav.ts` |
| Utils | camelCase with suffix | `movieCard.utils.ts`, `navigation.utils.ts` |
| Types | camelCase with suffix | `movie.types.ts`, `navigation.types.ts` |
| Stores | camelCase with suffix | `movies.slice.ts`, `movies.saga.ts`, `movies.selectors.ts` |
| Constants | SCREAMING_SNAKE_CASE | `API_BASE_URL` |

---

## File Organization Rules

- **One component per file** (no multiple exports of components)
- **Index files** for clean imports: each folder has `index.ts` re-exporting
- **Co-location**: Keep related files together (component + its styles + its types)
- **Constants**: Module-specific in `modules/*/constants.ts`, shared in `shared/constants/`
- **Types derived from constants**: Define in `types/` folder, not in constants file
  - Constants only export runtime values
  - Types folder imports constants and exports derived types
- **Module public API**: Only export from module `index.ts` what's needed externally
  - Internal utils, saga helpers, internal actions → NOT exported
  - Public actions, selectors, types, components → exported
- **Pages are thin**: Route-level components only compose modules, no business logic
  - No hooks in pages folder - hooks belong in modules
  - Pages import and use module hooks (e.g., `useMoviesInit` from movies module)

---

## Code Separation of Concerns

Clear separation between components, hooks, and utils:

### Components (Presentational Only)
- **Only render JSX** - no business logic, no handlers
- Receive all data AND handlers via props
- No data transformations inside components
- Break down into small, focused sub-components (single responsibility)
- **Mutually exclusive states**: Use early returns for loading/error/empty/data states - never render multiple states simultaneously

```typescript
// ✅ GOOD - Early returns, one state at a time
const renderContent = (): React.JSX.Element => {
  if (isLoading) return <Skeleton />;
  if (hasError) return <Error />;
  if (isEmpty) return <Empty />;
  return <>{items.map(...)}</>;
};

// ❌ BAD - Multiple states could render
{isLoading && <Skeleton />}
{hasError && <Error />}
{isEmpty && <Empty />}
{items.map(...)}
```

### Component Composition
- **Avoid heavy single components** - split into sub-components
- Each sub-component handles ONE visual responsibility
- Parent component composes children
- Sub-components are co-located in the same folder

Example structure:
```
MovieCard/
├── MovieCard.tsx        # Main component (composition)
├── MoviePoster.tsx      # Sub-component (poster image + placeholder)
├── MovieRating.tsx      # Sub-component (rating badge)
├── MovieInfo.tsx        # Sub-component (title + year)
└── index.ts
```

### Hooks (Business Logic + Handlers)
- State management (useState, useReducer)
- Side effects (useEffect)
- Redux integration (useSelector, useDispatch)
- **Event handlers** (onClick, onKeyDown, etc.)
- Orchestrating utils and combining data
- Return processed data AND handlers ready for components

### Utils (Pure Functions)
- Data transformations (formatting, parsing)
- Calculations and computations
- No React dependencies (no hooks inside)
- Easily testable in isolation
- Reusable across hooks and other utils

### Example Structure
```typescript
// utils/movieCard.utils.ts - Pure functions
export function formatRating(vote: number): string { ... }
export function getPosterUrl(path: string | null): string | null { ... }

// hooks/useMovieCard.ts - Business logic + handlers
export function useMovieCard(movie: TmdbMovie, onSelect?: (movie: TmdbMovie) => void) {
  const rating = formatRating(movie.vote_average);
  const posterUrl = getPosterUrl(movie.poster_path);

  const handleClick = (): void => { onSelect?.(movie); };
  const handleKeyDown = (e: React.KeyboardEvent): void => { ... };

  return { rating, posterUrl, handleClick, handleKeyDown };
}

// components/MovieCard.tsx - Pure rendering (composition)
export function MovieCard({ movie, onSelect }: MovieCardProps) {
  const { posterUrl, rating, handleClick, handleKeyDown } = useMovieCard(movie, onSelect);
  return (
    <article onClick={handleClick} onKeyDown={handleKeyDown}>
      <MoviePoster url={posterUrl} title={movie.title} />
      <MovieRating rating={rating} />
      <MovieInfo title={movie.title} year={releaseYear} />
    </article>
  );
}
```

---

## Maintaining This Document

**Keep CLAUDE.md up to date:**
- Update when making design decisions (patterns, conventions, approaches)
- Update project structure when adding new folders or main files
- Document new patterns with examples when introducing them

This file is the source of truth for project conventions.

---

## TypeScript Guidelines

- **Strict mode**: No `any` types (use `unknown` if needed)
- **Explicit return types** on functions
- **Interface over Type** for object shapes (extendable)
- **Props naming**: `ComponentNameProps` (e.g., `MovieCardProps`)
- **Derived types**: Define in `types/` folder, importing constants

Example of separating constants and types:
```typescript
// constants/request.constants.ts
export const REQUEST_STATUS = { IDLE: 'idle', LOADING: 'loading' } as const;

// types/request.types.ts
import { REQUEST_STATUS } from '../constants';
export type RequestStatus = (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];
```

---

## Redux-Saga Patterns

- **Slice per feature**: Each module has its own slice
- **Saga per feature**: Each module has its own saga file
- **Selectors per feature**: Separate `*.selectors.ts` file, co-located with slice
- **Action naming**: `domain/actionName` (e.g., `movies/fetchMovies`)
- **Sagas only contain saga logic**: No constants, types, or helpers defined in saga files
- **Typed hooks**: Use `useAppDispatch` and `useAppSelector` from `core/store/hooks.ts` (pre-typed with `RootState`/`AppDispatch`)

### List-Keyed State Pattern
State is keyed by list type (e.g., `popular`, `nowPlaying`) to support multiple data sets simultaneously:
```typescript
// Each list has independent state: movies[], page, totalPages, status, error
interface MoviesState {
  popular: MovieListState;
  nowPlaying: MovieListState;
}
```

### Pre-Built Selectors Pattern
Selectors are built once at module load time (not per render) for stable memoization:
```typescript
// Build at module load, not in component render
const selectorsByList = {
  [MOVIE_LIST.POPULAR]: buildListSelectors(MOVIE_LIST.POPULAR),
  [MOVIE_LIST.NOW_PLAYING]: buildListSelectors(MOVIE_LIST.NOW_PLAYING),
};

// Export lookup function for stable references
export function getListSelectors(list: MovieList) {
  return selectorsByList[list];
}

// Usage in hooks - always gets same selector reference
const selectors = getListSelectors(list);
const movies = useAppSelector(selectors.selectMovies);
```

---

## Performance Rules

- **Avoid unnecessary renders**: Don't create objects/arrays in render
- **Selector optimization**: Select minimal state needed
- **Lazy loading**: Route-level code splitting with `React.lazy`

### Memoization Guidelines
- **React.memo**: Use for list item components to prevent re-renders when props unchanged
- **useMemo**: Only for expensive calculations (filtering large arrays, complex transformations)
- **useCallback**: Only when passing callbacks to memoized children that depend on them
- **Don't over-memoize**: Trivial calculations (string ops, simple math) don't need useMemo - the overhead isn't worth it

---

## API Integration

- **Single axios instance** in `core/api/tmdbClient.ts`
- **Timeout**: 10 seconds on all requests
- **Request interceptor**: Auto-appends API key to all requests, dev-only logging
- **Response interceptor**: Translates errors to user-friendly messages (timeout, network, 401, 404, 429, 5xx)
- **Loading states**: Managed in Redux (idle | loading | success | error)
- **Request types**: Define request/response types for each endpoint
- **Endpoints**: Centralized in `core/api/endpoints.ts` — `TMDB_ENDPOINTS.MOVIES.POPULAR`, etc.

---

## Error Handling Strategy

Two-tier approach (planned, partially implemented):

### 1. Error Boundaries (silent fallbacks) — PLANNED
- Image loading failures → placeholder image (implemented in MoviePoster)
- Non-critical component crashes → fallback UI
- `shared/components/ErrorBoundary.tsx` — not yet created

### 2. Custom Toast Notifications (user feedback) — PLANNED
- Failed user actions (add to favorites, search errors)
- API errors that block functionality
- `shared/components/Toast/` — not yet created

### Currently Implemented
- **API errors**: Caught in sagas, stored in Redux state, rendered by MovieGridError
- **Image fallbacks**: MoviePoster handles broken images with placeholder

---

## Testing Guidelines (Jest + React Testing Library)

- **File naming**: `ComponentName.test.tsx`
- **Co-location**: Tests next to the file they test
- **Coverage targets**: Components, hooks, utils, sagas
- **Testing priorities**:
  1. User interactions (click, keyboard)
  2. Redux state changes
  3. API call handling
  4. Edge cases (empty states, errors)
- **Mocking**: Mock API calls, never test implementation details

---

## Accessibility (a11y)

- **Semantic HTML**: Use proper elements (`button`, `nav`, `main`, etc.)
- **ARIA labels**: Add aria-label for icon-only buttons
- **Focus management**: Visible focus indicators (critical for keyboard nav)
- **Color contrast**: Meet WCAG AA standards
- **Screen reader**: Test with VoiceOver/NVDA
- **Keyboard navigation**: All interactive elements reachable

---

## Git Conventions

### Branch naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring

### Commit messages
- Format: `type: description`
- Types: `feat`, `fix`, `refactor`, `style`, `test`, `docs`, `chore`
- Example: `feat: add movie search with debounce`
- Keep messages concise and descriptive
- **No co-authored-by signatures** - keep commits clean

---

## ESLint Rules (Key Enforcements)

Uses ESLint 9 flat config format (`eslint.config.js`):
- Extends: `js.configs.recommended`, `tseslint.configs.recommended`, `reactHooks.configs.flat.recommended`
- `react-hooks/rules-of-hooks`: error
- `react-hooks/exhaustive-deps`: warn
- TypeScript recommended rules (includes no-explicit-any)
- React Refresh rules for Vite HMR

---

## DO's

- Keep components small and focused (single responsibility)
- Use TypeScript's type system to catch errors early
- Handle loading, error, and empty states
- Use semantic HTML elements
- Keep sagas focused (one saga = one flow)
- Write tests for critical paths
- Use meaningful variable names

---

## DON'Ts

- Don't use `any` type
- Don't mutate state directly
- Don't put business logic in components (use hooks/sagas)
- Don't put utility functions in hooks (use utils/)
- Don't ignore TypeScript errors
- Don't make API calls directly in components
- Don't hardcode strings/numbers - use constants (unless it defeats the purpose)
- Don't use inline styles (use Tailwind classes)
- Don't skip error handling
- Don't leave console.logs in production code

---

## HomePage Architecture

### Tabs
Four tabs: **Home** | **Popular** | **Airing Now** | **My Favorites**
- Defined in `shared/constants/views.constants.ts` as `APP_VIEW_TABS`
- Labels mapped via `APP_VIEW_LABELS`

### Default View (Home tab active)
- Shows **preview rows** for each section: Popular, Airing Now, My Favorites
- Each preview shows one row of movies (4 cards)
- Gives users an overview of all content

### Full View (category tab active)
- Clicking a tab switches to **full grid** of that category
- Full pagination support

### Category Tab Behavior (useCategoryTabs hook)
- **Click** → switch view immediately, scroll to top
- **Focus after 2 seconds** → auto-switch (keyboard navigation, non-Home tabs only)
- **Blur** → cancel pending auto-switch timer
- Popular & Airing Now → TMDB API
- My Favorites → localStorage (separate data source, not yet implemented)

---

## Keyboard Navigation Requirements

- All navigation via Arrow keys, Enter, Escape
- **Tab key DISABLED** (per requirements - always prevented)
- **Mouse scroll DISABLED** (CSS overflow: hidden on html/body)
- Focus management is critical for UX

### Navigation Zones (implemented)
Two mutually exclusive zones — only one has focus at a time:
- **TABS zone**: Arrow Left/Right to move between tabs, Enter to activate
- **CONTENT zone**: Arrow keys to navigate grid (4 columns), Enter to activate item
- Arrow Down from tabs → enter content; Escape from content → return to tabs

### Focus Management via `data-nav-id`
- DOM elements tagged with `data-nav-id` attribute for programmatic focus
- Tabs: `nav-tab-{index}` (e.g., `nav-tab-0`)
- Grid items: `nav-item-{sectionIndex}-{itemIndex}` (e.g., `nav-item-0-3`)
- Pure `resolveNavigation()` util handles all state transitions (testable, no side effects)
- DOM focus synced via useEffect after state changes

### Hook Layering
- `useKeyboardNav` — core keyboard logic (global keydown listener, state + DOM sync)
- `usePageNavigation` — generic wrapper that derives sections from item arrays
- Refs used to keep event listener stable (registered once, reads latest state via refs)

---

## Search Requirements

- Minimum 2 characters to trigger search
- 500ms debounce before request
- Rate limit: max 5 requests per 10 seconds
- Implement in saga with proper cancellation

---

## Design System

### Color Mode
- **System preference**: Follows user's OS dark/light setting
- Tailwind 4: Automatic via `prefers-color-scheme` media query
- Use `dark:` variant for dark mode styles

### Color Palette (Tailwind 4 @theme)
Define custom colors in `src/index.css` using Tailwind 4's `@theme`:

```css
@import "tailwindcss";

@theme {
  /* Primary - Purple */
  --color-primary: #8b5cf6;
  --color-primary-hover: #7c3aed;
  --color-primary-light: #a78bfa;

  /* Semantic colors */
  --color-error: #ef4444;
  --color-success: #22c55e;
  --color-warning: #f59e0b;

  /* Border radius - Sharp, easily swappable */
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 6px;
  --radius-full: 9999px;
}
```

Usage in components:
- `bg-primary` → uses `--color-primary`
- `rounded-md` → uses `--radius-md`
- Change values in one place, applies everywhere

### Dark Mode Colors
Use Tailwind's built-in dark mode with semantic classes:
```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

### Typography Scale
| Name | Size | Use Case |
|------|------|----------|
| `text-xs` | 12px | Captions, labels |
| `text-sm` | 14px | Secondary text |
| `text-base` | 16px | Body text |
| `text-lg` | 18px | Emphasized text |
| `text-xl` | 20px | Card titles |
| `text-2xl` | 24px | Section headings |
| `text-3xl` | 30px | Page titles |

### Spacing Scale (Tailwind defaults)
- Use Tailwind's spacing: `p-1` (4px), `p-2` (8px), `p-4` (16px), `p-6` (24px), `p-8` (32px)
- Maintain consistent spacing: prefer `4`, `8`, `16`, `24`, `32` multiples

### Breakpoints (Fixed, Tailwind defaults)
| Breakpoint | Min Width | Use Case |
|------------|-----------|----------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small desktop |
| `xl` | 1280px | Standard desktop |
| `2xl` | 1536px | Large screens |

### Component Sizing Guidelines
- **Movie cards**: Fixed 4 per row on desktop, responsive on mobile
- **Buttons**: min-height 40px for touch targets
- **Inputs**: height 40px, consistent padding
- **Icons**: 20px default, 24px for prominent actions

### Shadows
Use Tailwind's built-in: `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`

### Focus States (Critical for keyboard nav)
- Visible focus ring on all interactive elements
- Use `focus-visible:ring-2 focus-visible:ring-primary`
- Never remove focus outlines

### Animation/Transitions
- Default duration: 150ms
- Easing: `ease-in-out`
- Use for: hover states, focus states, modals
- Avoid: excessive animations (performance + accessibility)
