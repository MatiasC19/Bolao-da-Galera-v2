import { useState, useMemo } from 'react';
import BolaoCard from '../components/BolaoCard';
import { Divider, EmptyState } from '../components/Layout';
import { useApp } from '../state/AppContext';

function LockBadge() {
  return (
    <div className="absolute top-3.5 right-3.5 w-[26px] h-[26px] rounded-full bg-brred/10 text-brred border border-brred/20 flex items-center justify-center">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[13px] h-[13px]">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    </div>
  );
}
function PublicBadge() {
  return (
    <div className="absolute top-3.5 right-3.5 flex items-center gap-1 bg-brgreen/10 text-brgreen border border-brgreen/20 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[10px] h-[10px]">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      </svg>
      Público
    </div>
  );
}

export default function BoloesPage({ onSelectBolao, onOpenCreate }) {
  const { allBoloes } = useApp();
  const [filter, setFilter] = useState('');

  const ids = useMemo(() => {
    const all = Object.keys(allBoloes);
    if (!filter.trim()) return all;
    const f = filter.trim().toLowerCase();
    return all.filter((id) => (allBoloes[id].nome || '').toLowerCase().includes(f));
  }, [allBoloes, filter]);

  return (
    <div>
      <div className="relative rounded-[20px] overflow-hidden p-6 sm:p-7 mb-5"
        style={{
          background: `
            linear-gradient(125deg, rgba(0,10,40,.88) 0%, rgba(0,20,60,.65) 45%, rgba(0,40,20,.55) 100%),
            url('https://images.unsplash.com/photo-1511204579483-e5c2b1d69acd?w=1200&q=70&fm=jpg&fit=crop&auto=format') center 38%/cover no-repeat,
            linear-gradient(125deg,#002776 0%,#009C3B 100%)`,
        }}
      >
        <div className="absolute right-4 top-1/2 -translate-y-1/2 font-display text-[clamp(36px,12vw,60px)] text-white/[0.06] leading-none pointer-events-none select-none hidden sm:block">26</div>
        <div className="relative z-10">
          <div className="text-[8px] font-bold tracking-[3px] text-white/70 uppercase mb-1">Copa do Mundo 2026</div>
          <h1 className="font-display text-[clamp(24px,6vw,34px)] tracking-wide text-white leading-tight mb-1.5">
            BOLÃO<br /><span className="text-[#FFDF00]">DA GALERA</span>
          </h1>
          <p className="text-xs sm:text-[13px] font-medium text-white/90">Crie seu bolão, palpite nos jogos e dispute o prêmio com a galera ⚽</p>
        </div>
      </div>

      <div className="glass rounded-[20px] shadow-md overflow-hidden">
        <div className="px-4 sm:px-5 pt-4 pb-3.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-brblue to-[#1a56d6] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]">
              <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="font-display text-base sm:text-lg tracking-wide">Bolões Disponíveis</div>
            <div className="text-[11px] text-muted truncate-1">Escolha um bolão para entrar ou crie o seu</div>
          </div>
        </div>

        <div className="px-4 sm:px-5 pb-4">
          <button
            onClick={onOpenCreate}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-extrabold text-[#002776] text-sm shadow-md
              bg-gradient-to-r from-brgreen to-[#FFDF00] hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Criar novo bolão
          </button>
        </div>

        <div className="px-4 sm:px-5 pb-3.5 relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px] absolute left-[26px] top-1/2 -translate-y-1/2 text-muted pointer-events-none">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Buscar bolão pelo nome..."
            className="w-full h-12 border-[1.5px] border-brblue/[0.13] rounded-xl bg-white/70 pl-10 pr-3.5 text-sm outline-none focus:border-brblue focus:bg-white focus:ring-[3px] focus:ring-brblue/[0.07] transition-all"
          />
        </div>

        <Divider />

        <div className="px-4 sm:px-5 py-4 flex flex-col gap-3.5">
          {ids.length === 0 ? (
            <EmptyState
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
              }
            >
              {filter.trim() ? 'Nenhum bolão encontrado com esse nome.' : 'Nenhum bolão criado ainda. Crie o primeiro!'}
            </EmptyState>
          ) : (
            ids.map((id) => (
              <BolaoCard
                key={id}
                bolao={allBoloes[id]}
                onClick={() => onSelectBolao(id)}
                badge={allBoloes[id].publico === false ? <LockBadge /> : <PublicBadge />}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
