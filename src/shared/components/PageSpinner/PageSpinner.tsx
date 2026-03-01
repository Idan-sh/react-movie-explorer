/**
 * PageSpinner Component
 *
 * Centered loading spinner for Suspense fallbacks.
 * Hidden for the first 200ms to avoid flashing on fast loads.
 */

const delayedFadeIn = {
  opacity: 0,
  animation: 'fadeIn 0s 1000ms forwards',
} as const;
const spin = { animation: 'spin 0.75s linear infinite' } as const;

export function PageSpinner(): React.JSX.Element {
  return (
    <div
      className="flex flex-1 items-center justify-center py-32"
      style={delayedFadeIn}
    >
      <div
        className="h-8 w-8 rounded-full border-4 border-gray-300 border-t-primary"
        style={spin}
      />
    </div>
  );
}
