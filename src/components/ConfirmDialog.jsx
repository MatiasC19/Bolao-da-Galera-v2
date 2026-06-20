import { createContext, useCallback, useContext, useState } from 'react';
import Modal from './Modal';

const ConfirmCtx = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null); // { message, resolve }

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setState({ message, resolve });
    });
  }, []);

  const handle = (result) => {
    state?.resolve(result);
    setState(null);
  };

  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      <Modal open={!!state} onClose={() => handle(false)} maxWidth="max-w-[360px]">
        <div className="p-6 pt-8 text-center">
          <div className="w-12 h-12 rounded-full bg-brred/10 flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-ink leading-relaxed mb-6">{state?.message}</p>
          <div className="flex gap-2.5">
            <button
              onClick={() => handle(false)}
              className="flex-1 py-3 rounded-xl border-[1.5px] border-brblue/15 text-muted font-bold text-sm hover:bg-brblue/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => handle(true)}
              className="flex-1 py-3 rounded-xl text-white font-bold text-sm bg-gradient-to-br from-brred to-[#f02020] hover:brightness-110 transition-all"
            >
              Confirmar
            </button>
          </div>
        </div>
      </Modal>
    </ConfirmCtx.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmCtx);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
}
