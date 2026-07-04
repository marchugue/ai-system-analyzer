import type { ToastMessage } from '@/types';

const VARIANT_STYLES: Record<ToastMessage['variant'], string> = {
  success: 'border-ledger/30 bg-ledger-soft text-ledger dark:bg-ledger/15 dark:text-ledger-dark',
  error: 'border-alert/30 bg-alert-soft text-alert dark:bg-alert/15 dark:text-alert-dark',
  info: 'border-signal/30 bg-signal-soft text-signal dark:bg-signal/15 dark:text-signal-dark',
};

const VARIANT_ICON: Record<ToastMessage['variant'], string> = {
  success: '✓',
  error: '!',
  info: 'i',
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-2.5"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-fadeUp flex items-start gap-3 rounded-xl border px-4 py-3 shadow-card backdrop-blur-sm ${VARIANT_STYLES[toast.variant]}`}
        >
          <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border border-current text-[11px] font-bold">
            {VARIANT_ICON[toast.variant]}
          </span>
          <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
          <button
            onClick={() => onDismiss(toast.id)}
            className="flex-none text-current opacity-60 transition-opacity hover:opacity-100"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
