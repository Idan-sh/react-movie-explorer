/**
 * Settings Storage Service
 *
 * Handles reading and writing settings to localStorage.
 * Wraps in try/catch to handle private browsing or storage full errors.
 */

import { STORAGE_KEY, MOBILE_QUERY } from '@/shared/constants';

const isMobile = window.matchMedia(MOBILE_QUERY).matches;

/** Defaults to enabled on mobile (touch devices need scroll), disabled on desktop. */
export function loadScrollEnabled(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY.SETTINGS.SCROLL_ENABLED);
    if (stored === null) return isMobile;
    return stored === 'true';
  } catch {
    return isMobile;
  }
}

export function saveScrollEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY.SETTINGS.SCROLL_ENABLED, String(enabled));
  } catch {
    // Silent fail — private browsing or storage quota exceeded
  }
}
