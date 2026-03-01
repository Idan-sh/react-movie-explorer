# Movie Explorer

A modern movie discovery app built with React 19, powered by the TMDB API. Browse popular and now-playing movies, search with real-time results, manage favorites, and explore detailed movie pages — all with full keyboard navigation support.

**Live Demo:** [movie-explorer.idansh.dev](https://movie-explorer.idansh.dev/)  
Deployed on Vercel as a static Vite SPA.   

<img width="1300" height="940" alt="Screenshot" src="https://github.com/user-attachments/assets/61514b4b-c4d7-4d70-ac19-a41334597b80" />

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **UI** | React 19 + TypeScript 5.9 |
| **Build** | Vite 7 |
| **Styling** | Tailwind CSS 4 |
| **State** | Redux Toolkit + Redux-Saga |
| **HTTP** | Axios (Bearer token auth) |
| **Animations** | Framer Motion + View Transitions API |
| **Icons** | Heroicons |

---

## Features

### Core
- **Movie browsing** — Popular and Now Playing lists with infinite "Load More" pagination and prefetching
- **Movie details** — Single API call fetches credits, videos, and recommendations via TMDB's `append_to_response`
- **Search** — Debounced (500ms), rate-limited (5 req/10s), minimum 2 characters
- **Favorites** — Add/remove movies with localStorage persistence and confetti burst animation
- **Dark / Light mode** — Toggleable with flash-of-unstyled-content prevention via blocking script

### Keyboard Navigation
Full keyboard-driven navigation system (arrow keys, Enter, Escape) with two focus zones:
- **Tabs zone** — Left/Right arrows to switch between category tabs. Click switches immediately; keyboard focus auto-switches after 2 seconds.
- **Content zone** — Arrow keys to navigate the 4-column movie grid, Enter to select
- Mouse scroll disabled by default (per requirements); toggleable via the Settings gear icon
- Tab key is fully disabled — all navigation is arrow-key based

### UI Polish
- **Animated rating rings** — SVG circular progress with IntersectionObserver-triggered count-up animation (zero React re-renders during animation)
- **View transitions** — Smooth crossfade between routes using the View Transitions API
- **YouTube trailer facade** — Thumbnail + play button that swaps to an iframe on click (avoids loading YouTube JS until needed)
- **Framer Motion** — Tab indicator slide, mobile menu slide, settings dropdown scale, favorites list layout animation, scroll-to-top button
- **Confetti** — Burst effect on favorite toggle using canvas-confetti
- **Responsive** — Desktop grid + mobile hamburger menu with animated dropdown

### Error Handling
- Route-level error boundary with styled fallback
- 404 page for unknown routes + "Movie not found" for invalid IDs
- API error messages (timeout, network, rate limit, server errors)
- Image error fallback via `ImageWithFallback` component
- localStorage access wrapped in try/catch with data validation

---

## Architecture

```
src/
├── core/           # Infrastructure (API, store, config, navigation)
├── modules/        # Feature modules (movies, favorites, search)
├── shared/         # Reusable components, hooks, utils, constants
└── pages/          # Thin route shells (HomePage, MovieDetailsPage, NotFoundPage)
```

**Key design decisions:**
- **Components are presentational** — receive all data and handlers via props
- **Hooks contain business logic** — state, side effects, event handlers
- **Utils are pure functions** — data transformations, no React/DOM dependencies
- **Navigation is in core/** — cross-cutting infrastructure, not a feature module
- **Redux reducers are pure** — persistence handled by listener middleware, not in reducers
- **Self-contained widgets** — components like `MovieTrailer` and `CircularMovieRating` co-locate their hook/utils/constants

See [CLAUDE.md](./CLAUDE.md) for detailed conventions and patterns.

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [TMDB account](https://www.themoviedb.org/settings/api) with an API key

### Setup

```bash
git clone https://github.com/idansh/react-movie-explorer.git
cd react-movie-explorer
npm install
```

Create a `.env` file in the project root:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_API_READ_ACCESS_TOKEN=your_tmdb_read_access_token
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
```

> The **API Read Access Token** (starts with `eyJ...`) is found in your TMDB account under Settings → API.

### Run

```bash
npm run dev        # Dev server at localhost:5173
npm run build      # Type-check + production build
npm run preview    # Preview production build
npm run lint       # ESLint
```

---

## Project Highlights

| Area | Details |
|------|---------|
| **Performance** | Lazy-loaded routes, prefetched pagination, memoized components, RAF-based animations with zero re-renders |
| **Accessibility** | Semantic HTML, ARIA labels/roles, visible focus rings, full keyboard navigation, screen reader support |
| **Error resilience** | Error boundary, 404 handling, rate limit feedback, localStorage validation, image fallbacks |
| **Code quality** | Strict TypeScript, ESLint, clear separation of concerns, no `any` types, explicit return types on hooks |
| **Developer experience** | Path aliases, barrel exports, co-located files, CLAUDE.md conventions doc |

---

## Demo

### Keyboard Navigation
Arrow-key navigation through the movie grid, tab switching with auto-focus, and zone transitions.

https://github.com/user-attachments/assets/474802d5-a522-42c7-91ab-3173b6f52776


### Movie Grid
Browse movies with Load More pagination and scroll-to-top.

https://github.com/user-attachments/assets/d8c8c808-85ea-4bd5-abf4-9671ecc2f0cd


### Search & Movie Details
Real-time debounced search with full movie details page — backdrop, cast, trailer, and recommendations.

https://github.com/user-attachments/assets/795fb27e-ad55-42d2-bed8-c74aed2f5909


### Favorite a Movie
Add a movie to favorites with a confetti burst.

https://github.com/user-attachments/assets/c31e9c77-6a55-4322-8d30-6a9740c2440e


### Unfavorite a Movie
Remove a movie from favorites.

https://github.com/user-attachments/assets/5fc653d9-6575-4fa7-9b7c-d3a69ce9f993


### Theme Toggle
Switch between dark and light mode.

https://github.com/user-attachments/assets/d9092b4e-625e-4f05-956c-2e0ee830d130
