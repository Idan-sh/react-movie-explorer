/**
 * MovieInfo Component
 *
 * Displays movie title and release year.
 */

export interface MovieInfoProps {
  title: string;
  releaseYear: string;
}

export function MovieInfo({ title, releaseYear }: MovieInfoProps): React.JSX.Element {
  return (
    <div className="flex flex-1 flex-col gap-1 px-3 pt-7 pb-3">
      <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
      <span className="text-xs text-gray-500 dark:text-gray-400">{releaseYear}</span>
    </div>
  );
}
