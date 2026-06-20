import { useState } from 'react';
import Modal, { ModalCloseButton } from './Modal';
import { useApp } from '../state/AppContext';

const initialForm = { nome: '', valor: '10', adminSenha: '', privado: false, senha: '' };

export default function CreateBolaoModal({ open, onClose, onCreate }) {
  const { showToast } = useApp();
  const [form, setForm] = useState(initialForm);

  const reset = () => setForm(initialForm);
  const handleClose = () => { reset(); onClose(); };

  const submit = () => {
    const nome = form.nome.trim();
    const adminSenha = form.adminSenha.trim();
    const senha = form.senha.trim();
    if (!nome) return showToast('Digite um nome para o bolão', 'err');
    if (!adminSenha) return showToast('Defina a senha de admin deste bolão', 'err');
    if (form.privado && !senha) return showToast('Defina uma senha para o bolão privado', 'err');

    onCreate({
      nome,
      valor: parseFloat(form.valor) || 10,
      publico: !form.privado,
      senha: form.privado ? senha : '',
      adminSenha,
    });
    reset();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="relative shrink-0 px-5 sm:px-6 pt-5 pb-5" style={{ background: 'linear-gradient(110deg,#002776 0%,#009C3B 60%,#FFDF00 100%)' }}>
        <ModalCloseButton onClick={handleClose} />
        <div className="text-center relative z-10">
          <div className="w-[42px] h-[42px] rounded-xl bg-white/[0.18] flex items-center justify-center mx-auto mb-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </div>
          <div className="font-display text-xl text-white tracking-wide">Criar Novo Bolão</div>
        </div>
      </div>

      <div className="p-5 sm:p-6 overflow-y-auto flex-1">
        <Field label="Nome do bolão">
          <input
            type="text" value={form.nome} maxLength={40}
            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
            placeholder="Ex: Bolão da Galera do Trabalho"
            className={inputClass}
          />
        </Field>

        <Field label="Valor de cada palpite (R$)">
          <input
            type="number" inputMode="decimal" value={form.valor} min="1" step="1"
            onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
            placeholder="10"
            className={inputClass}
          />
        </Field>

        <Field
          label={
            <span className="flex items-center gap-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[11px] h-[11px]"><circle cx="12" cy="12" r="3" /></svg>
              Senha de Admin <span className="text-brred">*</span>
            </span>
          }
          hint="Guarde bem — é o que permite cadastrar jogos e inserir o placar final deste bolão."
        >
          <input
            type="text" value={form.adminSenha} maxLength={20}
            onChange={(e) => setForm((f) => ({ ...f, adminSenha: e.target.value }))}
            placeholder="Só você vai usar essa senha para editar"
            className={inputClass}
          />
        </Field>

        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-brblue/[0.04] border border-brblue/10 rounded-2xl mb-3.5">
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-brblue shrink-0">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            Bolão privado (com senha)
          </div>
          <button
            onClick={() => setForm((f) => ({ ...f, privado: !f.privado }))}
            className={`relative w-[42px] h-6 rounded-full transition-colors shrink-0 ${form.privado ? 'bg-brgreen' : 'bg-slate-300'}`}
          >
            <span className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-transform ${form.privado ? 'translate-x-[18px]' : ''}`} />
          </button>
        </div>

        {form.privado && (
          <Field label="Senha de acesso para participantes">
            <input
              type="text" value={form.senha} maxLength={20}
              onChange={(e) => setForm((f) => ({ ...f, senha: e.target.value }))}
              placeholder="Combine com a turma"
              className={inputClass}
            />
          </Field>
        )}

        <button
          onClick={submit}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-extrabold text-[#002776] text-sm shadow-lg
            bg-gradient-to-r from-brgreen to-[#FFDF00] hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]"><polyline points="20 6 9 17 4 12" /></svg>
          Criar Bolão
        </button>
      </div>
    </Modal>
  );
}

const inputClass = 'w-full h-12 border-[1.5px] border-brblue/[0.13] rounded-xl bg-white/70 px-3.5 text-sm outline-none focus:border-brblue focus:bg-white focus:ring-[3px] focus:ring-brblue/[0.07] transition-all';

function Field({ label, hint, children }) {
  return (
    <div className="mb-3.5">
      <label className="block text-[10px] font-bold text-muted uppercase tracking-wide mb-1.5">{label}</label>
      {children}
      {hint && <div className="text-[10.5px] text-muted mt-1">{hint}</div>}
    </div>
  );
}
