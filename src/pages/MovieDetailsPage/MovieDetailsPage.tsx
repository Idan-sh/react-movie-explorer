/**
 * MovieDetailsPage
 *
 * Route: /movie/:id
 *
 * Reads movie id from URL, fetches details, renders MovieDetails component.
 * Escape key navigates back (capture phase, before any other handler).
 */

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMovieDetails, MovieDetails } from "@/modules/movies";

export function MovieDetailsPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { details, isLoading, error } = useMovieDetails(Number(id));

  const handleBack = (): void => {
    navigate(-1);
  };

  // Escape → go back
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
      <MovieDetails details={details} isLoading={isLoading} error={error} onBack={handleBack} />
    </div>
  );
}
