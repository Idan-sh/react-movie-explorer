/**
 * MovieTrailer Component
 *
 * YouTube facade pattern: renders a thumbnail with a play button overlay.
 * On click, swaps in an iframe with autoplay for inline playback.
 * State (isPlaying, onPlay) is owned by the parent for keyboard nav integration.
 */

import { PlayIcon } from '@heroicons/react/24/solid';
import type { TmdbVideo } from '../../types';
import { getYoutubeThumbnailUrl } from '../../utils';

interface MovieTrailerProps {
  trailer: TmdbVideo;
  isPlaying: boolean;
  onPlay: () => void;
  navId?: string;
  isFocused?: boolean;
}

function TrailerThumbnail({
  trailer,
  onPlay,
  navId,
  isFocused = false,
}: {
  trailer: TmdbVideo;
  onPlay: () => void;
  navId?: string;
  isFocused?: boolean;
}): React.JSX.Element {
  return (
    <button
      type="button"
      tabIndex={-1}
      data-nav-id={navId}
      onClick={onPlay}
      className={`
        group relative aspect-video w-full overflow-hidden rounded-lg outline-none
        ${isFocused ? 'ring-2 ring-primary' : ''}
      `}
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
  trailer,
  isPlaying,
  onPlay,
  navId,
  isFocused,
}: MovieTrailerProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Trailer
      </h2>
      {isPlaying ? (
        <TrailerEmbed videoKey={trailer.key} />
      ) : (
        <TrailerThumbnail
          trailer={trailer}
          onPlay={onPlay}
          navId={navId}
          isFocused={isFocused}
        />
      )}
    </div>
  );
}
