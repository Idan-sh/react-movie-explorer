/**
 * MovieTrailer Component
 *
 * YouTube facade pattern: renders a thumbnail with a play button overlay.
 * On click, swaps in an iframe with autoplay for inline playback.
 * Avoids loading YouTube's heavy JS until the user opts in.
 */

import { PlayIcon } from '@heroicons/react/24/solid';
import type { TmdbVideo } from '../../types';
import { getYoutubeThumbnailUrl } from '../../utils';
import { useMovieTrailer } from './useMovieTrailer';

interface MovieTrailerProps {
  videos: TmdbVideo[];
}

function TrailerThumbnail({
  trailer,
  onPlay,
}: {
  trailer: TmdbVideo;
  onPlay: () => void;
}): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onPlay}
      className="group relative aspect-video w-full overflow-hidden rounded-lg"
      aria-label={`Play trailer: ${trailer.name}`}
    >
      <img
        src={getYoutubeThumbnailUrl(trailer.key)}
        alt={trailer.name}
        className="h-full w-full object-cover transition-transform duration-150 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
          <PlayIcon className="h-7 w-7 translate-x-0.5 text-gray-900" />
        </div>
      </div>
    </button>
  );
}

function TrailerEmbed({ videoKey }: { videoKey: string }): React.JSX.Element {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg">
      <iframe
        src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
        title="Movie trailer"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}

export function MovieTrailer({
  videos,
}: MovieTrailerProps): React.JSX.Element | null {
  const { trailer, isPlaying, handlePlay } = useMovieTrailer(videos);
  if (!trailer) return null;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Trailer
      </h2>
      {isPlaying ? (
        <TrailerEmbed videoKey={trailer.key} />
      ) : (
        <TrailerThumbnail trailer={trailer} onPlay={handlePlay} />
      )}
    </div>
  );
}
