/**
 * Confetti Utilities
 *
 * Shared confetti burst effect for favorite toggle buttons.
 */

import confetti from "canvas-confetti";

const FAVORITE_COLORS = ["#ef4444", "#dc2626", "#f87171", "#fb923c"];
const UNFAVORITE_COLORS = ["#9ca3af", "#6b7280", "#a1a1aa", "#d4d4d8"];

export function fireFavoriteConfetti(button: HTMLButtonElement, isFavoriting: boolean): void {
  const icon = button.querySelector("svg") ?? button;
  const rect = icon.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  confetti({
    particleCount: 40,
    spread: 360,
    startVelocity: 4,
    gravity: 0,
    drift: 0,
    decay: 0.85,
    ticks: 40,
    origin: { x, y },
    colors: isFavoriting ? FAVORITE_COLORS : UNFAVORITE_COLORS,
    shapes: ["circle"],
    scalar: 0.5
  });
}
