/**
 * ScrollToTopButton Component
 *
 * Floating pill button that smoothly scrolls the page back to the top.
 * Positioned at the top center, slides down into view with framer-motion.
 * Uses glassmorphism styling to float above content.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { Z_LAYER } from '@/shared/constants';

const VISIBLE = { opacity: 1, y: 0 };
const HIDDEN = { opacity: 0, y: -8 };
const TRANSITION = { duration: 0.25, ease: 'easeOut' } as const;

export interface ScrollToTopButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

export function ScrollToTopButton({
  isVisible,
  onClick,
}: ScrollToTopButtonProps): React.JSX.Element {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          key="scroll-to-top"
          type="button"
          tabIndex={-1}
          onClick={onClick}
          aria-label="Scroll to top"
          initial={HIDDEN}
          animate={VISIBLE}
          exit={HIDDEN}
          transition={TRANSITION}
          style={{ zIndex: Z_LAYER.SCROLL_TO_TOP }}
          className="
            fixed top-28 md:top-22 left-1/2 -translate-x-1/2
            flex items-center gap-2 rounded-full
            border border-gray-300/60 dark:border-gray-600/60
            bg-white/80 dark:bg-gray-800/80 backdrop-blur-md
            px-5 py-2 text-sm font-medium
            text-gray-600 dark:text-gray-300
            shadow-lg
            transition-colors duration-200
            hover:bg-primary hover:border-primary hover:text-white
            dark:hover:bg-primary dark:hover:border-primary dark:hover:text-white
          "
        >
          <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
          Back to top
        </motion.button>
      )}
    </AnimatePresence>
  );
}
