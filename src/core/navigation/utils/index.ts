export {
  isNavKey,
  getNextTabIndex,
  getNextGridIndex,
  getFirstRowTargetIndex,
  getLastRowTargetIndex,
  resolveNavigation,
  buildNavId,
  createScrollController,
  getNavIdFromState,
} from './navigation.utils';
export type { ScrollController } from './navigation.utils';

export { focusNavElement, resolveClickTarget } from './dom.utils';
