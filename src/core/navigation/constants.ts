export const NAV_KEY = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  TAB: 'Tab',
} as const;

export const NAV_ZONE = {
  TABS: 'tabs',
  CONTENT: 'content',
} as const;

export const NAV_ID_PREFIX = {
  TAB: 'nav-tab',
  ITEM: 'nav-item',
} as const;

/** px per arrow key press; lerp animates toward target each rAF frame. */
export const NAV_SCROLL_STEP = 120;
