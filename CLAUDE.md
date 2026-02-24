# React Movie Explorer - Project Guidelines

## Project Overview
- **App**: React Movie Explorer - TMDB API integration
- **Tech Stack**: React 19 + TypeScript + Vite + Tailwind CSS 4 + Redux-Saga

---

## Project Structure

```
src/
├── core/                    # App-wide infrastructure
│   ├── api/                 # API client (axios instance, interceptors)
│   ├── config/              # Environment variables, constants
│   └── store/               # Redux store setup, root saga
│
├── modules/                 # Feature modules (self-contained)
│   ├── movies/              # Movie listing, details, pagination
│   ├── search/              # Search with debounce, rate limiting
│   ├── favorites/           # LocalStorage favorites management
│   └── navigation/          # Keyboard navigation system
│
├── shared/                  # Reusable across modules
│   ├── components/          # Generic UI components (ErrorBoundary, Toast, etc.)
│   ├── hooks/               # Generic hooks
│   ├── utils/               # Helper functions
│   ├── types/               # Shared TypeScript types
│   └── styles/              # Global styles
│
└── pages/                   # Route-level components
    └── HomePage/
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `MovieCard.tsx` |
| Hooks | camelCase with "use" prefix | `useKeyboardNav.ts` |
| Utils | camelCase | `formatDate.ts` |
| Types | camelCase with suffix | `movie.types.ts` |
| Stores | camelCase with suffix | `movies.slice.ts`, `movies.saga.ts` |
| Constants | SCREAMING_SNAKE_CASE | `API_BASE_URL` |

---

## File Organization Rules

- **One component per file** (no multiple exports of components)
- **Index files** for clean imports: each folder has `index.ts` re-exporting
- **Co-location**: Keep related files together (component + its styles + its types)

---

## TypeScript Guidelines

- **Strict mode**: No `any` types (use `unknown` if needed)
- **Explicit return types** on functions
- **Interface over Type** for object shapes (extendable)
- **Props naming**: `ComponentNameProps` (e.g., `MovieCardProps`)

---

## Redux-Saga Patterns

- **Slice per feature**: Each module has its own slice
- **Saga per feature**: Each module has its own saga file
- **Action naming**: `domain/actionName` (e.g., `movies/fetchPopular`)
- **Selectors**: Memoized with createSelector, co-located with slice

---

## Performance Rules

- **Memoization**: Use `React.memo` for list items, `useMemo`/`useCallback` where needed
- **Avoid unnecessary renders**: Don't create objects/arrays in render
- **Selector optimization**: Select minimal state needed
- **Lazy loading**: Route-level code splitting with `React.lazy`

---

## API Integration

- **Single axios instance** in `core/api/`
- **Error handling**: Centralized in interceptors
- **Loading states**: Managed in Redux (idle | loading | success | error)
- **Request types**: Define request/response types for each endpoint

---

## Error Handling Strategy

Two-tier approach:

### 1. Error Boundaries (silent fallbacks)
- Image loading failures → placeholder image
- Non-critical component crashes → fallback UI
- Located in `shared/components/ErrorBoundary.tsx`

### 2. Custom Toast Notifications (user feedback)
- Failed user actions (add to favorites, search errors)
- API errors that block functionality
- Located in `shared/components/Toast/`
- Managed via Redux state or Context

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

---

## ESLint Rules (Key Enforcements)

- `no-explicit-any`: error
- `react-hooks/rules-of-hooks`: error
- `react-hooks/exhaustive-deps`: warn
- `@typescript-eslint/explicit-function-return-type`: warn
- `no-console`: warn (except console.error)
- `prefer-const`: error

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
- Don't ignore TypeScript errors
- Don't make API calls directly in components
- Don't use inline styles (use Tailwind classes)
- Don't skip error handling
- Don't leave console.logs in production code

---

## Keyboard Navigation Requirements

- All navigation via Arrow keys, Enter, Escape
- **Tab key DISABLED** (per requirements)
- **Mouse scroll DISABLED** (CSS overflow: hidden)
- Focus management is critical for UX

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
