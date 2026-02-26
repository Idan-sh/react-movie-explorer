import type { AppView } from '@/shared/types';

export interface LayoutContext {
  activeView: AppView;
  handleTabClick: (view: AppView) => void;
  setFocusedTabIndex: (index: number) => void;
}
