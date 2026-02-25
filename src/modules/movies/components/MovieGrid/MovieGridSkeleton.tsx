/**
 * MovieGridSkeleton Component
 *
 * Displays loading skeleton cards while movies are being fetched.
 */

const DEFAULT_SKELETON_COUNT = 8;

export interface MovieGridSkeletonProps {
  count?: number;
}

function SkeletonCard(): React.JSX.Element {
  return (
    <div className="flex flex-col overflow-hidden rounded-md bg-white dark:bg-gray-800 shadow-md animate-pulse">
      {/* Poster skeleton */}
      <div className="aspect-[2/3] w-full bg-gray-300 dark:bg-gray-700" />

      {/* Info skeleton */}
      <div className="flex flex-col gap-2 p-3">
        <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-700" />
        <div className="h-3 w-1/4 rounded bg-gray-300 dark:bg-gray-700" />
      </div>
    </div>
  );
}

export function MovieGridSkeleton({ count = DEFAULT_SKELETON_COUNT }: MovieGridSkeletonProps): React.JSX.Element {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </>
  );
}
