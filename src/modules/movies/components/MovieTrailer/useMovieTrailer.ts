import { useState, useCallback } from 'react';
import type { TmdbVideo } from '../../types';
import { getTrailer } from '../../utils';

export interface UseTrailerReturn {
  trailer: TmdbVideo | null;
  isPlaying: boolean;
  handlePlay: () => void;
}

export function useMovieTrailer(videos: TmdbVideo[]): UseTrailerReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const trailer = getTrailer(videos);

  const handlePlay = useCallback((): void => {
    setIsPlaying(true);
  }, []);

  return { trailer, isPlaying, handlePlay };
}
