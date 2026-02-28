/**
 * Settings Storage Service
 *
 * Handles reading and writing settings to localStorage.
 * Wraps in try/catch to handle private browsing or storage full errors.
 */

import { STORAGE_KEY } from "@/shared/constants";

export function loadScrollEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY.SETTINGS.SCROLL_ENABLED) === "true";
  } catch {
    return false;
  }
}

export function saveScrollEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY.SETTINGS.SCROLL_ENABLED, String(enabled));
  } catch {
    // Silent fail — private browsing or storage quota exceeded
  }
}
