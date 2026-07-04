import { useCallback, useEffect, useState } from 'react';

/**
 * Persists state to localStorage under `key`, restoring it on mount.
 * Falls back silently (no throw) if localStorage is unavailable (e.g. private mode).
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage unavailable or quota exceeded — fail silently, form still works in-memory
    }
  }, [key, value]);

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
    setValue(initialValue);
  }, [key, initialValue]);

  return [value, setValue, clear] as const;
}
