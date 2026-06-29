import { useState, useMemo } from 'react';
import { Divider, EmptyState } from '../components/Layout';
import Flag from '../components/Flag';
import { TEAMS, PHASES, team, avatarColor, initials } from '../data/teams';
import { useApp } from '../state/AppContext';
import { useConfirm } from '../components/ConfirmDialog';
import { betsOf, isExactWinner } from '../lib/betLogic';

export default function AdminPage() {
  const { allBoloes, isAdminOf, grantAdminAccess, showToast } = useApp();
  const [pw, setPw] = useState('');

  const ids = useMemo(() => Object.keys(allBoloes).filter(isAdminOf), [allBoloes, isAdminOf]);

  const unlock = () => {
    const typed = pw.trim();
    if (!typed) return showToast('Digite a senha de admin', 'err');
    const match = Object.keys(allBoloes).find((id) => allBoloes[id].adminSenha === typed);
    if (!match) return showToast('Senha de admin não corresponde a nenhum bolão', 'err');
    grantAdminAccess(match);
    setPw('');
    showToast(`Acesso de admin liberado para "${allBoloes[match].nome}"!`);
  };

  return (
    <div className="glass rounded-[20px] shadow-md overflow-hidden">
      <div className="px-4 sm:px-5 pt-4 pb-3.5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-brblue to-[#1a56d6] flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
        </div>
        <div className="min-w-0">
          <div className="font-display text-base sm:text-lg tracking-wide">Meus Bolões</div>
          <div className="text-[11px] text-muted truncate-1">Você só administra os bolões para os quais tem a senha de admin</div>
        </div>
      </div>
      <Divider />
      <div className="px-4 sm:px-5 py-4">
        <div className="flex gap-2.5 flex-wrap sm:flex-nowrap mb-3.5">
          <input
            type="text" value={pw} onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && unlock()}
            placeholder="Senha de admin de um bolão"
            className="flex-1 min-w-[180px] h-12 border-[1.5px] border-brblue/[0.13] rounded-xl bg-white/70 px-3.5 text-sm outline-none focus:border-brblue focus:bg-white focus:ring-[3px] focus:ring-brblue/[0.07] transition-all"
          />
          <button
            onClick={unlock}
            className="flex items-center justify-center gap-1.5 px-5 h-12 rounded-xl text-white text-sm font-bold bg-gradient-to-br from-brblue to-[#1a56d6] hover:shadow-lg hover:-translate-y-0.5 transition-all shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
            Destravar
          </button>
        </div>

        {ids.length === 0 ? (
          <EmptyState icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>}>
            Você ainda não administra nenhum bolão. Crie um na aba Bolões, ou destrave um existente com a senha de admin acima.
          </EmptyState>
        ) : (
          <div className="flex flex-col gap-4">
            {ids.map((id) => <AdminBolaoCard key={id} id={id} bolao={allBoloes[id]} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminBolaoCard({ id, bolao }) {
  const { updateBolaoById, deleteBolaoById, showToast } = useApp();
  const confirm = useConfirm();
  const matches = bolao.matches || [];
  const players = bolao.players || [];

  const [home, setHome] = useState('');
  const [away, setAway] = useState('');
  const [phase, setPhase] = useState(PHASES[0]);
  const [deadline, setDeadline] = useState('');

  const sortedTeams = useMemo(() => [...TEAMS].sort((a, b) => a.n.localeCompare(b.n, 'pt')), []);

  const addMatch = () => {
    if (!home || !away || !deadline) return showToast('Preencha todos os campos', 'err');
    if (home === away) return showToast('Escolha seleções diferentes', 'err');
    const m = { id: Date.now() + '', home, away, ph: phase, dl: deadline, res: null };
    const newMatches = [...matches, m];
    const newBets = { ...(bolao.bets || {}), [m.id]: {} };
    updateBolaoById(id, { matches: newMatches, bets: newBets });
    setHome(''); setAway(''); setDeadline('');
    showToast(`${team(home).n} × ${team(away).n} cadastrado em "${bolao.nome}"!`);
  };

  const deleteThisBolao = async () => {
    const ok = await confirm(`Excluir "${bolao.nome}" para sempre? Todos os jogos, palpites e participantes serão perdidos. Essa ação não pode ser desfeita.`);
    if (!ok) return;
    try {
      await deleteBolaoById(id);
      showToast(`"${bolao.nome}" foi excluído`, 'inf');
    } catch {
      showToast('Erro ao excluir — verifique sua conexão', 'err');
    }
  };

  const delMatch = async (i) => {
    const ok = await confirm('Remover este jogo e todos os palpites?');
    if (!ok) return;
    const removed = matches[i];
    const newMatches = matches.filter((_, idx) => idx !== i);
    const newBets = { ...(bolao.bets || {}) };
    delete newBets[removed.id];
    await updateBolaoById(id, { matches: newMatches, bets: newBets });
    showToast('Jogo removido', 'inf');
  };

  const setResult = (i, h, a) => {
    if (h === '' || a === '') return showToast('Insira o placar completo', 'err');
    const newMatches = matches.map((m, idx) => (idx === i ? { ...m, res: `${h}:${a}` } : m));
    updateBolaoById(id, { matches: newMatches });
    showToast(`Resultado ${h}:${a} registrado!`);
  };

  const clearResult = async (i) => {
    const ok = await confirm('Apagar o resultado oficial deste jogo?');
    if (!ok) return;
    const newMatches = matches.map((m, idx) => (idx === i ? { ...m, res: null } : m));
    await updateBolaoById(id, { matches: newMatches });
    showToast('Resultado oficial apagado', 'inf');
  };

  const delPlayer = async (i) => {
    const name = players[i];
    const ok = await confirm(`Remover ${name}? Todos os palpites dessa pessoa também serão apagados.`);
    if (!ok) return;
    const newPlayers = players.filter((_, idx) => idx !== i);
    const newBets = { ...(bolao.bets || {}) };
    Object.keys(newBets).forEach((matchId) => {
      if (newBets[matchId]?.[name]) {
        newBets[matchId] = { ...newBets[matchId] };
        delete newBets[matchId][name];
      }
    });
    await updateBolaoById(id, { players: newPlayers, bets: newBets });
    showToast('Participante e seus palpites removidos', 'inf');
  };

  // ── per-bet edit/delete (admin only) ──────────────────────────────────
  // A "bet" is identified by matchId + player name + index within that
  // player's array of scores for that match (since one person can have
  // more than one bet on the same game).
  const editBet = async (matchId, name, betIdx, newScore) => {
    const bets = bolao.bets || {};
    const list = betsOf(bets, matchId, name);
    if (betIdx < 0 || betIdx >= list.length) return;
    const newList = list.slice();
    newList[betIdx] = newScore;
    const newBets = { ...bets, [matchId]: { ...(bets[matchId] || {}), [name]: newList } };
    await updateBolaoById(id, { bets: newBets });
    showToast(`Palpite de ${name} atualizado para ${newScore}`);
  };

  const deleteBet = async (matchId, name, betIdx) => {
    const bets = bolao.bets || {};
    const list = betsOf(bets, matchId, name);
    if (betIdx < 0 || betIdx >= list.length) return;
    const ok = await confirm(`Excluir o palpite "${list[betIdx]}" de ${name} neste jogo?`);
    if (!ok) return;
    const newList = list.filter((_, idx) => idx !== betIdx);
    const newBets = { ...bets, [matchId]: { ...(bets[matchId] || {}) } };
    if (newList.length > 0) {
      newBets[matchId][name] = newList;
    } else {
      delete newBets[matchId][name];
    }
    await updateBolaoById(id, { bets: newBets });
    showToast('Palpite excluído', 'inf');
  };

  return (
    <div className="glass rounded-[20px] shadow-md p-4 sm:p-5">
      <div className="flex items-center gap-2.5 mb-3.5 flex-wrap">
        <div className="w-9 h-9 rounded-[9px] bg-gradient-to-br from-brblue to-[#1a56d6] flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]"><path d="M6 9H4.5a2.5 2.5 0 010-5H6" /><path d="M18 9h1.5a2.5 2.5 0 000-5H18" /><path d="M4 22h16" /><path d="M18 2H6v7a6 6 0 0012 0V2z" /></svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-base sm:text-lg tracking-wide truncate-1">{bolao.nome}</div>
          <div className="text-[11px] text-muted truncate-1">R$ {(bolao.valor || 10).toLocaleString('pt-BR')} por palpite · {players.length} participante{players.length !== 1 ? 's' : ''}</div>
        </div>
        <button
          onClick={deleteThisBolao}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-brred border border-brred/20 text-[11px] font-bold hover:bg-brred/5 transition-colors shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[13px] h-[13px]"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" /></svg>
          Excluir
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
        <SelectField label="Time da Casa" value={home} onChange={setHome} teams={sortedTeams} />
        <SelectField label="Time Visitante" value={away} onChange={setAway} teams={sortedTeams} />
        <div>
          <label className="block text-[10px] font-bold text-muted uppercase tracking-wide mb-1.5">Fase / Grupo</label>
          <select value={phase} onChange={(e) => setPhase(e.target.value)} className={selectClass}>
            {PHASES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-muted uppercase tracking-wide mb-1.5">Data e hora limite para palpites</label>
          <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={selectClass} />
        </div>
      </div>

      <button
        onClick={addMatch}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-bold bg-gradient-to-br from-brblue to-[#1a56d6] hover:shadow-lg hover:-translate-y-0.5 transition-all mb-4"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        Cadastrar Jogo neste Bolão
      </button>

      <Divider />

      <div className="text-[11px] font-bold uppercase tracking-wide text-muted flex items-center gap-1.5 my-3.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
        Jogos deste bolão
      </div>

      <div className="flex flex-col gap-3 mb-4">
        {matches.length === 0 ? (
          <div className="text-muted text-[13px]">Nenhum jogo cadastrado ainda</div>
        ) : (
          matches.map((m, i) => (
            <AdminMatchRow
              key={m.id}
              match={m}
              bets={bolao.bets || {}}
              players={players}
              onDelete={() => delMatch(i)}
              onSetResult={(h, a) => setResult(i, h, a)}
              onClearResult={() => clearResult(i)}
              onEditBet={(name, betIdx, newScore) => editBet(m.id, name, betIdx, newScore)}
              onDeleteBet={(name, betIdx) => deleteBet(m.id, name, betIdx)}
            />
          ))
        )}
      </div>

      <Divider />

      <div className="text-[11px] font-bold uppercase tracking-wide text-muted flex items-center gap-1.5 my-3.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
        Participantes
      </div>
      <div className="flex flex-wrap gap-2">
        {players.length === 0 ? (
          <div className="text-[13px] text-muted">Nenhum participante. As pessoas entram ao enviar o primeiro palpite.</div>
        ) : (
          players.map((p, i) => (
            <div key={p} className="flex items-center gap-1.5 bg-white/55 border border-white/75 rounded-full pl-1 pr-2.5 py-1">
              <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ background: avatarColor(p) }}>{initials(p)}</div>
              <span className="text-xs font-semibold truncate-1 max-w-[110px]">{p}</span>
              <button onClick={() => delPlayer(i)} className="text-slate-400 hover:text-brred transition-colors shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const selectClass = 'w-full h-12 border-[1.5px] border-brblue/[0.13] rounded-xl bg-white/70 px-3 text-sm outline-none focus:border-brblue focus:bg-white focus:ring-[3px] focus:ring-brblue/[0.07] transition-all appearance-none';

function SelectField({ label, value, onChange, teams }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-muted uppercase tracking-wide mb-1.5">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
        <option value="">Selecionar seleção...</option>
        {teams.map((t) => <option key={t.c} value={t.c}>{t.n}</option>)}
      </select>
    </div>
  );
}

function AdminMatchRow({ match, bets, players, onDelete, onSetResult, onClearResult, onEditBet, onDeleteBet }) {
  const h = team(match.home), a = team(match.away);
  const [rh, setRh] = useState(match.res ? match.res.split(':')[0] : '');
  const [ra, setRa] = useState(match.res ? match.res.split(':')[1] : '');
  const [expanded, setExpanded] = useState(false);
  const dl = new Date(match.dl).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  const res = match.res || null;
  const bettorRows = players.flatMap((p) =>
    betsOf(bets, match.id, p).map((b, idx) => ({ p, b, idx }))
  );

  return (
    <div className="flex items-center gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-white/45 border border-white/65 flex-wrap">
      <div className="flex gap-1 shrink-0">
        <Flag code={match.home} className="w-[26px] h-[17px]" rounded="rounded" />
        <Flag code={match.away} className="w-[26px] h-[17px]" rounded="rounded" />
      </div>
      <div className="font-bold text-[13px] flex-1 min-w-[120px] truncate-1">{h.n} × {a.n}</div>
      <div className="text-[11px] text-muted flex items-center gap-1 shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 shrink-0"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
        {dl} · {match.ph}
      </div>

      <div className="w-full flex items-center justify-between gap-2 flex-wrap border-t border-dashed border-brblue/10 pt-2.5 mt-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <input type="number" inputMode="numeric" min="0" max="20" placeholder="0" value={rh} onChange={(e) => setRh(e.target.value)}
            className="w-10 h-[34px] border-[1.5px] border-brgreen/20 rounded-md bg-white/85 font-display text-lg text-center text-brgreen outline-none focus:border-brgreen" />
          <span className="font-display text-lg text-slate-300">×</span>
          <input type="number" inputMode="numeric" min="0" max="20" placeholder="0" value={ra} onChange={(e) => setRa(e.target.value)}
            className="w-10 h-[34px] border-[1.5px] border-brgreen/20 rounded-md bg-white/85 font-display text-lg text-center text-brgreen outline-none focus:border-brgreen" />
          <button onClick={() => onSetResult(rh, ra)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-brgreen border border-brgreen/20 text-[11px] font-bold hover:bg-brgreen/5 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></svg>
            {match.res ? 'Atualizar' : 'Confirmar'}
          </button>
          {match.res && (
            <button onClick={onClearResult} title="Apagar resultado oficial" className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-brred border border-brred/20 text-[11px] font-bold hover:bg-brred/5 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              Limpar
            </button>
          )}
        </div>
        <button onClick={onDelete} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-brred border border-brred/20 text-[11px] font-bold hover:bg-brred/5 transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /></svg>
          Remover jogo
        </button>
      </div>

      <div className="w-full border-t border-dashed border-brblue/10 pt-2.5 mt-1">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 text-[11px] font-bold text-brblue hover:underline"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
          {bettorRows.length} palpite{bettorRows.length !== 1 ? 's' : ''} neste jogo {expanded ? '— ocultar' : '— ver e editar'}
        </button>

        {expanded && (
          <div className="flex flex-col gap-1.5 mt-2.5">
            {bettorRows.length === 0 ? (
              <div className="text-[12px] text-muted">Nenhum palpite registrado ainda neste jogo.</div>
            ) : (
              bettorRows.map(({ p, b, idx }) => (
                <BettorRow
                  key={`${p}-${idx}`}
                  name={p}
                  score={b}
                  status={isExactWinner(b, res)}
                  onSave={(newScore) => onEditBet(p, idx, newScore)}
                  onDelete={() => onDeleteBet(p, idx)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** One editable row for a single bet inside the admin's expanded match view. */
function BettorRow({ name, score, status, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [h0, a0] = score.split(':');
  const [eh, setEh] = useState(h0 || '');
  const [ea, setEa] = useState(a0 || '');

  const save = () => {
    if (eh === '' || ea === '' || isNaN(+eh) || isNaN(+ea)) return;
    onSave(`${eh}:${ea}`);
    setEditing(false);
  };

  const cancel = () => {
    setEh(h0 || '');
    setEa(a0 || '');
    setEditing(false);
  };

  return (
    <div className={`flex items-center gap-2 px-2.5 py-2 rounded-xl flex-wrap
      ${status === true ? 'bg-brgold/10 border border-brgold/30' : 'bg-white/55 border border-white/70'}`}>
      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ background: avatarColor(name) }}>
        {initials(name)}
      </div>
      <span className="text-[12.5px] font-semibold truncate-1 max-w-[110px]">{name}</span>

      {editing ? (
        <div className="flex items-center gap-1.5">
          <input type="number" inputMode="numeric" min="0" max="20" value={eh} onChange={(e) => setEh(e.target.value)}
            className="w-9 h-7 border border-brblue/25 rounded-md bg-white text-center font-display text-sm text-brblue outline-none focus:border-brblue" />
          <span className="font-display text-sm text-slate-300">×</span>
          <input type="number" inputMode="numeric" min="0" max="20" value={ea} onChange={(e) => setEa(e.target.value)}
            className="w-9 h-7 border border-brblue/25 rounded-md bg-white text-center font-display text-sm text-brblue outline-none focus:border-brblue" />
        </div>
      ) : (
        <span className={`font-display text-base tracking-wider ${status === true ? 'text-[#8a6a1f]' : 'text-brblue'}`}>{score}</span>
      )}

      <div className="flex items-center gap-1.5 ml-auto">
        {editing ? (
          <>
            <button onClick={save} className="flex items-center gap-1 px-2 py-1 rounded-md text-brgreen border border-brgreen/20 text-[10px] font-bold hover:bg-brgreen/5 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5"><polyline points="20 6 9 17 4 12" /></svg>
              Salvar
            </button>
            <button onClick={cancel} className="px-2 py-1 rounded-md text-muted border border-muted/20 text-[10px] font-bold hover:bg-muted/5 transition-colors">
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)} title="Editar palpite" className="flex items-center gap-1 px-2 py-1 rounded-md text-brblue border border-brblue/20 text-[10px] font-bold hover:bg-brblue/5 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
              Editar
            </button>
            <button onClick={onDelete} title="Excluir palpite" className="flex items-center gap-1 px-2 py-1 rounded-md text-brred border border-brred/20 text-[10px] font-bold hover:bg-brred/5 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /></svg>
              Excluir
            </button>
          </>
        )}
      </div>
    </div>
  );
}
