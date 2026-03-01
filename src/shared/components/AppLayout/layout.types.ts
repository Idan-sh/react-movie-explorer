import type { AppView } from '@/shared/types';

/** Context provided by AppLayout to route outlets (e.g. HomePage, MovieDetailsPage). */
export interface LayoutContext {
  activeView: AppView;
  handleTabClick: (view: AppView) => void;
  setFocusedTabIndex: (index: number) => void;
  /** True while the search input is focused — disables keyboard grid nav */
  isSearchFocused: boolean;
  /** Ref to the scrollable <main> container — used by pages that need keyboard scroll */
  scrollRef: React.RefObject<HTMLElement | null>;
  /** Activates a header control by tab index (search, theme, settings) */
  onHeaderActivate: (tabIndex: number) => void;
  /** True while the settings dropdown is open — disables keyboard nav */
  isSettingsOpen: boolean;
}
