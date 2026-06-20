import { useState } from 'react';
import { team } from '../data/teams';

/**
 * Renders a team flag. Size is controlled entirely via the `className`
 * the caller passes (Tailwind w-/h- utilities), so the flag always scales
 * with its container instead of carrying a fixed pixel size — this is
 * what keeps flags from overflowing their row on narrow phone screens.
 */
export default function Flag({ code, className = 'w-9 h-6', rounded = 'rounded-md' }) {
  const t = team(code);
  const [failed, setFailed] = useState(false);

  return (
    <span
      className={`flag-box ${className} ${rounded} shadow-sm shrink-0 inline-block bg-gradient-to-br from-slate-50 to-slate-100`}
      title={t.n}
    >
      {t.f && !failed ? (
        <img
          src={`https://flagcdn.com/w80/${t.f}.png`}
          alt={t.n}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="w-full h-full flex items-center justify-center text-[clamp(14px,60%,28px)] leading-none">
          {t.e || code}
        </span>
      )}
    </span>
  );
}
