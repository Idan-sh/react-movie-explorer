/**
 * ImageWithFallback Component
 *
 * Drop-in replacement for <img> with built-in error handling.
 * Renders the fallback when src is missing or the image fails to load.
 */

import { useImageLoad } from './useImageLoad';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback: React.ReactNode;
}

export function ImageWithFallback({
  fallback,
  src,
  ...imgProps
}: ImageWithFallbackProps): React.JSX.Element {
  const { hasError, handleError } = useImageLoad(src);

  if (!src || hasError) {
    return <>{fallback}</>;
  }

  return <img src={src} onError={handleError} {...imgProps} />;
}
