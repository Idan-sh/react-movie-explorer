/**
 * AppLayout Component
 *
 * Shared layout shell for all routes.
 * Renders AppHeader + scrollable content area (Outlet + AppFooter) + ScrollToTopButton.
 *
 * Owns tab state (useCategoryTabs) and exposes it to child pages
 * via React Router's Outlet context. Pages that need keyboard nav
 * can sync focusedTabIndex back up via the provided setter.
 */

import { useState, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCategoryTabs } from '@/shared/hooks';
import { ROUTES } from '@/shared/constants';
import { AppHeader } from '../AppHeader';
import { AppFooter } from '../AppFooter';
import { ScrollToTopButton } from '../ScrollToTopButton';
import { useScrollToTop } from '../ScrollToTopButton';
import type { AppView } from '@/shared/types';
import type { LayoutContext } from './layout.types';

export function AppLayout(): React.JSX.Element {
  const { activeView, handleTabClick, handleTabFocus, handleTabBlur } = useCategoryTabs();
  const [focusedTabIndex, setFocusedTabIndex] = useState(-1);
  const { scrollRef, isVisible: isScrollTopVisible, scrollToTop } = useScrollToTop();
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabClickWithNav = useCallback(
    (view: AppView): void => {
      handleTabClick(view);
      if (location.pathname !== ROUTES.HOME) {
        navigate(ROUTES.HOME);
      }
    },
    [handleTabClick, location.pathname, navigate]
  );

  const layoutContext: LayoutContext = {
    activeView,
    handleTabClick: handleTabClickWithNav,
    setFocusedTabIndex,
  };

  return (
    <div className="flex h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <AppHeader
        activeView={activeView}
        focusedTabIndex={focusedTabIndex}
        onTabClick={handleTabClickWithNav}
        onTabFocus={handleTabFocus}
        onTabBlur={handleTabBlur}
      />

      <main ref={scrollRef} className="relative z-0 flex-1 overflow-auto overscroll-contain">
        <div className="flex min-h-full flex-col">
          <div className="flex-1">
            <Outlet context={layoutContext} />
          </div>
          <AppFooter />
        </div>
      </main>

      <ScrollToTopButton isVisible={isScrollTopVisible} onClick={scrollToTop} />
    </div>
  );
}
