/**
 * Session Storage Utilities
 *
 * Safe wrappers around sessionStorage that handle private browsing
 * and quota errors silently. Returns null on failure.
 */

export function getSessionItem(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setSessionItem(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Silent fail — private browsing or storage quota exceeded
  }
}

export function removeSessionItem(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // Silent fail
  }
}
