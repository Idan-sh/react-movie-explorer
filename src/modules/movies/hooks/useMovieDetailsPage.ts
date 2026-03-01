/**
 * useMovieDetailsPage Hook
 *
 * Single hook for the movie details page: URL param, fetch, display derivation,
 * favorites, keyboard nav. Combines former useMovieDetails + useMovieDetailsDisplay + page orchestration.
 */

import { useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/core/store';
import {
  fetchMovieDetails,
  clearMovieDetails,
  selectMovieDetails,
  selectDetailsIsLoading,
  selectDetailsError,
} from '../store';
import type { MovieDetailsDisplay, MovieDetailsMetaDisplay, MovieDetailsCastDisplay } from '../types';
import { formatRating, getReleaseYear, formatRuntime, formatMoney, getDirector, getProfileUrl, fireFavoriteConfetti } from '../utils';
import { CAST } from '../constants';
import { useFavoriteToggle, selectFavorites } from '@/modules/favorites';
import { usePageNavigation } from '@/core/navigation';
import type { LayoutContext } from '@/shared/components';
import { APP_VIEW_TABS } from '@/shared/constants';

export function useMovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = Number(id);

  const dispatch = useAppDispatch();
  const details = useAppSelector(selectMovieDetails);
  const isLoading = useAppSelector(selectDetailsIsLoading);
  const error = useAppSelector(selectDetailsError);

  useEffect(() => {
    dispatch(fetchMovieDetails({ id: movieId }));
    return () => {
      dispatch(clearMovieDetails());
    };
  }, [dispatch, movieId]);

  const display = useMemo((): MovieDetailsDisplay | null => {
    if (!details) return null;
    const meta: MovieDetailsMetaDisplay = {
      rating: formatRating(details.vote_average),
      year: getReleaseYear(details.release_date),
      runtime: formatRuntime(details.runtime),
      budget: formatMoney(details.budget),
      revenue: formatMoney(details.revenue),
    };
    const cast: MovieDetailsCastDisplay | null = details.credits
      ? {
          director: getDirector(details.credits.crew),
          cast: details.credits.cast.slice(0, CAST.MAX_DISPLAY).map((m) => ({
            id: m.id,
            name: m.name,
            character: m.character,
            profileUrl: getProfileUrl(m.profile_path),
          })),
        }
      : null;
    return { meta, cast };
  }, [details]);

  const { activeView, handleTabClick, setFocusedTabIndex, scrollRef } =
    useOutletContext<LayoutContext>();

  const toggleFavorite = useFavoriteToggle();
  const favorites = useAppSelector(selectFavorites);
  const isFavorited = favorites.some((f) => f.id === movieId);

  const handleBack = useCallback((): void => {
    navigate(-1);
  }, [navigate]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent<HTMLButtonElement>): void => {
    if (!details) return;
    fireFavoriteConfetti(e.currentTarget, !isFavorited);
    toggleFavorite(details);
  }, [details, toggleFavorite, isFavorited]);

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

  return {
    details,
    isLoading,
    error,
    display,
    isFavorited,
    onBack: handleBack,
    onToggleFavorite: handleToggleFavorite,
    focusedItemIndex: focusedIndex,
  };
}
