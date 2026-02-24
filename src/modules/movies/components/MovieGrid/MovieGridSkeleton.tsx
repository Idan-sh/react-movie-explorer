/**
 * MovieGridSkeleton Component
 *
 * Displays loading skeleton cards while movies are being fetched.
 */

const SKELETON_COUNT = 8;

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

export function MovieGridSkeleton(): React.JSX.Element {
  return (
    <>
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </>
  );
}
