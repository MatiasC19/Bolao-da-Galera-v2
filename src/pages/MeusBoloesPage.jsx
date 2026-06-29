import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Divider, EmptyState } from '../components/Layout';
import { useApp } from '../state/AppContext';

export default function MeusBoloesPage({ onSelectBolao }) {
  const { allBoloes, getMyBoloesMap } = useApp();
  const map = getMyBoloesMap();
  const ids = useMemo(() => Object.keys(map).filter((id) => allBoloes[id]), [map, allBoloes]);

  return (
    <div className="glass rounded-[20px] shadow-md overflow-hidden">
      <div className="px-4 sm:px-5 pt-4 pb-3.5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-brgreen to-[#14a862] flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div className="min-w-0">
          <div className="font-display text-base sm:text-lg tracking-wide">Meus Bolões</div>
          <div className="text-[11px] text-muted truncate-1">Bolões onde você já registrou algum palpite</div>
        </div>
      </div>

      <Divider />

      <div className="px-4 sm:px-5 py-4 flex flex-col gap-3.5">
        {ids.length === 0 ? (
          <EmptyState
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            }
          >
            Você ainda não registrou nenhum palpite. Entre num bolão na aba "Bolões" e palpite em um jogo!
          </EmptyState>
        ) : (
          ids.map((id) => {
            const bolao = allBoloes[id];
            const myName = map[id];
            const numJogos = Object.keys(bolao.matches || {}).length;
            // count every individual bet (array length), not just distinct bettors/matches
            const numPalpites = Object.values(bolao.bets || {}).reduce((acc, matchBets) => {
              return acc + Object.values(matchBets || {}).reduce((a2, raw) => a2 + (Array.isArray(raw) ? raw.length : 1), 0);
            }, 0);
            const myBetsCount = Object.values(bolao.bets || {}).reduce((acc, matchBets) => {
              const raw = matchBets && matchBets[myName];
              if (!raw) return acc;
              return acc + (Array.isArray(raw) ? raw.length : 1);
            }, 0);
            return (
              <motion.div
                key={id}
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -2 }}
                onClick={() => onSelectBolao(id)}
                className="relative overflow-hidden cursor-pointer glass rounded-[20px] shadow-md hover:shadow-lg transition-shadow p-4 sm:p-[1.125rem]"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brgreen to-[#FFDF00]" />
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brblue to-[#1a56d6] text-white flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[21px] h-[21px]">
                      <path d="M6 9H4.5a2.5 2.5 0 010-5H6" /><path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
                      <path d="M4 22h16" /><path d="M18 2H6v7a6 6 0 0012 0V2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-base sm:text-lg tracking-wide leading-tight truncate-1">{bolao.nome}</div>
                    <div className="text-[11px] text-muted truncate-1">Você entrou como <strong>{myName}</strong></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Stat n={numPalpites} label="Palpites" />
                  <Stat n={numJogos} label="Jogos" />
                  <Stat n={myBetsCount} label="Seus Palpites" />
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

function Stat({ n, label }) {
  return (
    <div className="bg-brblue/5 border border-brblue/10 rounded-[10px] py-2 text-center min-w-0">
      <div className="font-display text-base sm:text-lg text-brblue leading-none truncate-1 px-1">{n}</div>
      <div className="text-[8px] font-bold text-muted uppercase tracking-wider">{label}</div>
    </div>
  );
}
