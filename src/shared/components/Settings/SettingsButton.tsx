/**
 * SettingsButton Component
 *
 * Gear icon that opens a dropdown popover with app settings.
 * Click outside or Escape closes the dropdown.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Z_LAYER } from "@/shared/constants";
import { ToggleSwitch } from "./ToggleSwitch";

interface SettingsButtonProps {
  isScrollEnabled: boolean;
  onToggleScroll: () => void;
}

export function SettingsButton({
  isScrollEnabled,
  onToggleScroll
}: SettingsButtonProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback((): void => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Settings"
        aria-expanded={isOpen}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <Cog6ToothIcon className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ zIndex: Z_LAYER.DROPDOWN }}
            className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-lg"
          >
            <ToggleSwitch
              enabled={isScrollEnabled}
              onToggle={onToggleScroll}
              label="Mouse Scroll"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
