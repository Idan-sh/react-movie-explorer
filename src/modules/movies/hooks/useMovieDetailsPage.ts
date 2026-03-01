/**
 * useMovieDetailsPage Hook
 *
 * Netflix-style navigation across all interactive elements:
 * - Section 0: Back + Favorite (columns: 1, vertical)
 * - Section 1: Cast members (columns: N, horizontal row)
 * - Section 2: Trailer thumbnail (columns: 1, only when available and not playing)
 * - Section 3: Recommendation cards (columns: N, horizontal row)
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/core/store';
import {
  fetchMovieDetails,
  clearMovieDetails,
  selectMovieDetails,
  selectDetailsIsLoading,
  selectDetailsError,
} from '../store';
import type {
  TmdbMovie,
  TmdbMovieDetails,
  TmdbVideo,
  CastMemberDisplay,
  MovieDetailsDisplay,
  MovieDetailsMetaDisplay,
  MovieDetailsCastDisplay,
} from '../types';
import {
  formatRating,
  getReleaseYear,
  formatRuntime,
  formatMoney,
  getDirector,
  getProfileUrl,
  getTrailer,
  fireFavoriteConfetti,
} from '../utils';
import { CAST } from '../constants';
import { useFavoriteToggle, selectFavoriteIds } from '@/modules/favorites';
import { usePageNavigation, buildNavId, NAV_ID_PREFIX } from '@/core/navigation';
import type { LayoutContext } from '@/shared/components';
import { APP_VIEW_TABS, HEADER_NAV_COUNT, ROUTES } from '@/shared/constants';

const MAX_RECOMMENDATIONS = 10;

// ── Nav item types ────────────────────────────────────────────────

type DetailsNavItem =
  | { kind: 'back' }
  | { kind: 'favorite' }
  | { kind: 'cast'; member: CastMemberDisplay }
  | { kind: 'trailer' }
  | { kind: 'recommendation'; movie: TmdbMovie };

const NAV_BACK: DetailsNavItem = { kind: 'back' };
const NAV_FAVORITE: DetailsNavItem = { kind: 'favorite' };
const NAV_TRAILER: DetailsNavItem = { kind: 'trailer' };

// ── Focus state for each navigable section ────────────────────────

export interface DetailsNavFocus {
  controlsFocusedIndex: number;
  castFocusedIndex: number;
  trailerFocused: boolean;
  recsFocusedIndex: number;
}

const UNFOCUSED: DetailsNavFocus = {
  controlsFocusedIndex: -1,
  castFocusedIndex: -1,
  trailerFocused: false,
  recsFocusedIndex: -1,
};

// ── Return type ───────────────────────────────────────────────────

export interface UseMovieDetailsPageReturn {
  details: TmdbMovieDetails | null;
  isLoading: boolean;
  error: string | null;
  display: MovieDetailsDisplay | null;
  isFavorited: boolean;
  onBack: () => void;
  onToggleFavorite: (e: React.MouseEvent<HTMLButtonElement>) => void;
  focus: DetailsNavFocus;
  trailer: TmdbVideo | null;
  isTrailerPlaying: boolean;
  onPlayTrailer: () => void;
  recommendations: TmdbMovie[];
  castSectionIndex: number;
  recsSectionIndex: number;
}

export function useMovieDetailsPage(): UseMovieDetailsPageReturn {
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
      rating: formatRating(details.vote_average, details.vote_count),
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

  const {
    activeView,
    handleTabClick,
    setFocusedTabIndex,
    onHeaderActivate,
    isNavDisabled,
    enterContentRef,
  } = useOutletContext<LayoutContext>();

  const toggleFavorite = useFavoriteToggle();
  const favoriteIds = useAppSelector(selectFavoriteIds);
  const isFavorited = favoriteIds.includes(movieId);

  // ── Trailer state (lifted from MovieTrailer) ────────────────────
  const trailer = useMemo(
    () => (details?.videos ? getTrailer(details.videos.results) : null),
    [details],
  );
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const handleToggleTrailer = useCallback((): void => {
    setIsTrailerPlaying((prev) => !prev);
  }, []);

  // ── Recommendations ─────────────────────────────────────────────
  const recommendations = useMemo(
    () => details?.recommendations?.results.slice(0, MAX_RECOMMENDATIONS) ?? [],
    [details],
  );

  // ── Navigation handlers ─────────────────────────────────────────
  const handleBack = useCallback((): void => {
    navigate(-1);
  }, [navigate]);

  const handleToggleFavorite = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>): void => {
      if (!details) return;
      fireFavoriteConfetti(e.currentTarget, !isFavorited);
      toggleFavorite(details);
    },
    [details, toggleFavorite, isFavorited],
  );

  // ── Build navigable sections dynamically ────────────────────────
  const showTrailerNav = trailer !== null;
  const castMembers = display?.cast?.cast ?? [];

  const sectionItems = useMemo((): DetailsNavItem[][] => {
    const controls: DetailsNavItem[] = details
      ? [NAV_BACK, NAV_FAVORITE]
      : [NAV_BACK];
    const sections: DetailsNavItem[][] = [controls];
    if (castMembers.length > 0) {
      sections.push(
        castMembers.map((member) => ({ kind: 'cast', member })),
      );
    }
    if (showTrailerNav) sections.push([NAV_TRAILER]);
    if (recommendations.length > 0) {
      sections.push(
        recommendations.map((movie) => ({ kind: 'recommendation', movie })),
      );
    }
    return sections;
  }, [details, castMembers, showTrailerNav, recommendations]);

  const sectionColumns = useMemo((): number[] => {
    const cols = [1];
    if (castMembers.length > 0) cols.push(castMembers.length);
    if (showTrailerNav) cols.push(1);
    if (recommendations.length > 0) cols.push(recommendations.length);
    return cols;
  }, [castMembers, showTrailerNav, recommendations]);

  const castSectionIndex = castMembers.length > 0 ? 1 : -1;

  const trailerSectionIndex = useMemo(() => {
    if (!showTrailerNav) return -1;
    let idx = 1;
    if (castMembers.length > 0) idx++;
    return idx;
  }, [showTrailerNav, castMembers]);

  const recsSectionIndex = useMemo(() => {
    if (recommendations.length === 0) return -1;
    let idx = 1;
    if (castMembers.length > 0) idx++;
    if (showTrailerNav) idx++;
    return idx;
  }, [castMembers, showTrailerNav, recommendations]);

  const handleTabActivate = useCallback(
    (index: number): void => {
      if (index < APP_VIEW_TABS.length) {
        handleTabClick(APP_VIEW_TABS[index]);
      } else {
        onHeaderActivate(index);
      }
    },
    [handleTabClick, onHeaderActivate],
  );

  const handleItemActivate = useCallback(
    (item: DetailsNavItem): void => {
      switch (item.kind) {
        case 'back':
          handleBack();
          break;
        case 'favorite':
          if (details) {
            const el = document.querySelector(
              `[data-nav-id="${buildNavId(NAV_ID_PREFIX.ITEM, 0, 1)}"]`,
            );
            if (el instanceof HTMLElement) {
              fireFavoriteConfetti(el, !isFavorited);
            }
            toggleFavorite(details);
          }
          break;
        case 'cast':
          break;
        case 'trailer':
          handleToggleTrailer();
          break;
        case 'recommendation':
          navigate(ROUTES.movieDetails(item.movie.id), {
            viewTransition: true,
          });
          break;
      }
    },
    [
      handleBack,
      details,
      toggleFavorite,
      isFavorited,
      handleToggleTrailer,
      navigate,
    ],
  );

  const { focusedTabIndex, focusedSectionIndex, focusedItemIndex, enterContent } =
    usePageNavigation<DetailsNavItem>({
      tabCount: HEADER_NAV_COUNT,
      sectionItems,
      columns: 1,
      sectionColumns,
      contentKey: 'details',
      onTabActivate: handleTabActivate,
      onItemActivate: handleItemActivate,
      onEscape: handleBack,
      activeTabIndex: APP_VIEW_TABS.indexOf(activeView),
      enterContentTabCount: APP_VIEW_TABS.length,
      enabled: !isNavDisabled,
    });

  useEffect(() => {
    enterContentRef.current = enterContent;
  }, [enterContentRef, enterContent]);

  useEffect(() => {
    setFocusedTabIndex(focusedTabIndex);
    return () => setFocusedTabIndex(-1);
  }, [focusedTabIndex, setFocusedTabIndex]);

  // ── Derive structured focus state ───────────────────────────────
  const focus = useMemo((): DetailsNavFocus => {
    if (focusedSectionIndex === -1) return UNFOCUSED;
    if (focusedSectionIndex === 0) {
      return { ...UNFOCUSED, controlsFocusedIndex: focusedItemIndex };
    }
    if (focusedSectionIndex === castSectionIndex) {
      return { ...UNFOCUSED, castFocusedIndex: focusedItemIndex };
    }
    if (focusedSectionIndex === trailerSectionIndex) {
      return { ...UNFOCUSED, trailerFocused: true };
    }
    if (focusedSectionIndex === recsSectionIndex) {
      return { ...UNFOCUSED, recsFocusedIndex: focusedItemIndex };
    }
    return UNFOCUSED;
  }, [focusedSectionIndex, focusedItemIndex, castSectionIndex, trailerSectionIndex, recsSectionIndex]);

  return {
    details,
    isLoading,
    error,
    display,
    isFavorited,
    onBack: handleBack,
    onToggleFavorite: handleToggleFavorite,
    focus,
    trailer,
    isTrailerPlaying,
    onPlayTrailer: handleToggleTrailer,
    recommendations,
    castSectionIndex,
    recsSectionIndex,
  };
}
