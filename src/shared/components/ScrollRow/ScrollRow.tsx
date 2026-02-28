/**
 * ScrollRow Component
 *
 * A horizontal scrollable container with a right-edge fade overlay
 * that hints at scrollable content. The fade hides once the user scrolls.
 */

import { useRef, useState, useCallback } from 'react';

interface ScrollRowProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollRow({ children, className = '' }: ScrollRowProps): React.JSX.Element {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);

  const handleScroll = useCallback((): void => {
    if (!scrollRef.current) return;
    setIsAtStart(scrollRef.current.scrollLeft <= 0);
  }, []);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={`flex gap-4 overflow-x-auto pb-2 scrollbar-thin ${className}`}
      >
        {children}
      </div>

      <div
        className={`
          pointer-events-none absolute right-0 top-0 h-full w-16
          bg-gradient-to-l from-white dark:from-gray-900
          transition-opacity duration-500 ease-in-out
          ${isAtStart ? 'opacity-100' : 'opacity-0'}
        `}
        aria-hidden="true"
      />
    </div>
  );
}
