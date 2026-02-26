/**
 * MovieDetailsPage
 *
 * Route: /movie/:id
 *
 * Reads movie id from URL, fetches details, renders MovieDetails.
 * Escape navigates back (capture phase so it fires before any other handler).
 */

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/core/store";
import { useMovieDetails, MovieDetails } from "@/modules/movies";
import { useFavoriteToggle, selectFavorites } from "@/modules/favorites";

export function MovieDetailsPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = Number(id);

  const { details, isLoading, error } = useMovieDetails(movieId);
  const toggleFavorite = useFavoriteToggle();
  const favorites = useAppSelector(selectFavorites);
  const isFavorited = favorites.some((f) => f.id === movieId);

  const handleBack = (): void => { navigate(-1); };
  const handleToggleFavorite = (): void => { if (details) toggleFavorite(details); };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopImmediatePropagation();
        navigate(-1);
      }
    }
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [navigate]);

  return (
    <div className="flex h-screen flex-col bg-gray-100 dark:bg-gray-900 overflow-auto">
      <MovieDetails
        details={details}
        isLoading={isLoading}
        error={error}
        isFavorited={isFavorited}
        onBack={handleBack}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}
