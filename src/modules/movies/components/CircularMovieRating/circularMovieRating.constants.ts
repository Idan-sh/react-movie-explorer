const RADIUS = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const CIRCULAR_RATING = {
  RADIUS,
  CIRCUMFERENCE,
  ANIMATION_DURATION_MS: 800,
  SIZE: {
    sm: {
      container: "h-10 w-10",
      text: "text-[12px]",
      percent: "text-[6px]",
      strokeWidth: 1.5,
    },
    lg: {
      container: "h-14 w-14",
      text: "text-[16px]",
      percent: "text-[7px]",
      strokeWidth: 2,
    },
  },
} as const;
