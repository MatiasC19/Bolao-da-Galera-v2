import { motion } from 'framer-motion';

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[21px] h-[21px]">
      <path d="M6 9H4.5a2.5 2.5 0 010-5H6" /><path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
      <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0012 0V2z" />
    </svg>
  );
}

export default function BolaoCard({ bolao, onClick, badge, footerOverride }) {
  const numJogos = Object.keys(bolao.matches || {}).length;
  // each value in bets[matchId][playerName] can be a single score (string) or
  // an array of scores (multiple bets by the same person on that match) — we
  // must count every individual bet, not just the number of distinct bettors
  const numPalpites = Object.values(bolao.bets || {}).reduce((acc, matchBets) => {
    return acc + Object.values(matchBets || {}).reduce((a2, raw) => a2 + (Array.isArray(raw) ? raw.length : 1), 0);
  }, 0);
  const totalArrecadado = numPalpites * (bolao.valor || 10);

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="relative overflow-hidden cursor-pointer glass rounded-[20px] shadow-md hover:shadow-lg transition-shadow p-4 sm:p-[1.125rem]"
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brgreen to-[#FFDF00]" />
      {badge}
      <div className="flex items-center gap-3 mb-2.5 pr-6">
        <div className="w-10 h-10 sm:w-[42px] sm:h-[42px] rounded-xl bg-gradient-to-br from-brblue to-[#1a56d6] text-white flex items-center justify-center shrink-0">
          <TrophyIcon />
        </div>
        <div className="min-w-0">
          <div className="font-display text-base sm:text-lg tracking-wide leading-tight truncate-1">{bolao.nome || 'Bolão'}</div>
          <div className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[11px] h-[11px] shrink-0">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span className="truncate-1">R$ {(bolao.valor || 10).toLocaleString('pt-BR')} por palpite</span>
          </div>
        </div>
      </div>
      {footerOverride || (
        <div className="grid grid-cols-3 gap-2 mt-2.5">
          <StatChip n={numPalpites} label="Palpites" />
          <StatChip n={numJogos} label="Jogos" />
          <StatChip n={`R$${totalArrecadado.toLocaleString('pt-BR')}`} label="Total" />
        </div>
      )}
    </motion.div>
  );
}

function StatChip({ n, label }) {
  return (
    <div className="bg-brblue/5 border border-brblue/10 rounded-[10px] py-2 text-center min-w-0">
      <div className="font-display text-base sm:text-lg text-brblue leading-none truncate-1 px-1">{n}</div>
      <div className="text-[8px] font-bold text-muted uppercase tracking-wider">{label}</div>
    </div>
  );
}
