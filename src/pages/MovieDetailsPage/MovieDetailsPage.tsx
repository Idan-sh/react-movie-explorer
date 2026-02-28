/**
 * MovieDetailsPage
 *
 * Route: /movie/:id
 *
 * Reads movie id from URL, fetches details, renders MovieDetails.
 *
 * Keyboard navigation:
 * - TABS zone: Left/Right cycle through header tabs; Enter activates (navigates home + tab)
 * - CONTENT zone: item 0 = Back button; ArrowDown from tabs → Back; ArrowUp → tabs
 * - Escape or Enter on Back: navigates back to previous page
 */

import { useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useAppSelector } from "@/core/store";
import { useMovieDetails, MovieDetails } from "@/modules/movies";
import { useFavoriteToggle, selectFavorites } from "@/modules/favorites";
import { usePageNavigation } from "@/modules/navigation";
import type { LayoutContext } from "@/shared/components";
import { APP_VIEW_TABS } from "@/shared/constants";

export function MovieDetailsPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = Number(id);

  const { activeView, handleTabClick, setFocusedTabIndex, scrollRef } = useOutletContext<LayoutContext>();

  const { details, error } = useMovieDetails(movieId);
  const toggleFavorite = useFavoriteToggle();
  const favorites = useAppSelector(selectFavorites);
  const isFavorited = favorites.some((f) => f.id === movieId);

  const handleBack = useCallback((): void => { navigate(-1); }, [navigate]);
  const handleToggleFavorite = useCallback((): void => {
    if (details) toggleFavorite(details);
  }, [details, toggleFavorite]);

  // Single navigable item: the Back button.
  const sectionItems = useMemo(() => [['back']], []);

  const { focusedTabIndex, focusedSectionIndex, focusedItemIndex } = usePageNavigation<string>({
    tabCount: APP_VIEW_TABS.length,
    sectionItems,
    columns: 1,
    contentKey: 'details',
    onTabActivate: (index) => handleTabClick(APP_VIEW_TABS[index]),
    onItemActivate: () => handleBack(),
    onEscape: handleBack,
    activeTabIndex: APP_VIEW_TABS.indexOf(activeView),
    scrollContainerRef: scrollRef,
  });

  useEffect(() => {
    setFocusedTabIndex(focusedTabIndex);
    return () => setFocusedTabIndex(-1);
  }, [focusedTabIndex, setFocusedTabIndex]);

  const focusedIndex = focusedSectionIndex === 0 ? focusedItemIndex : -1;

  return (
    <MovieDetails
      details={details}
      error={error}
      isFavorited={isFavorited}
      onBack={handleBack}
      onToggleFavorite={handleToggleFavorite}
      focusedItemIndex={focusedIndex}
    />
  );
}
