import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '../state/AppContext';

const ICONS = {
  ok: <polyline points="20 6 9 17 4 12" />,
  err: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
  inf: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </>
  ),
};

const COLORS = { ok: 'text-brgreen', err: 'text-brred', inf: 'text-brblue' };

export default function Toast() {
  const { toast } = useApp();
  const [visible, setVisible] = useState(null);

  useEffect(() => {
    if (!toast) return;
    setVisible(toast);
    const t = setTimeout(() => setVisible(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div
      className="fixed z-[999] left-1/2 -translate-x-1/2 bottom-4 sm:left-auto sm:translate-x-0 sm:right-5 sm:bottom-5 px-2 w-full sm:w-auto flex justify-center sm:justify-end pointer-events-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            key={visible.key}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="glass rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2 max-w-[90vw] sm:max-w-xs pointer-events-auto"
          >
            <svg
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              className={`w-4 h-4 shrink-0 ${COLORS[visible.type] || COLORS.ok}`}
            >
              {ICONS[visible.type] || ICONS.ok}
            </svg>
            <span className="text-sm font-semibold text-ink">{visible.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
