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
import { APP_VIEW_TABS, Z_LAYER } from "@/shared/constants";
import { MENU_CLOSED, MENU_OPEN, MENU_TRANSITION } from "./mobileMenu.constants";
import { MobileMenuItem } from "./MobileMenuItem";

export interface MobileMenuProps {
  isOpen: boolean;
  activeView: AppView;
  focusedMenuIndex: number;
  onTabClick: (view: AppView) => void;
}

export function MobileMenu({
  isOpen,
  activeView,
  focusedMenuIndex,
  onTabClick
}: MobileMenuProps): React.JSX.Element {
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
          style={{ zIndex: Z_LAYER.MOBILE_MENU }}
          className="
            absolute left-0 right-0 md:hidden overflow-hidden
            border-b border-gray-200/60 dark:border-gray-700/60
            bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg
          "
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-2">
            {APP_VIEW_TABS.map((view, index) => (
              <MobileMenuItem
                key={view}
                view={view}
                index={index}
                isActive={activeView === view}
                isFocused={index === focusedMenuIndex}
                onTabClick={onTabClick}
              />
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
