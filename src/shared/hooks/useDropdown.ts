import { useState, useRef, useEffect, useCallback } from 'react';

export interface UseDropdownOptions {
  /** Number of navigable items inside the dropdown (enables arrow key + Enter nav) */
  itemCount?: number;
  /** Called when Enter is pressed on the focused item */
  onItemActivate?: (index: number) => void;
  /** Called when open state changes */
  onOpenChange?: (isOpen: boolean) => void;
}

export interface UseDropdownReturn {
  isOpen: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  handleToggle: () => void;
  /** Currently highlighted item index (-1 when closed or no items) */
  focusedIndex: number;
}

export function useDropdown(options?: UseDropdownOptions): UseDropdownReturn {
  const { itemCount = 0, onItemActivate, onOpenChange } = options ?? {};
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback((): void => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    onOpenChange?.(isOpen);
    if (isOpen) setFocusedIndex(0);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent): void {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }
      if (itemCount <= 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => Math.min(prev + 1, itemCount - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          onItemActivate?.(focusedIndex);
          break;
        case 'Tab':
          e.preventDefault();
          break;
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, itemCount, focusedIndex, onItemActivate]);

  return {
    isOpen,
    containerRef,
    handleToggle,
    focusedIndex: isOpen && itemCount > 0 ? focusedIndex : -1,
  };
}
