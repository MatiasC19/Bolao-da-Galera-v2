import { useMemo } from 'react';
import { Divider, EmptyState } from '../components/Layout';
import { ResultMatchCard, ListMatchCard } from '../components/MatchCard';
import { totalBetsAllMatches, valorPalpite } from '../lib/betLogic';
import { useApp } from '../state/AppContext';

export default function DetalhePage({ onBack, onOpenBet }) {
  const { currentBolao } = useApp();

  const bolao = currentBolao || { nome: '', valor: 10, players: [], matches: [], bets: {} };
  const players = bolao.players || [];
  const matches = bolao.matches || [];
  const bets = bolao.bets || {};
  const valor = valorPalpite(bolao);

  const totalBets = useMemo(() => totalBetsAllMatches(bets, players, matches), [bets, players, matches]);
  const prize = totalBets * valor;
  const doneMatches = useMemo(() => matches.filter((m) => m.res).slice(-5).reverse(), [matches]);

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="glass rounded-[20px] shadow-md p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <div className="font-display text-xl sm:text-2xl tracking-wide truncate-1">{bolao.nome || '—'}</div>
            <div className="text-[11px] text-muted flex items-center gap-1.5 mt-0.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[11px] h-[11px] shrink-0">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              R$ {(bolao.valor || 10).toLocaleString('pt-BR')} por palpite
            </div>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-[1.5px] border-brblue/15 text-brblue text-[11px] font-bold hover:bg-brblue/5 transition-colors shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[13px] h-[13px]">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Voltar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <StatCard color="text-brblue" n={players.length} label="Participantes" icon={<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>} />
        <StatCard color="text-brgreen" n={totalBets} label="Palpites" icon={<path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />} />
        <StatCard color="text-[#b8922a]" n={`R$ ${prize.toLocaleString('pt-BR')}`} label="Prêmio Total" icon={<><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></>} />
      </div>

      <div className="glass rounded-[20px] shadow-md overflow-hidden">
        <div className="px-4 sm:px-5 pt-4 pb-3.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-brgreen to-[#14a862] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
          </div>
          <div className="min-w-0">
            <div className="font-display text-base sm:text-lg tracking-wide">Resultados</div>
            <div className="text-[11px] text-muted">Jogos encerrados</div>
          </div>
        </div>
        <Divider />
        <div className="px-4 sm:px-5 py-4 flex flex-col gap-3">
          {doneMatches.length === 0 ? (
            <EmptyState icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /><path d="M2 12h20" /></svg>}>
              Nenhum resultado ainda
            </EmptyState>
          ) : (
            doneMatches.map((m) => <ResultMatchCard key={m.id} match={m} />)
          )}
        </div>
      </div>

      <div className="glass rounded-[20px] shadow-md overflow-hidden">
        <div className="px-4 sm:px-5 pt-4 pb-3.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-brblue to-[#1a56d6] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
          </div>
          <div className="min-w-0">
            <div className="font-display text-base sm:text-lg tracking-wide">Cadastrar seus Palpites</div>
            <div className="text-[11px] text-muted truncate-1">Registre o placar que você acha que vai acontecer</div>
          </div>
        </div>
        <Divider />
        <div className="px-4 sm:px-5 py-4 flex flex-col gap-3">
          {matches.length === 0 ? (
            <EmptyState icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /></svg>}>
              Nenhum jogo cadastrado ainda. O admin vai criar em breve!
            </EmptyState>
          ) : (
            matches.map((m) => (
              <ListMatchCard key={m.id} match={m} bets={bets} players={players} valor={valor} onOpenBet={onOpenBet} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ color, n, label, icon }) {
  return (
    <div className="glass rounded-2xl shadow-sm p-2.5 sm:p-4 min-w-0">
      <div className={`font-display text-2xl sm:text-3xl leading-none truncate-1 ${color}`}>{n}</div>
      <div className="text-[8.5px] sm:text-[9.5px] font-semibold text-muted uppercase tracking-wide mt-0.5 flex items-center gap-1 truncate-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 shrink-0">{icon}</svg>
        {label}
      </div>
    </div>
  );
}
