import type { AppView } from '@/shared/types';

/** Context provided by AppLayout to route outlets (e.g. HomePage, MovieDetailsPage). */
export interface LayoutContext {
  activeView: AppView;
  handleTabClick: (view: AppView) => void;
  setFocusedTabIndex: (index: number) => void;
  /** Activates a header control by tab index (search, theme, settings) */
  onHeaderActivate: (tabIndex: number) => void;
  /** True when keyboard nav should be paused (search input focused, settings dropdown open) */
  isNavDisabled: boolean;
  /** Ref that page hooks write their enterContent function to. Called on search submit. */
  enterContentRef: React.RefObject<(() => void) | null>;
  /** 2D row layout for header tabs on mobile (undefined on desktop = flat navigation) */
  headerTabRows?: number[][];
}
