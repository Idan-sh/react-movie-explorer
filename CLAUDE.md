# React Movie Explorer - Project Guidelines

## Project Overview
- **App**: React Movie Explorer - TMDB API integration
- **Tech Stack**: React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS 4 + Redux Toolkit + Redux-Saga
- **Path alias**: `@/` maps to `src/` (configured in tsconfig + vite)

---

## Project Structure

```
src/
├── main.tsx                 # React entry point (routing + lazy loading + Suspense)
├── index.css                # Global styles + Tailwind @theme tokens + keyframes
│
├── core/                    # App-wide infrastructure
│   ├── api/                 # API client and endpoints
│   │   ├── tmdbClient.ts    # Axios instance with Bearer auth + interceptors (10s timeout)
│   │   └── endpoints.ts     # All API endpoint paths (centralized)
│   ├── config/              # Environment variables only (env.ts)
│   ├── navigation/          # Keyboard navigation system (cross-cutting infrastructure)
│   │   ├── hooks/           # useKeyboardNav, usePageNavigation, useGridColumns
│   │   ├── types/           # navigation.types (NavState, NavZone, NavConfig, etc.)
│   │   ├── utils/           # navigation.utils (pure state transitions), dom.utils (focus/click)
│   │   └── constants.ts     # NAV_KEY, NAV_ZONE, NAV_ID_PREFIX
│   └── store/               # Redux store setup
│       ├── store.ts         # configureStore with saga + listener middleware
│       ├── rootReducer.ts   # combineReducers (all feature slices)
│       ├── rootSaga.ts      # Root saga (fork all feature sagas)
│       ├── listenerMiddleware.ts  # Shared RTK listener middleware instance
│       └── hooks.ts         # Typed hooks: useAppDispatch, useAppSelector
│
├── modules/                 # Feature modules (self-contained)
│   ├── movies/              # Movie listing, details, pagination
│   │   ├── components/
│   │   │   ├── CircularMovieRating/  # SVG ring with IntersectionObserver animation (hook + utils + constants co-located)
│   │   │   ├── MovieCard/       # MovieCard (memo), FavoriteButton, MoviePoster, MovieInfo
│   │   │   ├── MovieGrid/       # MovieGrid, MovieGridLayout, LoadMoreButton, MovieGridEmpty, MovieGridError, MovieGridSkeleton
│   │   │   ├── MovieDetails/    # MovieDetailsPoster, MovieDetailsGenres, MovieDetailsMeta, MovieDetailsOverview, MovieDetailsCast, MovieDetailsBackdrop, MovieDetailsSkeleton, FavoriteToggleButton
│   │   │   ├── MovieTrailer/    # MovieTrailer + useMovieTrailer (self-contained widget)
│   │   │   └── MovieRecommendations/  # MovieRecommendations + useMovieRecommendations (self-contained widget)
│   │   ├── hooks/           # useMoviesInit, useMovieGrid, useMovieCard, useMovieDetailsPage, useHomePage
│   │   ├── store/           # movies.slice/saga/selectors + movieDetails.slice/saga/selectors
│   │   ├── types/           # movie.types, movies.store.types
│   │   ├── utils/           # movieCard.utils, movieDetails.utils, movies.utils, confetti.utils
│   │   └── constants.ts     # MOVIE_LIST, TMDB_IMAGE, RATING, PAGINATION, CAST, MOVIE_DETAILS_APPEND
│   ├── favorites/           # Favorites with localStorage persistence
│   │   ├── components/
│   │   │   └── FavoritesGrid/   # FavoritesGrid, FavoritesEmpty
│   │   ├── hooks/           # useFavoriteToggle
│   │   ├── services/        # favorites.storage (localStorage with validation)
│   │   ├── store/           # favorites.slice, favorites.selectors, favorites.listener
│   │   └── types/           # favorites.types
│   └── search/              # Movie search via TMDB API
│       ├── components/
│       │   └── SearchBar/   # SearchBar (purely presentational — receives all props)
│       ├── hooks/           # useSearch (input control), useSearchGrid (grid state + load more)
│       ├── store/           # search.slice/saga/selectors
│       ├── types/           # search.types
│       └── constants.ts     # SEARCH (MIN_QUERY_LENGTH, DEBOUNCE_MS, rate limit config)
│
├── shared/                  # Reusable across modules
│   ├── components/
│   │   ├── AppLayout/       # AppLayout (route shell, outlet context, scroll ref)
│   │   ├── AppHeader/       # AppHeader, HamburgerButton, MobileMenu, MobileMenuItem
│   │   ├── AppFooter/       # AppFooter
│   │   ├── BackButton/      # BackButton
│   │   ├── CategoryTabs/    # CategoryTabs, CategoryTab
│   │   ├── ErrorBoundary/   # RouteErrorFallback (used as errorElement in router)
│   │   ├── FilmPlaceholder/ # FilmPlaceholder (SVG pattern + icon)
│   │   ├── ImageWithFallback/  # ImageWithFallback + useImageLoad (error-handling img replacement)
│   │   ├── NotFoundView/    # NotFoundView (reusable 404/error layout)
│   │   ├── PageSpinner/     # PageSpinner (delayed-fade loading spinner for Suspense)
│   │   ├── ScrollToTopButton/  # ScrollToTopButton + useScrollToTop
│   │   ├── ScrollRow/       # ScrollRow (horizontal scroll container with fade hint)
│   │   ├── Settings/        # SettingsButton + useSettings + ToggleSwitch + settings.storage
│   │   └── Theme/           # ThemeToggle + useTheme + theme constants/types
│   ├── hooks/               # useCategoryTabs, useDropdown, useHamburgerMenu, useLoadMore, useIsMobile
│   ├── types/               # request.types, views.types (derived from constants)
│   ├── utils/               # rateLimit.utils (sliding-window rate limiter)
│   └── constants/           # Shared constants (organized by responsibility)
│       ├── request.constants.ts    # REQUEST_STATUS (idle, loading, success, error)
│       ├── slices.constants.ts     # SLICE_NAMES (movies, search, favorites)
│       ├── views.constants.ts      # APP_VIEW, APP_VIEW_CONFIG, APP_VIEW_DEFAULT, APP_VIEW_TABS
│       ├── routes.constants.ts     # Route path constants + URL builders
│       ├── storage.constants.ts    # STORAGE_KEY registry (all localStorage keys)
│       ├── layout.constants.ts     # Z_LAYER, VIEW_CROSSFADE
│       └── animation.constants.ts  # Animation timing/easing constants
│
└── pages/                   # Route-level components (thin, no hooks)
    ├── HomePage/            # Composes modules for home view
    ├── MovieDetailsPage/    # Movie details route
    └── NotFoundPage/        # 404 catch-all route
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
- **Co-location**: Self-contained widgets keep their hook/utils/constants in the same folder (e.g., `CircularMovieRating/`, `MovieTrailer/`). Module-level hooks shared across components live in `hooks/`.
- **Constants**: Module-specific in `modules/*/constants.ts`, shared in `shared/constants/`
- **Types derived from constants**: Define in `types/` folder, not in constants file
- **Module public API**: Only export from module `index.ts` what's needed externally
- **Pages are thin**: Route-level components only compose modules, no business logic

---

## Code Separation of Concerns

### Components (Presentational Only)
- **Only render JSX** - no business logic, no handlers, no hooks (except self-contained widget hooks)
- Receive all data AND handlers via props
- No data transformations inside components
- **Mutually exclusive states**: Use early returns for loading/error/empty/data states

### Self-Contained Widget Pattern
Widgets that encapsulate their own behavior co-locate everything in one folder:
```
MovieTrailer/
├── MovieTrailer.tsx          # Component
├── useMovieTrailer.ts        # Widget-specific hook
└── index.ts
```
Used for: `CircularMovieRating`, `MovieTrailer`, `MovieRecommendations`

### Hooks (Business Logic + Handlers)
- State management, side effects, Redux integration
- **Event handlers** (onClick, onKeyDown, etc.)
- Return processed data AND handlers ready for components

### Utils (Pure Functions)
- Data transformations, calculations
- No React dependencies, no DOM access
- DOM-interacting helpers go in separate `dom.utils.ts` files

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
- **Explicit return types** on hooks with complex returns (define named interfaces)
- **Interface over Type** for object shapes (extendable)
- **Props naming**: `ComponentNameProps` (e.g., `MovieCardProps`)
- **Derived types**: Define in `types/` folder, importing constants

---

## Redux Patterns

- **Slice per feature**: Each module has its own slice
- **Saga per feature**: Each module has its own saga file
- **Selectors per feature**: Separate `*.selectors.ts` file, co-located with slice
- **Listener middleware**: Single shared instance in `core/store/listenerMiddleware.ts`. Modules register listeners via side-effect imports (e.g., `favorites.listener.ts`).
- **Reducers are pure**: No side effects — persistence handled by listener middleware
- **Typed hooks**: Use `useAppDispatch` and `useAppSelector` from `core/store/hooks.ts`

### Pre-Built Selectors Pattern
Selectors are built once at module load time (not per render) for stable memoization:
```typescript
const selectorsByList = {
  [MOVIE_LIST.POPULAR]: buildListSelectors(MOVIE_LIST.POPULAR),
  [MOVIE_LIST.NOW_PLAYING]: buildListSelectors(MOVIE_LIST.NOW_PLAYING),
};

export function getListSelectors(list: MovieList) {
  return selectorsByList[list];
}
```

---

## Performance Rules

- **Avoid unnecessary renders**: Don't create objects/arrays in render
- **Selector optimization**: Select minimal state needed
- **Lazy loading**: Route-level code splitting with `React.lazy`
- **React.memo**: Use for list item components (e.g., `MovieCard`)
- **Animation via refs**: `CircularMovieRating` uses direct DOM updates (not setState) during animation to avoid ~50 re-renders per card
- **Stable callbacks**: Extract inline arrows to `useCallback`, use module-level no-ops

---

## API Integration

- **Single axios instance** in `core/api/tmdbClient.ts`
- **Auth**: Bearer token via `Authorization` header (uses `VITE_TMDB_API_READ_ACCESS_TOKEN`)
- **Timeout**: 10 seconds on all requests
- **Request interceptor**: Dev-only request logging
- **Response interceptor**: Translates errors to user-friendly messages (timeout, network, 401, 404, 429, 5xx)
- **Endpoints**: Centralized in `core/api/endpoints.ts`

---

## Error Handling

### Implemented
- **Route Error Boundary**: `RouteErrorFallback` component used as `errorElement` in React Router. Shows warning icon + reload button.
- **404 Page**: `NotFoundPage` catches unmatched routes. `NotFoundView` shared component used by both 404 and movie details error state.
- **API errors**: Caught in sagas, stored in Redux state, rendered by error components
- **Image fallbacks**: `ImageWithFallback` component with built-in error handling via `useImageLoad` hook
- **Rate limit feedback**: Search saga dispatches error action when rate-limited
- **localStorage safety**: All reads/writes wrapped in try/catch. `favorites.storage` validates parsed data with `Array.isArray()`.

### Planned
- Custom toast notifications for user action feedback

---

## HomePage Architecture

### Tabs
Three tabs: **Popular** | **Airing Now** | **My Favorites**
- Defined in `shared/constants/views.constants.ts` as `APP_VIEW_TABS`
- Config (labels + titles) via `APP_VIEW_CONFIG`
- Default view: `Popular`

### Category Tab Behavior (useCategoryTabs hook)
- **Click** → switch view immediately, scroll to top
- **Focus after 2 seconds** → auto-switch (keyboard navigation)
- **Blur** → cancel pending auto-switch timer
- Popular & Airing Now → TMDB API
- My Favorites → localStorage

---

## Keyboard Navigation

- All navigation via Arrow keys, Enter, Escape
- **Tab key DISABLED** (per requirements)
- **Mouse scroll toggleable** — defaults to disabled. User can enable via Settings.
- Navigation module lives in `core/navigation/` (cross-cutting infrastructure)

### Navigation Zones
Two mutually exclusive zones:
- **TABS zone**: Arrow Left/Right to move between tabs, Enter to activate
- **CONTENT zone**: Arrow keys to navigate grid, Enter to activate item
- Arrow Down from tabs → enter content; Escape from content → return to tabs

### Hook Layering
- `useKeyboardNav` — core keyboard logic (global keydown listener, state + DOM sync)
- `usePageNavigation` — generic wrapper that derives sections from item arrays

---

## Search

- Minimum 2 characters to trigger search
- 500ms debounce via `sagaDebounce`
- Rate limit: max 5 requests per 10 seconds (sliding-window). Rate-limited requests show error feedback. Only successful requests count against the limit.
- `useSearch` — returns `{ query, handleInputChange, handleClear }` (called by AppLayout)
- `SearchBar` — purely presentational, receives all props
- `useSearchGrid` — grid state for `MovieGridLayout`

---

## Movie Details Page

The `/movie/:id` page fetches enriched data in a **single API call** using TMDB's `append_to_response`:

```
GET /movie/{id}?append_to_response=credits,videos,recommendations
```

### Sections displayed
- **Backdrop + Poster + Title** — hero area with favorite toggle
- **Meta** — rating (CircularMovieRating, hidden for <10 votes), year, runtime, budget, revenue
- **Genres** — pill badges
- **Overview** — tagline + synopsis
- **Cast** — horizontal `ScrollRow` of top 8 cast members
- **Trailer** — YouTube facade pattern (`MovieTrailer` self-contained widget)
- **Recommendations** — horizontal `ScrollRow` of `MovieCard` components (`MovieRecommendations` self-contained widget)

---

## Settings

- **SettingsButton** — gear icon, dropdown via `useDropdown` (shared generic hook)
- **useSettings** hook — manages settings state persisted in `localStorage`
- Currently supports: **Mouse Scroll** toggle
- Animation constants in `settingsDropdown.constants.ts`

---

## localStorage Key Registry

All keys in `shared/constants/storage.constants.ts` — single source of truth:
```typescript
STORAGE_KEY = {
  THEME: "theme",
  MOVIES: { FAVORITES: "movies:favorites" },
  SETTINGS: { SCROLL_ENABLED: "settings:scroll-enabled" },
}
```

---

## Design System

### Theme System
- `ThemeToggle` + `useTheme` in `shared/components/Theme/`
- Dark class on `<html>` element + blocking script in `index.html` prevents FOUC
- `@custom-variant dark (&:where(.dark, .dark *))` in `index.css`
- localStorage access wrapped in try/catch

### Color Palette (Tailwind 4 @theme)
```css
@theme {
  --color-primary: #8b5cf6;
  --color-primary-hover: #7c3aed;
  --color-primary-light: #a78bfa;
  --color-error: #ef4444;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
}
```

### Focus States (Critical for keyboard nav)
- Visible focus ring on all interactive elements
- Use `focus-visible:ring-2 focus-visible:ring-primary`
- Never remove focus outlines

---

## DO's

- Keep components small and focused (single responsibility)
- Use TypeScript's type system to catch errors early
- Handle loading, error, and empty states
- Use semantic HTML elements
- Keep sagas focused (one saga = one flow)
- Use meaningful variable names

---

## DON'Ts

- Don't use `any` type
- Don't mutate state directly
- Don't put business logic in components (use hooks/sagas)
- Don't put utility functions in hooks (use utils/)
- Don't put side effects in reducers (use listener middleware)
- Don't make API calls directly in components
- Don't hardcode strings/numbers - use constants
- Don't use inline styles (use Tailwind classes)
- Don't pass inline arrow functions as JSX props
- Don't skip error handling
- Don't leave console.logs in production code
