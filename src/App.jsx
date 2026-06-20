import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from './state/AppContext';
import Header from './components/Header';
import Toast from './components/Toast';
import Splash from './components/Splash';
import BetModal from './components/BetModal';
import CreateBolaoModal from './components/CreateBolaoModal';
import EnterBolaoModal from './components/EnterBolaoModal';
import BoloesPage from './pages/BoloesPage';
import MeusBoloesPage from './pages/MeusBoloesPage';
import DetalhePage from './pages/DetalhePage';
import AdminPage from './pages/AdminPage';
import AjudaPage from './pages/AjudaPage';

export default function App() {
  const {
    allBoloes, currentBoloId, currentBolao, activateBolao,
    createBolao, updateBolaoById, showToast, grantAdminAccess, grantUnlock,
    getUnlockedIds, rememberMyBolao, setLastName, autoNavigateSignal,
  } = useApp();

  const [page, setPage] = useState('boloes');
  const [showSplash, setShowSplash] = useState(() => !localStorage.getItem('bolao_splash_seen'));
  const [createOpen, setCreateOpen] = useState(false);
  const [pendingPrivate, setPendingPrivate] = useState(null); // { id, bolao }
  const [betMatchId, setBetMatchId] = useState(null);

  useEffect(() => {
    if (autoNavigateSignal > 0) setPage('meus');
  }, [autoNavigateSignal]);

  const navigate = useCallback((target) => {
    if (target === 'detalhe' && !currentBoloId) {
      showToast('Escolha um bolão primeiro', 'err');
      setPage('boloes');
      return;
    }
    setPage(target);
  }, [currentBoloId, showToast]);

  const closeSplash = () => {
    localStorage.setItem('bolao_splash_seen', '1');
    setShowSplash(false);
  };

  const selectBolao = (id) => {
    const bolao = allBoloes[id];
    if (!bolao) return;
    if (bolao.publico === false && !getUnlockedIds().includes(id)) {
      setPendingPrivate({ id, bolao });
      return;
    }
    activateBolao(id);
    showToast(`Você entrou em "${bolao.nome || 'Bolão'}"!`);
    setPage('detalhe');
  };

  const submitPrivateEntry = (typedSenha) => {
    if (!pendingPrivate) return;
    const { id, bolao } = pendingPrivate;
    if (typedSenha !== bolao.senha) return showToast('Senha incorreta', 'err');
    grantUnlock(id);
    setPendingPrivate(null);
    activateBolao(id);
    showToast(`Você entrou em "${bolao.nome || 'Bolão'}"!`);
    setPage('detalhe');
  };

  const handleCreateBolao = async (data) => {
    try {
      const id = await createBolao({ ...data, criadoEm: Date.now(), players: [], matches: [], bets: {} });
      grantAdminAccess(id);
      setCreateOpen(false);
      activateBolao(id);
      showToast(`Você entrou em "${data.nome}"!`);
      setPage('detalhe');
    } catch {
      showToast('Erro ao criar bolão — verifique sua conexão', 'err');
    }
  };

  const openBetModal = (matchId) => {
    const match = (currentBolao?.matches || []).find((m) => m.id === matchId);
    if (!match) return;
    if (new Date() >= new Date(match.dl)) return showToast('Prazo encerrado!', 'err');
    setBetMatchId(matchId);
  };

  const submitBet = (name, scores) => {
    if (!currentBolao || !currentBoloId) return;
    const match = (currentBolao.matches || []).find((m) => m.id === betMatchId);
    if (!match) return;
    if (new Date() >= new Date(match.dl)) {
      showToast('Prazo encerrado!', 'err');
      setBetMatchId(null);
      return;
    }
    const newBets = { ...(currentBolao.bets || {}) };
    newBets[betMatchId] = { ...(newBets[betMatchId] || {}), [name]: scores };
    const newPlayers = (currentBolao.players || []).includes(name)
      ? currentBolao.players
      : [...(currentBolao.players || []), name];

    updateBolaoById(currentBoloId, { bets: newBets, players: newPlayers });
    setLastName(name);
    rememberMyBolao(currentBoloId, name);
    setBetMatchId(null);
    showToast(scores.length > 1 ? `${scores.length} palpites salvos, ${name}!` : `Palpite ${scores[0]} salvo, ${name}!`);
  };

  const betMatch = currentBolao?.matches?.find((m) => m.id === betMatchId) || null;

  return (
    <div className="min-h-screen">
      <Splash open={showSplash} onClose={closeSplash} />
      <Header page={page} onNavigate={navigate} />

      <main className="max-w-[1100px] mx-auto px-3 sm:px-4 pt-4 sm:pt-5 pb-24 md:pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            {page === 'boloes' && <BoloesPage onSelectBolao={selectBolao} onOpenCreate={() => setCreateOpen(true)} />}
            {page === 'meus' && <MeusBoloesPage onSelectBolao={selectBolao} />}
            {page === 'detalhe' && <DetalhePage onBack={() => navigate('meus')} onOpenBet={openBetModal} />}
            {page === 'admin' && <AdminPage />}
            {page === 'ajuda' && <AjudaPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Toast />

      <CreateBolaoModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreateBolao} />
      <EnterBolaoModal bolao={pendingPrivate?.bolao} onClose={() => setPendingPrivate(null)} onSubmit={submitPrivateEntry} />
      <BetModal match={betMatch} bets={currentBolao?.bets || {}} onClose={() => setBetMatchId(null)} onSubmit={submitBet} />
    </div>
  );
}
