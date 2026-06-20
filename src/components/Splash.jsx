import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  { icon: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>, label: 'Crie ou entre num bolão' },
  { icon: <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />, label: 'Registre seu palpite' },
  { icon: <><path d="M6 9H4.5a2.5 2.5 0 010-5H6" /><path d="M18 9h1.5a2.5 2.5 0 000-5H18" /><path d="M4 22h16" /><path d="M18 2H6v7a6 6 0 0012 0V2z" /></>, label: 'Dispute o prêmio' },
];

export default function Splash({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#001a52 0%,#002776 30%,#006633 65%,#009C3B 100%)' }}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] rounded-full blur-3xl opacity-40 animate-drift -top-20 -left-16" style={{ background: 'radial-gradient(circle,#FFDF00,transparent 70%)' }} />
            <div className="absolute w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] rounded-full blur-3xl opacity-40 animate-drift -bottom-16 -right-12" style={{ background: 'radial-gradient(circle,#CC0000,transparent 70%)', animationDelay: '5s' }} />
            <div className="absolute w-[240px] h-[240px] sm:w-[340px] sm:h-[340px] rounded-full blur-3xl opacity-40 animate-drift top-1/3 right-1/4" style={{ background: 'radial-gradient(circle,#009C3B,transparent 70%)', animationDelay: '10s' }} />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="relative z-10 w-full max-w-[420px] text-center bg-white/10 backdrop-blur-2xl border border-white/15 rounded-[28px] p-6 sm:p-9 shadow-2xl max-h-[92vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 bg-white/10 border border-white/20 text-white/85 text-[11px] font-bold px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors"
            >
              Pular
            </button>

            <div className="w-16 h-16 sm:w-[84px] sm:h-[86px] mx-auto mb-4 drop-shadow-xl">
              <svg viewBox="0 0 240 244" fill="none" className="w-full h-full">
                <defs>
                  <linearGradient id="splashNavy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d2454" /><stop offset="100%" stopColor="#04102b" />
                  </linearGradient>
                  <linearGradient id="splashGold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFE588" /><stop offset="100%" stopColor="#C9A84C" />
                  </linearGradient>
                </defs>
                <path d="M120 6 L210 34 L210 112 C210 172 170 208 120 226 C70 208 30 172 30 112 L30 34 Z" fill="url(#splashNavy)" stroke="url(#splashGold)" strokeWidth="5" />
                <g transform="translate(120,82)">
                  <circle r="44" fill="white" stroke="#0a1a3a" strokeWidth="2.2" />
                  <g stroke="#0a1a3a" strokeWidth="2" fill="#0a1a3a" strokeLinejoin="round">
                    <polygon points="0,-18 17,-5.5 10.5,14 -10.5,14 -17,-5.5" />
                  </g>
                </g>
              </svg>
            </div>

            <div className="text-[10px] font-bold tracking-[3px] text-white/60 uppercase mb-2">Copa do Mundo 2026</div>
            <h1 className="font-display text-[28px] sm:text-[34px] tracking-wide text-white leading-tight mb-3">
              Bem-vindo ao<br /><span className="text-[#FFDF00]">Bolão da Galera</span>
            </h1>
            <p className="text-[13px] sm:text-[13.5px] text-white/80 leading-relaxed mb-6">
              Crie seu bolão, faça seu palpite e dispute o prêmio com seus amigos!
            </p>

            <div className="flex flex-col gap-2.5 mb-7 text-left">
              {STEPS.map((s, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/[0.08] border border-white/[0.14] rounded-2xl px-3.5 py-2.5">
                  <div className="w-8 h-8 rounded-[10px] bg-white/15 flex items-center justify-center text-[#FFDF00] shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      {s.icon}
                    </svg>
                  </div>
                  <span className="text-[13px] font-semibold text-white">{s.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-extrabold text-[#002776] text-[14.5px] shadow-xl
                bg-gradient-to-r from-brgreen via-[#FFDF00] to-brgreen bg-[length:220%_220%] animate-gradient-shift hover:-translate-y-0.5 transition-transform"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Vamos começar!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
