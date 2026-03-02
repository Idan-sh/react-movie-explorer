# Keyboard Navigation System

> **Location**: `src/core/navigation/`
> **Purpose**: Replace the browser's native Tab-based focus model with a custom arrow-key model that controls the entire app.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture Layers](#2-architecture-layers)
3. [The State Model](#3-the-state-model)
4. [The DOM Contract: `data-nav-id`](#4-the-dom-contract-data-nav-id)
5. [Layer 1: Pure State Transitions](#5-layer-1-pure-state-transitions)
6. [Layer 2: DOM Operations](#6-layer-2-dom-operations)
7. [Layer 3: The React Hook](#7-layer-3-the-react-hook)
8. [Layer 4: Page-Level Wrapper](#8-layer-4-page-level-wrapper)
9. [Integration: AppLayout ↔ Pages](#9-integration-applayout--pages)
10. [Consumer: Home Page](#10-consumer-home-page)
11. [Consumer: Movie Details Page](#11-consumer-movie-details-page)
12. [Search Input Integration](#12-search-input-integration)
13. [Responsive: Mobile vs Desktop](#13-responsive-mobile-vs-desktop)
14. [Edge Cases & Guards](#14-edge-cases--guards)
15. [File Reference](#15-file-reference)

---

## 1. Overview

The app requires all navigation to happen via **Arrow keys**, **Enter**, and **Escape**. The browser's **Tab key is disabled entirely**. Mouse scrolling is also disabled by default (users can toggle it on via Settings).

The navigation system models the UI as two zones:

```
┌────────────────────────────────────────────────────────┐
│  TABS ZONE (header)                                    │
│  [Popular] [Airing Now] [Favorites] [🔍] [🌙] [⚙] [☰] │
├────────────────────────────────────────────────────────┤
│  CONTENT ZONE (page body)                              │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                           │
│  │ 0  │ │ 1  │ │ 2  │ │ 3  │  ← section 0, row 0       │
│  └────┘ └────┘ └────┘ └────┘                           │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                           │
│  │ 4  │ │ 5  │ │ 6  │ │ 7  │  ← section 0, row 1       │
│  └────┘ └────┘ └────┘ └────┘                           │
│          [ Load More ]          ← section 0 footer     │
└────────────────────────────────────────────────────────┘
```

**Zone transitions:**
- Arrow Down from tabs → enter content (first item)
- Arrow Up from content row 0 → return to tabs
- Escape from anywhere → return to tabs (at the currently active tab)
- Enter on a category tab → activate that category AND enter content

---

## 2. Architecture Layers

The system is split into four layers, each with a single responsibility:

```
┌──────────────────────────────────────────────────────────────┐
│  Page hooks (useHomePage / useMovieDetailsPage)              │
│  Build section data, provide callbacks, consume focus state  │
├──────────────────────────────────────────────────────────────┤
│  usePageNavigation  (convenience wrapper)                    │
│  Derives ContentSection[] from T[][], maps item activation   │
├──────────────────────────────────────────────────────────────┤
│  useKeyboardNav  (core hook)                                 │
│  Event listener + useState + DOM focus sync effect           │
├──────────────────────────┬───────────────────────────────────┤
│  navigation.utils.ts     │  dom.utils.ts                     │
│  Pure state transitions  │  Focus, visibility, click resolve │
│  (no DOM, no React)      │  (DOM queries, focus calls)       │
└──────────────────────────┴───────────────────────────────────┘
```

**Why this separation matters:**
- `navigation.utils.ts` is a pure function — given state + key + config, it returns new state. This is **testable without a DOM** and contains all the navigation logic.
- `dom.utils.ts` handles everything that touches the DOM — focusing elements, checking visibility, resolving click targets.
- `useKeyboardNav` is thin glue — it only manages the event listener, React state, and a sync effect.
- `usePageNavigation` is a convenience layer so pages don't have to manually build `ContentSection[]` or map `(sectionIdx, itemIdx)` back to actual items.

---

## 3. The State Model

All navigation state lives in a single object:

```typescript
// src/core/navigation/types/navigation.types.ts

interface NavState {
  activeZone: 'tabs' | 'content';
  tabIndex: number;       // which header element is focused (0–6)
  sectionIndex: number;   // which content section (e.g., movie grid)
  itemIndex: number;      // which item within that section
}
```

The hook returns derived focus indices, with `-1` meaning "not in this zone":

```typescript
interface UseKeyboardNavReturn {
  focusedTabIndex: number;      // -1 when in content zone
  focusedSectionIndex: number;  // -1 when in tabs zone
  focusedItemIndex: number;     // -1 when in tabs zone
  enterContent: () => void;     // programmatic zone switch (used by search submit)
}
```

### Header tab indices

All header elements share a flat index space:

| Index | Element | Visible on Desktop | Visible on Mobile |
|---|---|---|---|
| 0 | Popular tab | Yes | No (`display:none`) |
| 1 | Airing Now tab | Yes | No (`display:none`) |
| 2 | Favorites tab | Yes | No (`display:none`) |
| 3 | Search bar | Yes | Yes |
| 4 | Theme toggle | Yes | Yes |
| 5 | Settings button | Yes | Yes |
| 6 | Hamburger button | No (`lg:hidden`) | Yes |

Total: `HEADER_NAV_COUNT = 7`

Hidden elements are automatically skipped during navigation (see [Layer 2](#6-layer-2-dom-operations)).

### Layout configuration

The navigation engine receives a `NavConfig` that describes the current layout:

```typescript
interface NavConfig {
  tabCount: number;            // 7 (all header slots)
  sections: ContentSection[];  // grid definitions
  activeTabIndex?: number;     // Escape returns here
  enterContentTabCount?: number; // tabs 0-2 also enter content on Enter
  tabRows?: number[][];        // 2D mobile layout (undefined on desktop)
}

interface ContentSection {
  itemCount: number;   // how many items in this section
  columns: number;     // grid columns (for up/down movement)
  hasFooter?: boolean; // "Load More" button below the grid
}
```

---

## 4. The DOM Contract: `data-nav-id`

Every navigable element in the DOM receives a `data-nav-id` attribute. This is the **only connection** between the navigation state and the DOM — the nav system doesn't know about component types, only IDs.

### ID format

```
Tabs:    nav-tab-{tabIndex}              → "nav-tab-0", "nav-tab-3"
Content: nav-item-{sectionIndex}-{itemIndex} → "nav-item-0-7", "nav-item-1-3"
```

Built by:

```typescript
// src/core/navigation/utils/navigation.utils.ts
function buildNavId(prefix: string, ...indices: number[]): string {
  return `${prefix}-${indices.join('-')}`;
}
```

### How components participate

Components receive `navId` as a prop and place it on their root element with `tabIndex={-1}`:

```tsx
<article tabIndex={-1} data-nav-id={navId} ... >
```

- `tabIndex={-1}` makes the element focusable via `.focus()` but **unreachable via browser Tab**.
- The component doesn't need to know about the navigation system — it just sets the attribute and receives an `isFocused` boolean for visual styling.

### Why `data-nav-id` instead of refs?

Using a data attribute + `querySelectorAll` allows:
- **Multiple elements with the same ID** — the search bar renders twice (desktop + mobile), but only the visible one gets focused.
- **No ref threading** — components don't need to forward refs through multiple layers.
- **Decoupling** — the navigation system works with any element that has the attribute.

---

## 5. Layer 1: Pure State Transitions

> **File**: `src/core/navigation/utils/navigation.utils.ts`
>
> Pure functions only — no DOM access, no React. Given `(state, key, config)`, returns new `NavState`.

### 5.1 Top-level dispatcher: `resolveNavigation`

```typescript
function resolveNavigation(state: NavState, key: string, config: NavConfig): NavState
```

- **Escape** → always returns to TABS zone at the `activeTabIndex` (the currently displayed category).
- **Tabs zone** → delegates to `resolveTabsNavigation`.
- **Content zone** → delegates to `resolveContentNavigation`.

### 5.2 Tabs navigation (desktop — flat)

Arrow Left/Right cycles through all tab indices with wrapping:

```typescript
function getNextTabIndex(current: number, key: string, total: number): number {
  if (key === ARROW_RIGHT) return (current + 1) % total;
  if (key === ARROW_LEFT)  return (current - 1 + total) % total;
  return current;
}
```

Arrow Down → enter content zone (first section, first item).
Arrow Up → no-op (nothing above the tabs).

After computing the new index, `skipToFocusableTab` (in `dom.utils.ts`) advances past hidden elements — this is the one place where tab navigation touches the DOM, and it happens in the hook after the pure calculation.

### 5.3 Tabs navigation (mobile — 2D rows)

When `tabRows` is provided (e.g., `[[4, 5, 6], [3]]`), the system switches to row-based navigation:

```
Row 0: [Theme(4)] [Settings(5)] [Hamburger(6)]
Row 1: [Search(3)]
```

- Left/Right wraps within the current row.
- Down moves to the next row; Down from the last row enters content.
- Up moves to the previous row; Up from row 0 is a no-op.

Column position is preserved when moving between rows of different lengths (clamped to the shorter row's length).

### 5.4 Grid navigation: `getNextGridIndex`

Computes movement within a 2D grid defined by `itemCount` and `columns`:

```typescript
function getNextGridIndex(current: number, key: string, section: ContentSection): number
```

The function treats the flat `itemIndex` as a 2D position: `row = floor(index / columns)`, `col = index % columns`.

| Key | Behavior |
|---|---|
| Arrow Right | Move right. Stop at last column (no wrapping). Stop if past `itemCount`. |
| Arrow Left | Move left. Stop at column 0 (no wrapping). |
| Arrow Down | Move down by `columns`. If past end → return **`Infinity`** (exit sentinel). |
| Arrow Up | Move up by `columns`. If in row 0 → return **`-1`** (exit sentinel). |

**Sentinel values** signal zone/section transitions:
- **`-1`** → exit upward (move to previous section, or back to tabs zone)
- **`Infinity`** → exit downward (move to footer, next section, or no-op)

### 5.5 Content navigation: section transitions

`resolveContentNavigation` handles the sentinels from `getNextGridIndex`:

**Normal move** (0 ≤ nextIndex < Infinity): stay in current section, update `itemIndex`.

**Exit upward** (nextIndex = -1):
1. If a previous section exists and has a footer → land on that footer.
2. If a previous section exists without footer → land on its last row, preserving column position.
3. If no previous section → switch to TABS zone.

**Exit downward** (nextIndex = Infinity):
1. If current section has a footer → land on footer (`itemIndex = section.itemCount`).
2. If next section exists → land on its first row, preserving column position.
3. If last section with no footer → no-op.

### 5.6 Footer navigation

The "Load More" button is modeled as a **footer** on a section. Its position is `itemIndex === section.itemCount` (one past the last grid item).

When focused on a footer:
- Arrow Up → go back to the last item in the grid.
- Arrow Down → go to the next section's first row (if it exists).
- Enter → triggers `onFooterActivate` callback (loads more items).

### 5.7 Column preservation across sections

When moving vertically between sections, the current column position is preserved:

```typescript
// Landing on the first row of the target section
function getFirstRowTargetIndex(currentCol, targetSection): number {
  return Math.min(currentCol, targetSection.itemCount - 1);
}

// Landing on the last row of the target section
function getLastRowTargetIndex(currentCol, targetSection): number {
  const lastRowStart = Math.floor((itemCount - 1) / columns) * columns;
  return Math.min(lastRowStart + currentCol, itemCount - 1);
}
```

Example: if you're on column 2 in section 0 and press Down past the bottom, you land on column 2 of section 1's first row (clamped if that section has fewer columns).

---

## 6. Layer 2: DOM Operations

> **File**: `src/core/navigation/utils/dom.utils.ts`
>
> All functions that touch the DOM live here.

### 6.1 `focusNavElement(navId, options)`

The bridge between navigation state and the DOM. Called after every state change.

```typescript
function focusNavElement(navId: string, options?: FocusNavOptions): boolean
```

1. `querySelectorAll('[data-nav-id="..."]')` — finds all elements with the matching ID.
2. For each element, checks `offsetParent !== null` — skips elements hidden via `display:none` (e.g., hamburger on desktop, category tabs on mobile).
3. Calls `.focus({ preventScroll: true })` — focuses without the browser's default scroll behavior.
4. Calls `.scrollIntoView({ block, inline, behavior })` — controlled scroll with configurable behavior (`smooth` for normal navigation, `instant` for focus restoration).
5. Returns `true` if an element was successfully focused, `false` otherwise.

**Why check `offsetParent`?** Some elements exist in the DOM at both mobile and desktop sizes (e.g., SearchBar renders twice). The `offsetParent` check ensures only the currently visible instance receives focus.

### 6.2 `skipToFocusableTab(state, key, tabCount)`

After the pure state transition computes a new tab index, this function checks if the target tab is actually visible. If not, it advances in the same arrow direction until it finds one:

```typescript
function skipToFocusableTab(state, key, tabCount): NavState {
  for (let i = 0; i < tabCount - 1; i++) {
    if (canFocusNavElement(getNavIdFromState(state))) break;
    state = { ...state, tabIndex: getNextTabIndex(state.tabIndex, key, tabCount) };
  }
  return state;
}
```

Example: on desktop, pressing Arrow Right from Settings (index 5) would land on Hamburger (index 6), which is hidden. `skipToFocusableTab` advances to index 0 (Popular tab).

This only runs on desktop (flat navigation). Mobile uses `tabRows` which only contains visible tab indices, so no skipping is needed.

### 6.3 `focusNextAvailableTab(startIndex, tabCount, options)`

Fallback used by the DOM sync effect. If the target tab can't be focused (e.g., Escape returns to a hidden tab index on initial load), this searches forward through all tabs to find any focusable one.

### 6.4 `resolveClickTarget(event)`

Syncs navigation state when the user clicks with a mouse:

1. `event.target.closest('[data-nav-id]')` — walks up the DOM tree to find the nearest navigable element (handles clicks on child elements like poster images inside a MovieCard).
2. Parses the `data-nav-id` to determine the zone and indices.
3. Returns a new `NavState`, or `null` if the click wasn't on a navigable element.

This ensures keyboard and mouse focus always agree.

---

## 7. Layer 3: The React Hook

> **File**: `src/core/navigation/hooks/useKeyboardNav.ts`
>
> Thin glue: event listener + `useState` + DOM focus sync effect.

### 7.1 State initialization

```typescript
const [state, setState] = useState<NavState>({
  ...INITIAL_STATE,
  activeZone: initialZone,      // default: TABS; overridden for focus restoration
  tabIndex: activeTabIndex ?? 0,
  itemIndex: initialItemIndex,  // overridden when restoring focus on return
});
```

### 7.2 Refs for event handler freshness

The global `keydown` listener is registered **once** (dependency: `[enabled]`). To avoid stale closures, all changing values are kept in refs:

```typescript
const stateRef = useRef(state);
const configRef = useRef<NavConfig>({ ... });
const callbacksRef = useRef<NavCallbacks>({ ... });

useLayoutEffect(() => {
  stateRef.current = state;
  configRef.current = { tabCount, sections, ... };
  callbacksRef.current = { onTabActivate, ... };
});
```

**Why `useLayoutEffect`?** It runs synchronously after render, before any `keydown` handler could fire. This guarantees the refs always have fresh values when the handler reads them.

### 7.3 The keydown handler

Registered once on `document`:

```
Tab        → preventDefault(), do nothing (disabled per requirements)
Non-nav    → ignore
Any nav    → preventDefault() (stops browser scroll, default focus, etc.)
Enter      → resolveEnterKey() → fire callback + optionally enter content zone
Escape     → fire onEscape callback, then resolveNavigation computes TABS state
Arrow keys → resolveNavigation() → pure state transition
             → skipToFocusableTab() if in tabs zone on desktop
             → setState(newState)
```

### 7.4 Enter key — dual behavior

`resolveEnterKey` handles Enter differently based on zone and tab type:

**In TABS zone:**
1. Always fires `onTabActivate(tabIndex)`.
2. If `tabIndex < enterContentTabCount` (i.e., it's a category tab, not search/theme/settings):
   - Also transitions to CONTENT zone at `(section 0, item 0)`.
   - This means pressing Enter on "Popular" switches to that category AND moves focus to the first movie card.
3. If `tabIndex >= enterContentTabCount` (search, theme, settings):
   - Only fires the callback. The callback handles the specific behavior (focus search input, toggle theme, open settings dropdown).

**In CONTENT zone:**
- If on a footer (`itemIndex === section.itemCount && section.hasFooter`) → fires `onFooterActivate`.
- Otherwise → fires `onItemActivate(sectionIndex, itemIndex)`.

### 7.5 Click handler

Also registered once on `document`. When the user clicks on any element with a `data-nav-id`, `resolveClickTarget` parses it and `setState` syncs the navigation state. This keeps keyboard and mouse focus in agreement.

### 7.6 DOM focus sync effect

Runs after every state change:

```typescript
useEffect(() => {
  if (!enabled) return;

  // 1. Try to focus the element matching current state
  let focused = focusNavElement(getNavIdFromState(state), { behavior });

  // 2. If failed and in tabs zone → search forward for any focusable tab
  if (!focused && state.activeZone === NAV_ZONE.TABS) {
    const nextIndex = focusNextAvailableTab(state.tabIndex, tabCount, ...);
    if (nextIndex !== null) {
      focused = true;
      setState(prev => ({ ...prev, tabIndex: nextIndex }));
    }
  }

  // 3. If still nothing focused → blur active element
  if (!focused) (document.activeElement as HTMLElement)?.blur();
}, [enabled, state]);
```

**Step 1** handles the normal case.
**Step 2** handles fallback scenarios: Escape landing on a hidden tab, initial load with a hidden default tab, etc.
**Step 3** ensures no stale focus remains if no navigable element exists.

**Why `focus({ preventScroll: true })` then `scrollIntoView`?**
The browser's default focus scroll behavior is uncontrollable. By preventing it and scrolling manually, we get consistent `smooth` scrolling during navigation and `instant` scrolling for focus restoration.

### 7.7 Scroll behavior on mount

The `isFirstFocus` ref controls scroll behavior for the initial focus:

```typescript
const isFirstFocus = useRef(true);
// ...
const behavior = isFirstFocus.current ? initialScrollBehavior : 'smooth';
```

- Normal page load → `initialScrollBehavior = 'smooth'` (default).
- Focus restoration after return from details → `initialScrollBehavior = 'instant'` (no smooth scroll, jump immediately to the saved card).

The flag is flipped via `setTimeout(() => { isFirstFocus.current = false }, 0)` — deferred so both invocations in React StrictMode's dev double-render use the same value.

### 7.8 Content key reset

When the user switches categories or toggles search mode, `contentKey` changes (e.g., `'popular'` → `'now_playing'` or `'search'`). This resets the content focus to the first item:

```typescript
if (prevContentKey !== contentKey) {
  setPrevContentKey(contentKey);
  setState(prev => ({ ...prev, sectionIndex: 0, itemIndex: 0 }));
}
```

### 7.9 Empty content guard

If the user is in the content zone but all sections become empty (e.g., search returns no results), the hook snaps back to tabs:

```typescript
if (state.activeZone === NAV_ZONE.CONTENT && !sections.some(s => s.itemCount > 0)) {
  setState(prev => ({ ...prev, activeZone: NAV_ZONE.TABS }));
}
```

### 7.10 `enterContent()` — programmatic zone switch

Exposed in the return value. Used by the search submit flow: when the user presses Enter in the search input, `AppLayout` calls `enterContentRef.current()` to move focus from the search bar into the results grid (see [Search Input Integration](#12-search-input-integration)).

### 7.11 Disabling navigation

When `enabled` is `false`, the hook:
- Returns early from the `useEffect` that registers listeners (no keydown/click handlers active).
- Returns early from the focus sync effect (no DOM focus changes).

Navigation is disabled when:
- The search input is focused (`isSearchFocused`).
- The settings dropdown is open (`isSettingsOpen`).

Both conditions are managed by `AppLayout` and passed to pages via `LayoutContext.isNavDisabled`.

---

## 8. Layer 4: Page-Level Wrapper

> **File**: `src/core/navigation/hooks/usePageNavigation.ts`
>
> Generic convenience wrapper over `useKeyboardNav`.

Pages work with **actual data arrays** (e.g., `TmdbMovie[]`), not abstract section configs. `usePageNavigation<T>` bridges this gap:

### 8.1 Section derivation

Converts `T[][]` item arrays into `ContentSection[]`:

```typescript
const sections = useMemo((): ContentSection[] =>
  sectionItems.map((items, i) => ({
    itemCount: items.length,
    columns: sectionColumns?.[i] ?? columns,
    hasFooter: sectionHasFooter?.[i] ?? false,
  })),
  [sectionItems, columns, sectionColumns, sectionHasFooter],
);
```

### 8.2 Item activation mapping

Translates `(sectionIdx, itemIdx)` → `T` so the page gets the actual item:

```typescript
const handleItemActivate = useCallback(
  (sectionIdx: number, itemIdx: number): void => {
    const item = sectionItems[sectionIdx]?.[itemIdx];
    if (item !== undefined) onItemActivate(item);
  },
  [sectionItems, onItemActivate],
);
```

### 8.3 Per-section column overrides

The `sectionColumns` option lets different sections have different column counts. The movie details page uses this: controls have 1 column, cast has N columns, recommendations have N columns.

### Responsive grid columns: `useGridColumns`

> **File**: `src/core/navigation/hooks/useGridColumns.ts`

Returns the number of grid columns matching the CSS breakpoints:

| Viewport | Tailwind class | Columns |
|---|---|---|
| < 640px | `grid-cols-2` | 2 |
| ≥ 640px | `sm:grid-cols-3` | 3 |
| ≥ 768px | `md:grid-cols-4` | 4 |

Uses `matchMedia` listeners so it only re-renders when a breakpoint boundary is crossed, not on every pixel of resize.

---

## 9. Integration: AppLayout ↔ Pages

The navigation system spans two React component layers: `AppLayout` (shared layout) and page components (`HomePage`, `MovieDetailsPage`). They communicate via React Router's outlet context.

### 9.1 What AppLayout owns

- **Category tab state** (`useCategoryTabs`) — active view, click/focus/blur handlers.
- **Search input state** (`useSearch`) — query, change/clear handlers.
- **Search focus state** — `isSearchFocused` + `isSettingsOpen` → `isNavDisabled`.
- **`focusedTabIndex`** — which header element currently has the focus ring.
- **`enterContentRef`** — a ref that page hooks write their `enterContent` function to.
- **`headerTabRows`** — 2D row layout for mobile, `undefined` for desktop.

### 9.2 What AppLayout exposes via `LayoutContext`

```typescript
interface LayoutContext {
  activeView: AppView;
  handleTabClick: (view: AppView) => void;
  setFocusedTabIndex: (index: number) => void;
  onHeaderActivate: (tabIndex: number) => void;
  isNavDisabled: boolean;
  enterContentRef: React.RefObject<(() => void) | null>;
  headerTabRows?: number[][];
}
```

### 9.3 What pages do with `LayoutContext`

Each page hook (`useHomePage`, `useMovieDetailsPage`) reads the context and:

1. **Passes `isNavDisabled` to `usePageNavigation`** as `enabled: !isNavDisabled`.
2. **Passes `headerTabRows`** as `tabRows` (so navigation knows the mobile layout).
3. **Writes `enterContent` back to `enterContentRef`**:
   ```typescript
   useEffect(() => {
     enterContentRef.current = enterContent;
   }, [enterContentRef, enterContent]);
   ```
4. **Writes `focusedTabIndex` back up** so the header can show the focus ring:
   ```typescript
   useEffect(() => {
     setFocusedTabIndex(focusedTabIndex);
     return () => setFocusedTabIndex(-1); // clear on unmount
   }, [focusedTabIndex, setFocusedTabIndex]);
   ```
5. **Splits `onTabActivate`** into category tabs (index < 3 → `handleTabClick`) and header controls (index ≥ 3 → `onHeaderActivate`).

### 9.4 `handleHeaderActivate` — how non-category tabs work

When Enter is pressed on search (index 3), theme (index 4), or settings (index 5), `onHeaderActivate` in `AppLayout` finds the visible element by `data-nav-id` and either:
- Focuses the `<input>` inside it (for search bar), or
- Clicks it (for theme toggle, settings button).

```typescript
const handleHeaderActivate = useCallback((tabIndex: number): void => {
  const navId = buildNavId(NAV_ID_PREFIX.TAB, tabIndex);
  const elements = document.querySelectorAll(`[data-nav-id="${navId}"]`);
  for (const candidate of elements) {
    if (!(candidate instanceof HTMLElement) || candidate.offsetParent === null) continue;
    const input = candidate.querySelector('input');
    if (input) { input.focus(); return; }
    candidate.click(); return;
  }
}, []);
```

---

## 10. Consumer: Home Page

> **File**: `src/modules/movies/hooks/useHomePage.ts`

The home page has one section (the movie grid or search results or favorites), optionally with a footer ("Load More").

### Configuration passed to `usePageNavigation`:

| Option | Value |
|---|---|
| `tabCount` | 7 (`HEADER_NAV_COUNT`) |
| `sectionItems` | `[movies]` or `[searchResults]` or `[favorites]` or `[]` |
| `columns` | 2/3/4 from `useGridColumns()` |
| `contentKey` | `isSearchActive ? 'search' : activeView` — resets focus on view change |
| `sectionHasFooter` | `[true]` if more pages available |
| `onTabActivate` | category tabs → `handleTabClick`; others → `onHeaderActivate` |
| `onItemActivate` | `handleSelectMovie` → navigates to `/movie/:id` |
| `onFooterActivate` | triggers `movieLoadMore()` or `searchLoadMore()` |
| `activeTabIndex` | index of the currently active category tab |
| `enterContentTabCount` | 3 (only category tabs enter content on Enter) |
| `tabRows` | 2D layout on mobile, `undefined` on desktop |

### Focus restoration

Before navigating to a movie details page, the current `focusedIndex` is saved to `sessionStorage`:

```typescript
const handleSelectMovie = useCallback((movie: TmdbMovie): void => {
  setSessionItem(STORAGE_KEY.NAV.FOCUSED_INDEX, String(focusedIndexRef.current));
  navigate(ROUTES.movieDetails(movie.id), { viewTransition: true });
}, [navigate]);
```

On return, `useHomePage` reads it back:

```typescript
const [returnIndex] = useState(() => {
  const stored = getSessionItem(STORAGE_KEY.NAV.FOCUSED_INDEX);
  removeSessionItem(STORAGE_KEY.NAV.FOCUSED_INDEX);
  return stored !== null ? parseInt(stored, 10) : -1;
});
```

And passes it to `usePageNavigation`:

```typescript
initialZone: returnIndex >= 0 ? NAV_ZONE.CONTENT : undefined,
initialItemIndex: returnIndex >= 0 ? returnIndex : undefined,
initialScrollBehavior: returnIndex >= 0 ? 'instant' : undefined,
```

The result: navigation starts in the content zone at the exact card the user left from, scrolled into view instantly (no smooth animation).

---

## 11. Consumer: Movie Details Page

> **File**: `src/modules/movies/hooks/useMovieDetailsPage.ts`

The details page has **multiple sections** with **different column counts**, built dynamically based on available data.

### Dynamic section construction

```typescript
const sectionItems = useMemo((): DetailsNavItem[][] => {
  const controls = details ? [NAV_BACK, NAV_FAVORITE] : [NAV_BACK];
  const sections = [controls];
  if (castMembers.length > 0)     sections.push(castMembers.map(...));
  if (showTrailerNav)             sections.push([NAV_TRAILER]);
  if (recommendations.length > 0) sections.push(recommendations.map(...));
  return sections;
}, [...]);

const sectionColumns = useMemo((): number[] => {
  const cols = [1];                                        // controls: vertical
  if (castMembers.length > 0) cols.push(castMembers.length); // cast: horizontal
  if (showTrailerNav)         cols.push(1);                // trailer: single
  if (recommendations.length > 0) cols.push(recommendations.length); // recs: horizontal
  return cols;
}, [...]);
```

Section layout for a movie with cast, trailer, and recommendations:

```
Section 0 (cols: 1):  [Back] [Favorite]     ← vertical, ArrowDown moves between them
Section 1 (cols: 8):  [Cast1] ... [Cast8]   ← horizontal, ArrowLeft/Right moves
Section 2 (cols: 1):  [Trailer]             ← single element
Section 3 (cols: 10): [Rec1] ... [Rec10]    ← horizontal, ArrowLeft/Right moves
```

If there's no cast data, trailer becomes section 1 and recommendations become section 2. The section indices are computed dynamically.

### Typed item activation

Each navigable item is a discriminated union:

```typescript
type DetailsNavItem =
  | { kind: 'back' }
  | { kind: 'favorite' }
  | { kind: 'cast'; member: CastMemberDisplay }
  | { kind: 'trailer' }
  | { kind: 'recommendation'; movie: TmdbMovie };
```

The `handleItemActivate` callback uses a switch on `item.kind` to perform the right action (navigate back, toggle favorite, play trailer, navigate to recommended movie).

### Structured focus output

The raw `(focusedSectionIndex, focusedItemIndex)` is converted to a named `DetailsNavFocus` object for cleaner component consumption:

```typescript
interface DetailsNavFocus {
  controlsFocusedIndex: number;  // 0=back, 1=favorite, -1=unfocused
  castFocusedIndex: number;
  trailerFocused: boolean;
  recsFocusedIndex: number;
}
```

Components receive specific fields (e.g., `focus.castFocusedIndex`) instead of having to interpret raw indices.

---

## 12. Search Input Integration

The search input is a special case because typing characters should **not** be intercepted by the global keyboard navigation.

### Flow:

1. **User navigates to the search bar** via arrow keys. `focusedTabIndex === 3`. The search bar container has a focus ring.

2. **User presses Enter on the search tab**. `handleHeaderActivate(3)` runs in `AppLayout`, finds the search bar's `<input>` element, and calls `input.focus()`.

3. **Input receives focus** → `onFocus` fires → `isSearchFocused = true` → `isNavDisabled = true` → keyboard navigation hook disabled entirely. The user can now type freely.

4. **While typing**: Every keystroke dispatches `setSearchQuery`. The saga debounces 500ms and handles the search.

5. **User presses Enter in the input** (with a query):
   ```typescript
   if (e.key === 'Enter' && query) {
     e.nativeEvent.stopImmediatePropagation(); // prevent global handler
     enterContentRef.current?.();              // move focus to first result
     e.currentTarget.blur();                   // re-enables keyboard nav
   }
   ```
   `stopImmediatePropagation()` on the **native event** prevents the global `keydown` listener from also processing Enter (which would try to activate a tab).

6. **User presses Escape in the input**:
   ```typescript
   if (e.key === 'Escape') {
     e.nativeEvent.stopImmediatePropagation();
     handleClear();          // clears search query and results
     e.currentTarget.blur(); // re-enables keyboard nav
   }
   ```

7. **Input blurs** → `onBlur` fires → `isSearchFocused = false` → `isNavDisabled = false` → keyboard navigation re-enables. The user is back in the tabs zone.

---

## 13. Responsive: Mobile vs Desktop

The same navigation system handles both layouts without separate code paths.

### Desktop: flat tab navigation

- `tabRows` is `undefined`.
- Arrow Left/Right cycles through all 7 tab indices.
- `skipToFocusableTab` skips hidden elements (hamburger at index 6 has `offsetParent === null` due to `lg:hidden`).
- Category tabs (indices 0–2) are visible and navigable.

### Mobile: 2D row navigation

- `AppLayout` computes `headerTabRows` when `isMobile` is true:
  ```typescript
  const headerTabRows = isMobile
    ? [[themeTabIndex, settingsTabIndex, HAMBURGER_TAB_INDEX], [searchTabIndex]]
    : undefined;
  ```
- Category tabs (0–2) are not in any row → unreachable on mobile.
- Row 0: Theme (4), Settings (5), Hamburger (6).
- Row 1: Search (3).
- `resolveTabRowNavigation` handles Left/Right within rows and Up/Down between rows.
- No `skipToFocusableTab` needed — `tabRows` only contains visible indices.

### How `useIsMobile` works

Uses `matchMedia('(max-width: 1023px)')` to track the breakpoint, matching Tailwind's `lg:` prefix (1024px). Only re-renders when the boundary is crossed.

---

## 14. Edge Cases & Guards

| Scenario | Handling |
|---|---|
| **Empty content** | If in content zone but all sections have 0 items → snap back to tabs zone |
| **Content key change** | Switching categories or search mode → reset `sectionIndex` and `itemIndex` to 0 |
| **Escape to hidden tab** | After Escape, if the target tab is hidden → `focusNextAvailableTab` searches forward for any visible tab |
| **Rapid category switching** | `contentKey` change resets indices; the previous grid's items are no longer referenced |
| **Focus on unmount** | Page hooks clean up by setting `setFocusedTabIndex(-1)` in the effect cleanup |
| **StrictMode double-render** | `isFirstFocus` flag deferred via `setTimeout` so both invocations see the same value |
| **Click outside navigable area** | `resolveClickTarget` returns `null`, state unchanged |
| **Clicking child elements** | `closest('[data-nav-id]')` walks up the DOM to find the navigable ancestor |
| **Settings dropdown open** | `isNavDisabled = true` → keyboard nav fully paused until dropdown closes |
| **Grid with < 4 items in last row** | `getNextGridIndex` returns `Infinity` when pressing Down on a partial row; handled by exit-downward logic |

### The 2-second auto-switch connection

When `focusNavElement` programmatically focuses a category tab, it triggers the browser's native `focus` event. This event reaches `CategoryTab`'s `onFocus` handler, which calls `handleTabFocus(view)` in `useCategoryTabs`. That starts the 2-second timer. If the user moves away before 2 seconds, `onBlur` fires and cancels the timer.

This is an emergent behavior from two independent systems (keyboard nav + category tabs) connected via native DOM focus events — neither system knows about the other.

---

## 15. File Reference

| File | Purpose |
|---|---|
| `core/navigation/constants.ts` | `NAV_KEY`, `NAV_ZONE`, `NAV_ID_PREFIX` |
| `core/navigation/types/navigation.types.ts` | `NavState`, `NavConfig`, `ContentSection`, hook option/return types |
| `core/navigation/utils/navigation.utils.ts` | Pure state transitions: `resolveNavigation`, `getNextGridIndex`, `buildNavId` |
| `core/navigation/utils/dom.utils.ts` | DOM operations: `focusNavElement`, `skipToFocusableTab`, `resolveClickTarget` |
| `core/navigation/hooks/useKeyboardNav.ts` | Core hook: event listener, state, DOM sync |
| `core/navigation/hooks/usePageNavigation.ts` | Generic page wrapper: section derivation, item mapping |
| `core/navigation/hooks/useGridColumns.ts` | Responsive column count matching CSS grid breakpoints |
| `shared/components/AppLayout/AppLayout.tsx` | Owns search focus, settings open, `enterContentRef`, `headerTabRows` |
| `shared/components/AppLayout/layout.types.ts` | `LayoutContext` interface |
| `shared/hooks/useCategoryTabs.ts` | 2-second auto-switch on focus, immediate switch on click |
| `modules/movies/hooks/useHomePage.ts` | Home page navigation consumer: grid, search results, favorites |
| `modules/movies/hooks/useMovieDetailsPage.ts` | Details page consumer: dynamic multi-section navigation |
