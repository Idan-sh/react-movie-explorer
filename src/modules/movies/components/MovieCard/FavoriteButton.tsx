/**
 * FavoriteButton Component
 *
 * Heart icon overlay on MovieCard poster.
 * Visible on hover, always visible when favorited or card is focused.
 * Fires a confetti burst on click.
 */

import confetti from "canvas-confetti";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";

const FAVORITE_COLORS = ["#ef4444", "#dc2626", "#f87171", "#fb923c"];
const UNFAVORITE_COLORS = ["#9ca3af", "#6b7280", "#a1a1aa", "#d4d4d8"];

function fireConfetti(button: HTMLButtonElement, isFavoriting: boolean): void {
  const rect = button.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  confetti({
    particleCount: 40,
    spread: 360,
    startVelocity: 7,
    gravity: 0.2,
    decay: 0.85,
    ticks: 40,
    origin: { x, y },
    colors: isFavoriting ? FAVORITE_COLORS : UNFAVORITE_COLORS,
    shapes: ["circle"],
    scalar: 0.5
  });
}

export interface FavoriteButtonProps {
  isFavorited: boolean;
  isFocused: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export function FavoriteButton({
  isFavorited,
  isFocused,
  onClick
}: FavoriteButtonProps): React.JSX.Element {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    fireConfetti(e.currentTarget, !isFavorited);
    onClick(e);
  };

  return (
    <button
      tabIndex={-1}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      onClick={handleClick}
      className={`
        absolute top-2 left-2 z-10
        flex h-8 w-8 items-center justify-center rounded-full
        transition-all duration-150 ease-in-out
        hover:scale-110
        ${
          isFavorited
            ? "bg-red-500 text-white opacity-100"
            : `bg-black/50 text-white opacity-0 group-hover:opacity-100 ${isFocused ? "opacity-100" : ""}`
        }
      `}
    >
      {isFavorited ? <HeartSolid className="h-4 w-4" /> : <HeartOutline className="h-4 w-4" />}
    </button>
  );
}
