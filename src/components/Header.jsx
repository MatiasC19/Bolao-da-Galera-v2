import { useApp } from '../state/AppContext';

const NAV_ITEMS = [
  {
    id: 'boloes', label: 'Bolões',
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
  },
  {
    id: 'meus', label: 'Meus',
    icon: (
      <>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
  },
  {
    id: 'admin', label: 'Admin',
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </>
    ),
  },
  {
    id: 'ajuda', label: 'Ajuda',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </>
    ),
  },
];

function NavIcon({ children, className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {children}
    </svg>
  );
}

export default function Header({ page, onNavigate }) {
  const { connStatus, currentBolao } = useApp();

  return (
    <>
      {/* TOP BAR — logo + sync status + desktop nav */}
      <header
        className="sticky top-0 z-[100] backdrop-blur-2xl border-b border-white/70 shadow-sm"
        style={{ background: 'rgba(232,236,245,.82)', paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="max-w-[1100px] mx-auto px-3 sm:px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => onNavigate('boloes')}
            className="flex items-center gap-2 shrink-0"
            aria-label="Início"
          >
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-brblue to-[#1a56d6] flex items-center justify-center shadow-md shrink-0">
              <svg viewBox="0 0 80 80" fill="none" className="w-5 h-5">
                <defs>
                  <radialGradient id="lbg" cx="35%" cy="28%" r="78%">
                    <stop offset="0%" stopColor="#1a56d6" />
                    <stop offset="100%" stopColor="#001a52" />
                  </radialGradient>
                  <linearGradient id="lgold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFE16B" />
                    <stop offset="100%" stopColor="#C9A84C" />
                  </linearGradient>
                </defs>
                <circle cx="40" cy="40" r="37.5" fill="url(#lbg)" />
                <circle cx="40" cy="40" r="37.5" fill="none" stroke="url(#lgold)" strokeWidth="4" />
                <g transform="translate(40,38) scale(1.55)">
                  <path d="M-8 -9 L8 -9 L8 3 C8 8.5 4.5 11.5 0 11.5 C-4.5 11.5 -8 8.5 -8 3 Z" fill="url(#lgold)" />
                  <rect x="-2.5" y="11.5" width="5" height="4" fill="url(#lgold)" />
                  <rect x="-6.5" y="15" width="13" height="2.2" rx="1.1" fill="url(#lgold)" />
                </g>
              </svg>
            </div>
            <div className="leading-none hidden xs:block">
              <strong className="font-display text-[18px] tracking-wide text-brblue block">BOLÃO</strong>
              <small className="text-[8px] font-bold tracking-[3px] text-brred uppercase">Da Galera · Copa 2026</small>
            </div>
          </button>

          {/* desktop nav, hidden on small screens (replaced by bottom tab bar) */}
          <nav className="hidden md:flex gap-0.5 bg-brblue/[0.07] rounded-[11px] p-[3px] ml-auto">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap
                  ${page === item.id ? 'bg-white text-brblue font-bold shadow-sm' : 'text-muted hover:bg-white/50 hover:text-brblue'}`}
              >
                <NavIcon className="w-4 h-4">{item.icon}</NavIcon>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="ml-auto md:ml-3 flex items-center gap-2 shrink-0">
            {currentBolao && (
              <button
                onClick={() => onNavigate('boloes')}
                className="hidden sm:flex items-center gap-1.5 bg-white/55 border border-white/75 rounded-full pl-1.5 pr-3 py-1 text-xs font-semibold hover:bg-white/80 transition-colors max-w-[140px]"
              >
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-brblue to-[#1a56d6] flex items-center justify-center text-white shrink-0">
                  <NavIcon className="w-2.5 h-2.5"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></NavIcon>
                </span>
                <span className="truncate-1">{currentBolao.nome || 'Bolão'}</span>
              </button>
            )}
            <span
              className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0
                ${connStatus === 'online' ? 'bg-brgreen/10 text-brgreen border border-brgreen/20' : 'bg-brred/10 text-brred border border-brred/15'}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full bg-current ${connStatus === 'online' ? 'animate-pulse-dot' : ''}`} />
              <span className="hidden min-[420px]:inline">{connStatus === 'online' ? 'Sincronizado' : 'Conectando…'}</span>
            </span>
          </div>
        </div>
      </header>

      {/* BOTTOM TAB BAR — primary nav on phones, thumb-reachable */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-[100] bg-white/90 backdrop-blur-xl border-t border-white/70 shadow-[0_-4px_24px_rgba(0,40,140,.08)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="grid grid-cols-4 max-w-[1100px] mx-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 transition-colors ${page === item.id ? 'text-brblue' : 'text-muted'}`}
            >
              <NavIcon className={`w-5 h-5 ${page === item.id ? 'scale-110' : ''} transition-transform`}>{item.icon}</NavIcon>
              <span className={`text-[10px] ${page === item.id ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
