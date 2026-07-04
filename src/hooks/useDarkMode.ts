import { useEffect, useState } from 'react';

const STORAGE_KEY = 'ai-system-analyzer:theme';

function getInitialTheme(): boolean {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return stored === 'dark';
  } catch {
    // ignore
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((d) => !d) };
}
