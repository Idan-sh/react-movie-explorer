/**
 * ScrollHint Component
 *
 * Non-intrusive toast that appears when the user attempts to scroll
 * with the mouse while mouse scroll is disabled.
 * Fades in and slides down from above, then auto-dismisses.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { Z_LAYER } from '@/shared/constants';

const HIDDEN = { opacity: 0, y: -16 };
const VISIBLE = { opacity: 1, y: 0 };
const TRANSITION = { duration: 0.35, ease: 'easeOut' } as const;

const KBD_STYLE =
  'mx-0.5 inline-block rounded bg-gray-200/80 px-1.5 py-0.5 font-mono text-xs dark:bg-gray-600/80';

interface ScrollHintProps {
  isVisible: boolean;
}

export function ScrollHint({
  isVisible,
}: ScrollHintProps): React.JSX.Element {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="scroll-hint"
          role="status"
          initial={HIDDEN}
          animate={VISIBLE}
          exit={HIDDEN}
          transition={TRANSITION}
          style={{ zIndex: Z_LAYER.SCROLL_HINT }}
          className="
            pointer-events-none fixed left-1/2 top-28 -translate-x-1/2
            w-[calc(100vw-2rem)] max-w-lg rounded-xl border
            border-gray-200/60 px-4 py-3
            text-center text-xs text-gray-600 shadow-lg
            sm:px-5 sm:text-sm
            backdrop-blur-md
            bg-white/90 dark:border-gray-600/60 dark:bg-gray-800/90
            dark:text-gray-300
          "
        >
          <p>
            Use <kbd className={KBD_STYLE}>↑</kbd>
            <kbd className={KBD_STYLE}>↓</kbd>
            <kbd className={KBD_STYLE}>←</kbd>
            <kbd className={KBD_STYLE}>→</kbd> to navigate,{' '}
            <kbd className={KBD_STYLE}>Enter</kbd> to select,{' '}
            <kbd className={KBD_STYLE}>Esc</kbd> to go back
          </p>
          <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
            Or enable mouse scroll in Settings
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
