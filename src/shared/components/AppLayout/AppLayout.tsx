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

import { useState, useCallback, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCategoryTabs, useIsMobile } from '@/shared/hooks';
import { ROUTES, Z_LAYER, APP_VIEW_TABS, HAMBURGER_TAB_INDEX } from '@/shared/constants';
import { SearchBar, useSearch } from '@/modules/search';
import { buildNavId, NAV_ID_PREFIX } from '@/core/navigation';
import { AppHeader } from '../AppHeader';
import { AppFooter } from '../AppFooter';
import { ScrollToTopButton } from '../ScrollToTopButton';
import { useScrollToTop } from '../ScrollToTopButton';
import { ScrollHint, useScrollHint } from '../ScrollHint';
import { ThemeToggle, useTheme } from '../Theme';
import { SettingsButton, useSettings } from '../Settings';
import type { AppView } from '@/shared/types';
import type { LayoutContext } from './layout.types';

export function AppLayout(): React.JSX.Element {
  const isMobile = useIsMobile();
  const [focusedTabIndex, setFocusedTabIndex] = useState(-1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const enterContentRef = useRef<(() => void) | null>(null);
  const { query, handleInputChange, handleClear } = useSearch();
  const { isDark, toggleTheme } = useTheme();
  const { isScrollEnabled, toggleScroll } = useSettings();
  const {
    scrollRef,
    isVisible: isScrollTopVisible,
    scrollToTop,
  } = useScrollToTop();
  const { isHintVisible } = useScrollHint(scrollRef, isScrollEnabled);
  const { activeView, handleTabClick, handleTabFocus, handleTabBlur } =
    useCategoryTabs(scrollRef);
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

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter' && query) {
        e.nativeEvent.stopImmediatePropagation();
        enterContentRef.current?.();
        e.currentTarget.blur();
        return;
      }
      if (e.key === 'Escape') {
        e.nativeEvent.stopImmediatePropagation();
        handleClear();
        e.currentTarget.blur();
      }
    },
    [query, handleClear],
  );

  const handleHeaderActivate = useCallback((tabIndex: number): void => {
    const navId = buildNavId(NAV_ID_PREFIX.TAB, tabIndex);
    const elements = document.querySelectorAll(`[data-nav-id="${navId}"]`);
    for (const candidate of elements) {
      if (!(candidate instanceof HTMLElement) || candidate.offsetParent === null)
        continue;
      const input = candidate.querySelector('input') as HTMLInputElement | null;
      if (input) {
        input.focus();
        return;
      }
      candidate.click();
      return;
    }
  }, []);

  const searchTabIndex = APP_VIEW_TABS.length;
  const themeTabIndex = APP_VIEW_TABS.length + 1;
  const settingsTabIndex = APP_VIEW_TABS.length + 2;

  const headerTabRows = isMobile
    ? [
        [themeTabIndex, settingsTabIndex, HAMBURGER_TAB_INDEX],
        [searchTabIndex],
      ]
    : undefined;

  const layoutContext: LayoutContext = {
    activeView,
    handleTabClick: handleTabClickWithNav,
    setFocusedTabIndex,
    onHeaderActivate: handleHeaderActivate,
    isNavDisabled: isSearchFocused || isSettingsOpen,
    enterContentRef,
    headerTabRows,
  };

  const searchSlot = (
    <SearchBar
      query={query}
      onInputChange={handleInputChange}
      onClear={handleClear}
      onFocus={handleSearchFocus}
      onBlur={handleSearchBlur}
      onKeyDown={handleSearchKeyDown}
      navId={buildNavId(NAV_ID_PREFIX.TAB, searchTabIndex)}
      isFocused={focusedTabIndex === searchTabIndex}
    />
  );

  const actionsSlot = (
    <>
      <ThemeToggle
        isDark={isDark}
        onToggle={toggleTheme}
        navId={buildNavId(NAV_ID_PREFIX.TAB, themeTabIndex)}
        isFocused={focusedTabIndex === themeTabIndex}
      />
      <SettingsButton
        isScrollEnabled={isScrollEnabled}
        onToggleScroll={toggleScroll}
        navId={buildNavId(NAV_ID_PREFIX.TAB, settingsTabIndex)}
        isFocused={focusedTabIndex === settingsTabIndex}
        onOpenChange={setIsSettingsOpen}
      />
    </>
  );

  return (
    <div className="flex h-full flex-col">
      <AppHeader
        activeView={activeView}
        focusedTabIndex={focusedTabIndex}
        onTabClick={handleTabClickWithNav}
        onTabFocus={handleTabFocus}
        onTabBlur={handleTabBlur}
        searchSlot={searchSlot}
        actionsSlot={actionsSlot}
        hamburgerNavId={buildNavId(NAV_ID_PREFIX.TAB, HAMBURGER_TAB_INDEX)}
        hamburgerFocused={isMobile && focusedTabIndex === HAMBURGER_TAB_INDEX}
        hamburgerTabIndex={isMobile ? HAMBURGER_TAB_INDEX : undefined}
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

      <ScrollHint isVisible={isHintVisible} />
    </div>
  );
}
