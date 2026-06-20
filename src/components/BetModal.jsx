import { useEffect, useState } from 'react';
import Modal, { ModalCloseButton } from './Modal';
import Flag from './Flag';
import { team } from '../data/teams';
import { betsOf } from '../lib/betLogic';
import { useApp } from '../state/AppContext';

const MAX_BET_QTY = 10;

export default function BetModal({ match, bets, onClose, onSubmit }) {
  const { lastName } = useApp();
  const [name, setName] = useState('');
  const [qty, setQty] = useState(1);
  const [scores, setScores] = useState([{ h: '', a: '' }]);

  useEffect(() => {
    if (!match) return;
    setName(lastName || '');
    const existing = lastName ? betsOf(bets, match.id, lastName) : [];
    const initialQty = existing.length > 0 ? existing.length : 1;
    setQty(initialQty);
    setScores(
      Array.from({ length: initialQty }, (_, i) => {
        const [h, a] = (existing[i] || '').split(':');
        return { h: h || '', a: a || '' };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match]);

  if (!match) return null;
  const home = team(match.home);
  const away = team(match.away);

  const changeQty = (delta) => {
    const newQty = qty + delta;
    if (newQty < 1 || newQty > MAX_BET_QTY) return;
    setQty(newQty);
    setScores((prev) => {
      const next = [...prev];
      while (next.length < newQty) next.push({ h: '', a: '' });
      return next.slice(0, newQty);
    });
  };

  const updateScore = (i, field, val) => {
    setScores((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)));
  };

  const submit = () => {
    if (!name.trim()) return;
    for (let i = 0; i < qty; i++) {
      const { h, a } = scores[i];
      if (h === '' || a === '' || isNaN(+h) || isNaN(+a)) return;
    }
    onSubmit(name.trim(), scores.slice(0, qty).map((s) => `${s.h}:${s.a}`));
  };

  return (
    <Modal open={!!match} onClose={onClose}>
      <div className="relative p-5 sm:p-6 overflow-hidden shrink-0" style={{ background: 'linear-gradient(110deg,#002776 0%,#009C3B 60%,#FFDF00 100%)' }}>
        <ModalCloseButton onClick={onClose} />
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <div className="flex flex-col items-center gap-1">
            <Flag code={match.home} className="w-11 h-8 sm:w-[50px] sm:h-[34px]" rounded="rounded-lg" />
            <div className="text-[11px] sm:text-xs font-bold text-white truncate-1 max-w-[90px] text-center">{home.n}</div>
          </div>
          <div className="font-display text-base sm:text-lg text-white/70 tracking-widest">VS</div>
          <div className="flex flex-col items-center gap-1">
            <Flag code={match.away} className="w-11 h-8 sm:w-[50px] sm:h-[34px]" rounded="rounded-lg" />
            <div className="text-[11px] sm:text-xs font-bold text-white truncate-1 max-w-[90px] text-center">{away.n}</div>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 overflow-y-auto flex-1">
        <p className="text-[11px] font-bold text-muted uppercase tracking-wider text-center mb-2.5">Seu nome</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite seu nome"
          maxLength={30}
          autoFocus
          className="w-full h-12 border-[1.5px] border-brblue/[0.18] rounded-2xl bg-white/80 px-4 text-sm outline-none focus:border-brblue focus:bg-white focus:ring-4 focus:ring-brblue/[0.08] mb-5 transition-all"
        />

        <p className="text-[11px] font-bold text-muted uppercase tracking-wider text-center mb-2.5">Quantos palpites você quer registrar?</p>
        <div className="flex items-center justify-center gap-5 mb-5">
          <button
            onClick={() => changeQty(-1)}
            className="w-10 h-10 rounded-full border-[1.5px] border-brblue/20 bg-brblue/[0.04] text-brblue flex items-center justify-center hover:bg-brblue/10 active:scale-95 transition-all shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
          <div className="font-display text-3xl text-ink min-w-[40px] text-center">{qty}</div>
          <button
            onClick={() => changeQty(1)}
            className="w-10 h-10 rounded-full border-[1.5px] border-brblue/20 bg-brblue/[0.04] text-brblue flex items-center justify-center hover:bg-brblue/10 active:scale-95 transition-all shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
        </div>

        <p className="text-[11px] font-bold text-muted uppercase tracking-wider text-center mb-2.5">Qual vai ser o placar?</p>
        <div className="flex flex-col gap-2.5 mb-5">
          {Array.from({ length: qty }).map((_, i) => (
            <div key={i} className="flex items-center gap-2.5 bg-brblue/[0.03] border border-brblue/10 rounded-2xl px-3 py-2.5">
              {qty > 1 && (
                <span className="font-display text-[13px] text-brblue bg-brblue/[0.08] w-6 h-6 rounded-full flex items-center justify-center shrink-0">{i + 1}</span>
              )}
              <input
                type="number" inputMode="numeric" min="0" max="20" placeholder="0"
                value={scores[i]?.h ?? ''}
                onChange={(e) => updateScore(i, 'h', e.target.value)}
                className="flex-1 min-w-0 h-12 sm:h-14 border-2 border-brblue/[0.18] rounded-2xl bg-brblue/[0.04] font-display text-2xl sm:text-3xl text-center text-brblue outline-none focus:border-brblue focus:bg-white focus:ring-4 focus:ring-brblue/10 focus:scale-105 transition-all"
              />
              <span className="font-display text-xl text-slate-300 shrink-0">×</span>
              <input
                type="number" inputMode="numeric" min="0" max="20" placeholder="0"
                value={scores[i]?.a ?? ''}
                onChange={(e) => updateScore(i, 'a', e.target.value)}
                className="flex-1 min-w-0 h-12 sm:h-14 border-2 border-brblue/[0.18] rounded-2xl bg-brblue/[0.04] font-display text-2xl sm:text-3xl text-center text-brblue outline-none focus:border-brblue focus:bg-white focus:ring-4 focus:ring-brblue/10 focus:scale-105 transition-all"
              />
            </div>
          ))}
        </div>

        <button
          onClick={submit}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-extrabold text-[#002776] text-sm shadow-lg
            bg-gradient-to-r from-brgreen to-[#FFDF00] hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]"><polyline points="20 6 9 17 4 12" /></svg>
          Confirmar Palpite{qty > 1 ? ` (${qty})` : ''}
        </button>
      </div>
    </Modal>
  );
}
