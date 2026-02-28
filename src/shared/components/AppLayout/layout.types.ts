import type { AppView } from '@/shared/types';

export interface LayoutContext {
  activeView: AppView;
  handleTabClick: (view: AppView) => void;
  setFocusedTabIndex: (index: number) => void;
  /** True while the search input is focused — disables keyboard grid nav */
  isSearchFocused: boolean;
  /** Ref to the scrollable <main> container — used by pages that need keyboard scroll */
  scrollRef: React.RefObject<HTMLElement | null>;
}
