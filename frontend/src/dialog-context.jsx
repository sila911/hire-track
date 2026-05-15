import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const DialogContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components -- context hook paired with DialogProvider
export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return ctx;
}

function dialogCardClasses() {
  return 'relative w-full max-w-md rounded-[2rem] border border-white/20 bg-slate-900/95 p-8 shadow-2xl backdrop-blur-xl';
}

function SystemDialogLayer({
  confirmOpen,
  confirmPayload,
  onConfirmResult,
  alertOpen,
  alertPayload,
  onAlertClose,
}) {
  useEffect(() => {
    if (!confirmOpen && !alertOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (confirmOpen) onConfirmResult(false);
        else onAlertClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [confirmOpen, alertOpen, onConfirmResult, onAlertClose]);

  return (
    <AnimatePresence>
      {(confirmOpen || alertOpen) && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close overlay"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (confirmOpen) onConfirmResult(false);
              else onAlertClose();
            }}
          />
          {confirmOpen && confirmPayload && (
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="system-confirm-title"
              aria-describedby="system-confirm-desc"
              className={`${dialogCardClasses()} relative z-10`}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
              <h2
                id="system-confirm-title"
                className="text-xl font-black tracking-tight text-white"
              >
                {confirmPayload.title}
              </h2>
              <div
                id="system-confirm-desc"
                className="mt-3 text-sm font-medium leading-relaxed text-white/70"
              >
                {confirmPayload.message}
              </div>
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => onConfirmResult(false)}
                  className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white/90 transition hover:bg-white/10"
                >
                  {confirmPayload.cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={() => onConfirmResult(true)}
                  className={
                    confirmPayload.variant === 'danger'
                      ? 'rounded-xl border border-red-400/30 bg-red-500/20 px-5 py-3 text-sm font-bold text-red-100 transition hover:bg-red-500/30'
                      : 'rounded-xl border border-white/25 bg-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/30'
                  }
                >
                  {confirmPayload.confirmLabel}
                </button>
              </div>
            </motion.div>
          )}
          {alertOpen && alertPayload && (
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="system-alert-title"
              aria-describedby="system-alert-desc"
              className={`${dialogCardClasses()} relative z-10`}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
              <h2 id="system-alert-title" className="text-xl font-black tracking-tight text-white">
                {alertPayload.title}
              </h2>
              <div
                id="system-alert-desc"
                className="mt-3 text-sm font-medium leading-relaxed text-white/70"
              >
                {alertPayload.message}
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={onAlertClose}
                  className="rounded-xl border border-white/25 bg-white/20 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/30"
                >
                  OK
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}

export function DialogProvider({ children }) {
  const [confirmPayload, setConfirmPayload] = useState(null);
  const [alertPayload, setAlertPayload] = useState(null);
  const confirmResolveRef = useRef(null);
  const alertResolveRef = useRef(null);

  const confirm = useCallback((options) => {
    const {
      title = 'Confirm',
      message,
      confirmLabel = 'OK',
      cancelLabel = 'Cancel',
      variant = 'default',
    } = options;
    return new Promise((resolve) => {
      confirmResolveRef.current = resolve;
      setConfirmPayload({ title, message: message ?? '', confirmLabel, cancelLabel, variant });
    });
  }, []);

  const alert = useCallback((message, title = 'Notice') => {
    return new Promise((resolve) => {
      alertResolveRef.current = resolve;
      setAlertPayload({ title, message });
    });
  }, []);

  const finishConfirm = useCallback((value) => {
    const r = confirmResolveRef.current;
    confirmResolveRef.current = null;
    setConfirmPayload(null);
    r?.(value);
  }, []);

  const finishAlert = useCallback(() => {
    const r = alertResolveRef.current;
    alertResolveRef.current = null;
    setAlertPayload(null);
    r?.();
  }, []);

  const value = useMemo(() => ({ confirm, alert }), [confirm, alert]);

  return (
    <DialogContext.Provider value={value}>
      {children}
      <SystemDialogLayer
        confirmOpen={Boolean(confirmPayload)}
        confirmPayload={confirmPayload}
        onConfirmResult={finishConfirm}
        alertOpen={Boolean(alertPayload)}
        alertPayload={alertPayload}
        onAlertClose={finishAlert}
      />
    </DialogContext.Provider>
  );
}
