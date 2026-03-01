/**
 * AppLayout Component
 *
 * Shared layout shell for all routes.
 * Renders AppHeader + scrollable content area (Outlet + AppFooter) + ScrollToTopButton.
 *
 * Owns tab state (useCategoryTabs) and exposes it to child pages
 * via React Router's Outlet context. Pages that need keyboard nav
 * can sync focusedTabIndex back up via the provided setter.
 *
 * Also owns isSearchFocused — passed to header (for SearchBar) and
 * to child pages (to pause keyboard nav while the user is typing).
 */

import { useState, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCategoryTabs } from '@/shared/hooks';
import { ROUTES, Z_LAYER } from '@/shared/constants';
import { SearchBar, useSearch } from '@/modules/search';
import { AppHeader } from '../AppHeader';
import { AppFooter } from '../AppFooter';
import { ScrollToTopButton } from '../ScrollToTopButton';
import { useScrollToTop } from '../ScrollToTopButton';
import { ThemeToggle, useTheme } from '../Theme';
import { SettingsButton, useSettings } from '../Settings';
import type { AppView } from '@/shared/types';
import type { LayoutContext } from './layout.types';

export function AppLayout(): React.JSX.Element {
  const { activeView, handleTabClick, handleTabFocus, handleTabBlur } =
    useCategoryTabs();
  const [focusedTabIndex, setFocusedTabIndex] = useState(-1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { query, handleInputChange, handleClear } = useSearch();
  const { isDark, toggleTheme } = useTheme();
  const { isScrollEnabled, toggleScroll } = useSettings();
  const {
    scrollRef,
    isVisible: isScrollTopVisible,
    scrollToTop,
  } = useScrollToTop();
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabClickWithNav = useCallback(
    (view: AppView): void => {
      handleTabClick(view);
      if (location.pathname !== ROUTES.HOME) {
        navigate(ROUTES.HOME, { viewTransition: true });
      }
    },
    [handleTabClick, location.pathname, navigate],
  );

  const handleSearchFocus = useCallback((): void => {
    setIsSearchFocused(true);
  }, []);

  const handleSearchBlur = useCallback((): void => {
    setIsSearchFocused(false);
  }, []);

  const layoutContext: LayoutContext = {
    activeView,
    handleTabClick: handleTabClickWithNav,
    setFocusedTabIndex,
    isSearchFocused,
    scrollRef,
  };

  const searchSlot = (
    <SearchBar
      query={query}
      onInputChange={handleInputChange}
      onClear={handleClear}
      onFocus={handleSearchFocus}
      onBlur={handleSearchBlur}
    />
  );

  const actionsSlot = (
    <>
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      <SettingsButton
        isScrollEnabled={isScrollEnabled}
        onToggleScroll={toggleScroll}
      />
    </>
  );

  return (
    <div className="flex h-screen flex-col">
      <AppHeader
        activeView={activeView}
        focusedTabIndex={focusedTabIndex}
        onTabClick={handleTabClickWithNav}
        onTabFocus={handleTabFocus}
        onTabBlur={handleTabBlur}
        searchSlot={searchSlot}
        actionsSlot={actionsSlot}
      />

      {/*
        overflow-hidden: disables trackpad/mouse-wheel scrolling per requirements.
        The element is still a scroll container — scrollTop can be set programmatically,
        so keyboard nav's scrollIntoView() and ScrollToTopButton still work correctly.
      */}
      <main
        ref={scrollRef}
        style={{ zIndex: Z_LAYER.CONTENT }}
        className={`relative flex-1 flex flex-col ${isScrollEnabled ? 'overflow-y-auto' : 'overflow-hidden'}`}
      >
        <div className="grow shrink-0 bg-gray-100 dark:bg-gray-900">
          <Outlet context={layoutContext} />
        </div>
        <AppFooter />
      </main>

      {location.pathname === ROUTES.HOME && (
        <ScrollToTopButton
          isVisible={isScrollTopVisible}
          onClick={scrollToTop}
        />
      )}
    </div>
  );
}
