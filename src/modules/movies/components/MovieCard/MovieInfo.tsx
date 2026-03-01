/**
 * MovieInfo Component
 *
 * Displays movie title and formatted release date.
 */

export interface MovieInfoProps {
  title: string;
  releaseDate: string;
}

export function MovieInfo({
  title,
  releaseDate,
}: MovieInfoProps): React.JSX.Element {
  return (
    <div className="flex flex-1 flex-col gap-1 px-3 pt-6 pb-3">
      <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {releaseDate}
      </span>
    </div>
  );
}
