export function GlassCard({ children, className = '' }) {
  return <div className={`glass rounded-[20px] shadow-md overflow-hidden ${className}`}>{children}</div>;
}

export function SectionHead({ icon, iconBg, title, subtitle }) {
  return (
    <div className="flex items-center gap-2.5 px-4 sm:px-5 pt-4 sm:pt-[1.125rem] pb-3.5">
      <div className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0 text-white" style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="font-display text-base sm:text-lg tracking-wide truncate-1">{title}</div>
        {subtitle && <div className="text-[11px] text-muted truncate-1">{subtitle}</div>}
      </div>
    </div>
  );
}

export function Divider() {
  return <div className="h-px bg-gradient-to-r from-transparent via-brblue/10 to-transparent" />;
}

export function EmptyState({ icon, children }) {
  return (
    <div className="text-center py-10 px-4 text-slate-400 text-[13px]">
      <div className="w-9 h-9 mx-auto mb-3 text-slate-300">{icon}</div>
      {children}
    </div>
  );
}
