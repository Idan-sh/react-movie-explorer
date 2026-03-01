/**
 * SettingsButton Component
 *
 * Gear icon that opens a dropdown popover with app settings.
 * Purely presentational — all state managed by useDropdown hook.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Z_LAYER } from '@/shared/constants';
import { ToggleSwitch } from './ToggleSwitch';
import { useDropdown } from '@/shared/hooks';
import {
  DROPDOWN_CLOSED,
  DROPDOWN_OPEN,
  DROPDOWN_TRANSITION,
} from './settingsDropdown.constants';

interface SettingsButtonProps {
  isScrollEnabled: boolean;
  onToggleScroll: () => void;
  navId?: string;
  isFocused?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export function SettingsButton({
  isScrollEnabled,
  onToggleScroll,
  navId,
  isFocused = false,
  onOpenChange,
}: SettingsButtonProps): React.JSX.Element {
  const { isOpen, containerRef, handleToggle, focusedIndex } = useDropdown({
    itemCount: 1,
    onItemActivate: onToggleScroll,
    onOpenChange,
  });

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        tabIndex={-1}
        data-nav-id={navId}
        onClick={handleToggle}
        aria-label="Settings"
        aria-expanded={isOpen}
        className={`
          flex h-9 w-9 items-center justify-center rounded-lg outline-none
          text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
          hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors
          ${isFocused ? 'ring-2 ring-primary' : ''}
        `}
      >
        <Cog6ToothIcon className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={DROPDOWN_CLOSED}
            animate={DROPDOWN_OPEN}
            exit={DROPDOWN_CLOSED}
            transition={DROPDOWN_TRANSITION}
            style={{ zIndex: Z_LAYER.DROPDOWN }}
            className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-lg"
          >
            <ToggleSwitch
              enabled={isScrollEnabled}
              onToggle={onToggleScroll}
              label="Mouse Scroll"
              isFocused={focusedIndex === 0}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
