import { useState, useEffect } from 'react';
import Modal, { ModalCloseButton } from './Modal';

export default function EnterBolaoModal({ bolao, onClose, onSubmit }) {
  const [senha, setSenha] = useState('');

  useEffect(() => {
    if (bolao) setSenha('');
  }, [bolao]);

  if (!bolao) return null;

  const submit = () => onSubmit(senha);

  return (
    <Modal open={!!bolao} onClose={onClose} maxWidth="max-w-[380px]">
      <div className="p-6 pt-8 relative">
        <ModalCloseButton onClick={onClose} dark />
        <div className="w-[46px] h-[46px] rounded-full bg-brblue/10 flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="#0033A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
            <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
        <div className="text-center text-sm font-bold mb-1 truncate-1">{bolao.nome || 'Bolão Privado'}</div>
        <div className="text-center text-xs text-muted mb-4">Este bolão é privado. Digite a senha para entrar.</div>
        <input
          type="text"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Senha do bolão"
          autoFocus
          className="w-full h-12 border-[1.5px] border-brblue/[0.13] rounded-xl bg-white/70 px-3.5 text-sm text-center outline-none focus:border-brblue focus:bg-white focus:ring-[3px] focus:ring-brblue/[0.07] mb-4 transition-all"
        />
        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-[1.5px] border-brblue/15 text-muted font-bold text-sm hover:bg-brblue/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={submit}
            className="flex-[1.4] flex items-center justify-center gap-1.5 py-3 rounded-xl font-extrabold text-[#002776] text-sm shadow-md
              bg-gradient-to-r from-brgreen to-[#FFDF00] hover:shadow-lg transition-all active:scale-95"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
            </svg>
            Entrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
