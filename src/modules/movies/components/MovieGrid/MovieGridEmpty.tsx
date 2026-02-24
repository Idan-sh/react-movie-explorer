/**
 * MovieGridEmpty Component
 *
 * Displays message when no movies are available.
 */

export function MovieGridEmpty(): React.JSX.Element {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
      <span className="text-4xl mb-4">🎬</span>
      <p className="text-lg font-medium">No movies found</p>
      <p className="text-sm">Try changing the category or search term</p>
    </div>
  );
}
