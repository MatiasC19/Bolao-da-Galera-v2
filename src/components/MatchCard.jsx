import Flag from './Flag';
import { team } from '../data/teams';
import { isLocked, getResult, betsOf, isExactWinner, valorPalpite } from '../lib/betLogic';
import { avatarColor, initials } from '../data/teams';

function ClockIcon({ className = 'w-3 h-3' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function LockIcon({ className = 'w-3 h-3' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}
function TrophyIcon({ className = 'w-3 h-3' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 9H4.5a2.5 2.5 0 010-5H6" /><path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
      <path d="M4 22h16" /><path d="M18 2H6v7a6 6 0 0012 0V2z" />
    </svg>
  );
}

function formatDeadline(dl) {
  return new Date(dl).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

/** Shared header: phase chip + deadline/locked pill + the two team rows. */
function MatchHeader({ match, centerSlot }) {
  const home = team(match.home);
  const away = team(match.away);
  const locked = isLocked(match);

  return (
    <>
      <div className="flex items-center justify-between gap-1.5 px-3 sm:px-3.5 pt-2.5 pb-1.5 flex-wrap">
        <span className="text-[9px] font-bold tracking-wider uppercase text-muted bg-muted/10 px-2 py-1 rounded-full border border-muted/15 truncate-1 max-w-[55%]">
          {match.ph}
        </span>
        <span className={`flex items-center gap-1 text-[10px] font-semibold shrink-0 ${locked ? 'text-slate-400' : 'text-brblue'}`}>
          {locked ? <LockIcon /> : <ClockIcon />}
          {locked ? 'Encerrado' : `Prazo: ${formatDeadline(match.dl)}`}
        </span>
      </div>

      <div className="flex items-center justify-between gap-1.5 px-3 sm:px-3.5 pb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Flag code={match.home} className="w-8 h-[22px] sm:w-9 sm:h-6" rounded="rounded-[6px]" />
          <div className="min-w-0">
            <div className="font-bold text-[12px] sm:text-[12.5px] leading-tight truncate-1">{home.n}</div>
            <div className="text-[8px] sm:text-[8.5px] text-muted font-semibold tracking-wider">{home.c}</div>
          </div>
        </div>

        <div className="shrink-0 px-1">{centerSlot}</div>

        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <div className="min-w-0 text-right">
            <div className="font-bold text-[12px] sm:text-[12.5px] leading-tight truncate-1">{away.n}</div>
            <div className="text-[8px] sm:text-[8.5px] text-muted font-semibold tracking-wider">{away.c}</div>
          </div>
          <Flag code={match.away} className="w-8 h-[22px] sm:w-9 sm:h-6" rounded="rounded-[6px]" />
        </div>
      </div>
    </>
  );
}

/** Compact card used in "Resultados" — header + final score only. */
export function ResultMatchCard({ match }) {
  const res = getResult(match);
  const locked = isLocked(match);
  const centerSlot = res ? (
    <div className="bg-white/70 border border-white/85 rounded-xl px-2.5 py-1.5 text-center shadow-sm min-w-[58px] sm:min-w-[64px]">
      <div className="text-[7px] font-bold text-muted uppercase tracking-wider leading-none">Final</div>
      <div className="font-display text-lg sm:text-xl text-ink tracking-wider leading-tight">{res}</div>
    </div>
  ) : (
    <div className="font-display text-sm sm:text-base text-slate-300 tracking-widest">VS</div>
  );

  return (
    <div className={`relative overflow-hidden glass rounded-[20px] shadow-md ${locked ? '' : ''}`}>
      <div className={`h-[3px] ${res ? 'bg-gradient-to-r from-brgreen to-[#14a862]' : locked ? 'bg-gradient-to-r from-slate-400 to-slate-300' : 'bg-gradient-to-r from-brblue to-brred'}`} />
      <MatchHeader match={match} centerSlot={centerSlot} />
    </div>
  );
}

/** Full card used in "Cadastrar seus Palpites" — header + bettors list + CTA. */
export function ListMatchCard({ match, bets, players, valor, onOpenBet }) {
  const locked = isLocked(match);
  const res = getResult(match);
  const bettorNames = players.filter((p) => betsOf(bets, match.id, p).length > 0);
  const rows = bettorNames.flatMap((p) => {
    const list = betsOf(bets, match.id, p);
    return list.map((b, idx) => ({ p, b, idx, total: list.length, status: isExactWinner(b, res) }));
  });
  const totalBetsCount = rows.length;
  const totalJogo = totalBetsCount * valor;

  return (
    <div className="relative overflow-hidden glass rounded-[20px] shadow-md">
      <div className={`h-[3px] ${locked ? 'bg-gradient-to-r from-slate-400 to-slate-300' : 'bg-gradient-to-r from-brblue to-brred'}`} />
      <MatchHeader match={match} centerSlot={<div className="font-display text-sm sm:text-base text-slate-300 tracking-widest">VS</div>} />

      <div className="border-t border-brblue/[0.08] px-3 sm:px-3.5 pt-3.5 pb-4">
        <div className="flex items-center justify-between gap-2.5 mb-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            Palpiteiros <span className="bg-brblue/10 text-brblue rounded-full px-1.5 text-[11px]">{totalBetsCount}</span>
          </div>
          {locked ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-400/10 text-slate-400 border border-slate-400/20 shrink-0">
              <LockIcon />Prazo encerrado
            </span>
          ) : (
            <button
              onClick={() => onOpenBet(match.id)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold text-[#002776] shrink-0
                bg-gradient-to-r from-brgreen to-[#FFDF00] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Palpitar
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          {rows.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-[13px]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 mx-auto mb-2 text-slate-300">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
              </svg>
              Nenhum palpite ainda. Seja o primeiro!
            </div>
          ) : (
            rows.map(({ p, b, idx, total, status }) => (
              <div
                key={`${p}-${idx}`}
                className={`flex items-center gap-2.5 px-2.5 sm:px-3.5 py-2.5 rounded-xl flex-wrap
                  ${status === true ? 'bg-gradient-to-br from-brgold/15 to-brgold/5 border-[1.5px] border-brgold/40 shadow-sm' : 'bg-white/45 border border-white/65'}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${status === true ? 'ring-2 ring-brgold/50' : ''}`}
                  style={{ background: avatarColor(p) }}
                >
                  {initials(p)}
                </div>
                <div className={`flex items-center gap-1 flex-1 min-w-0 ${status === true ? 'font-extrabold text-[#7a5c10]' : 'font-semibold'}`}>
                  <span className="text-[13px] truncate min-w-0">{p}</span>
                  {total > 1 && <span className="text-[9px] font-extrabold text-white bg-brblue rounded px-1.5 shrink-0">#{idx + 1}</span>}
                  {status === true && <TrophyIcon className="inline w-3 h-3 text-brgold shrink-0 -translate-y-px" />}
                </div>
                <div className={`font-display text-xl tracking-wider ${status === true ? 'text-[#8a6a1f]' : 'text-brblue'}`}>{b}</div>
                <span className="text-[10px] font-bold text-brgreen bg-brgreen/10 border border-brgreen/15 rounded-full px-1.5 py-0.5 whitespace-nowrap">
                  R$ {valor.toLocaleString('pt-BR')}
                </span>
                <StatusTag status={status} />
              </div>
            ))
          )}
        </div>

        {totalBetsCount > 0 && (
          <div className="flex items-center justify-between mt-3 px-3.5 py-2.5 bg-gradient-to-br from-brblue/[0.06] to-brblue/[0.02] border border-brblue/10 rounded-xl text-[11px] font-bold text-brblue uppercase">
            <span>Total acumulado neste jogo</span>
            <span className="font-display text-lg tracking-wide normal-case">R$ {totalJogo.toLocaleString('pt-BR')}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusTag({ status }) {
  const base = 'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight ml-auto whitespace-nowrap';
  if (status === null) {
    return (
      <span className={`${base} bg-muted/10 text-muted border border-muted/15`}>
        <ClockIcon className="w-2.5 h-2.5" />Aguardando
      </span>
    );
  }
  if (status === true) {
    return (
      <span className={`${base} bg-brgold/15 text-[#8a6a1f] border border-brgold/35 font-extrabold`}>
        <TrophyIcon className="w-2.5 h-2.5" />Ganhador
      </span>
    );
  }
  return (
    <span className={`${base} bg-brred/[0.06] text-slate-400 border border-brred/10`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
      Não foi
    </span>
  );
}
