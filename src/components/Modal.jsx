import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';

/**
 * Every modal in the app renders through this component, which is the
 * single place that guarantees three escape routes: the X button,
 * clicking the backdrop, and the Escape key. No modal-specific code
 * needs to re-implement any of this.
 */
export default function Modal({ open, onClose, children, maxWidth = 'max-w-[420px]', headerBg }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-4"
          style={{ background: 'rgba(10,20,50,.45)', backdropFilter: 'blur(6px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className={`w-full ${maxWidth} rounded-[28px] overflow-hidden bg-white/95 shadow-2xl max-h-[92vh] flex flex-col`}
            style={{ backdropFilter: 'blur(24px) saturate(180%)' }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function ModalCloseButton({ onClick, dark }) {
  return (
    <button
      onClick={onClick}
      aria-label="Fechar"
      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10
        ${dark ? 'bg-black/10 hover:bg-black/20 text-ink' : 'bg-white/20 hover:bg-white/30 text-white'}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}
