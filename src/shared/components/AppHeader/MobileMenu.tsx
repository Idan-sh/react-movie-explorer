/**
 * MobileMenu Component
 *
 * Animated dropdown menu for mobile navigation.
 * Renders category tabs in a vertical list with slide-down/up animation.
 * Positioned absolutely to overlay content without layout shift.
 * Hidden on desktop (md+).
 */

import { AnimatePresence, motion } from "framer-motion";
import type { AppView } from "@/shared/types";
import { APP_VIEW_TABS, APP_VIEW_LABELS } from "@/shared/constants";
import { buildNavId, NAV_ID_PREFIX } from "@/modules/navigation";
import { MENU_CLOSED, MENU_OPEN, MENU_TRANSITION } from "./mobileMenu.constants";

export interface MobileMenuProps {
  isOpen: boolean;
  activeView: AppView;
  focusedMenuIndex: number;
  onTabClick: (view: AppView) => void;
}

export function MobileMenu({ isOpen, activeView, focusedMenuIndex, onTabClick }: MobileMenuProps): React.JSX.Element {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.nav
          key="mobile-menu"
          aria-label="Category tabs"
          initial={MENU_CLOSED}
          animate={MENU_OPEN}
          exit={MENU_CLOSED}
          transition={MENU_TRANSITION}
          className="
            absolute left-0 right-0 z-20 md:hidden overflow-hidden
            border-t border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-800 shadow-lg
          "
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-2">
            {APP_VIEW_TABS.map((view, index) => (
              <button
                key={view}
                type="button"
                tabIndex={-1}
                data-nav-id={buildNavId(NAV_ID_PREFIX.TAB, index)}
                onClick={() => onTabClick(view)}
                className={`
                    w-full text-left rounded-md px-4 py-3
                    text-sm font-medium cursor-pointer
                    transition-colors duration-150 ease-in-out
                    outline-none
                    ${index === focusedMenuIndex ? "ring-2 ring-primary" : ""}
                    ${
                      activeView === view
                        ? "bg-primary text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }
                  `}
              >
                {APP_VIEW_LABELS[view]}
              </button>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
