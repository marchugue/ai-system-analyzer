import { useCallback, useState } from 'react';
import type { ToastMessage, ToastVariant } from '@/types';

let idCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'info', durationMs = 4000) => {
      const id = `toast-${++idCounter}`;
      setToasts((prev) => [...prev, { id, message, variant }]);
      if (durationMs > 0) {
        window.setTimeout(() => dismiss(id), durationMs);
      }
      return id;
    },
    [dismiss]
  );

  return { toasts, showToast, dismiss };
}
