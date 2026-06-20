import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { initFirebase, createBolao as fbCreate, updateBolao as fbUpdate, deleteBolao as fbDelete } from '../services/firebase';

const AppCtx = createContext(null);

const LS = {
  activeId: 'bolao_active_id',
  unlocked: 'bolao_unlocked',
  adminUnlocked: 'bolao_admin_unlocked',
  lastName: 'bolao_last_name',
  myBoloes: 'bolao_my_boloes',
  splashSeen: 'bolao_splash_seen',
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  const [allBoloes, setAllBoloes] = useState({});
  const [connStatus, setConnStatus] = useState('connecting'); // connecting | online | offline
  const [currentBoloId, setCurrentBoloId] = useState(() => localStorage.getItem(LS.activeId) || null);
  const [toast, setToast] = useState(null);
  const firstLoadRef = useRef(true);
  const [autoNavigateSignal, setAutoNavigateSignal] = useState(0);

  useEffect(() => {
    initFirebase(
      (data) => {
        setAllBoloes(data);
        setConnStatus('online');
        if (firstLoadRef.current) {
          firstLoadRef.current = false;
          const savedId = localStorage.getItem(LS.activeId);
          if (savedId && data[savedId]) {
            setAutoNavigateSignal((n) => n + 1);
          }
        }
      },
      () => {
        setConnStatus('offline');
        showToast('Não foi possível conectar ao servidor. Verifique sua internet.', 'err');
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = useCallback((msg, type = 'ok') => {
    setToast({ msg, type, key: Date.now() });
  }, []);

  const currentBolao = currentBoloId ? allBoloes[currentBoloId] : null;

  const createBolao = useCallback(async (data) => {
    const id = 'b' + Date.now();
    await fbCreate(id, data);
    return id;
  }, []);

  const updateBolaoById = useCallback(async (id, partial) => {
    try {
      await fbUpdate(id, partial);
    } catch (e) {
      showToast('Erro ao salvar — verifique sua conexão', 'err');
      throw e;
    }
  }, [showToast]);

  const deleteBolaoById = useCallback(async (id) => {
    await fbDelete(id);
    const adminIds = readJSON(LS.adminUnlocked, []).filter((x) => x !== id);
    localStorage.setItem(LS.adminUnlocked, JSON.stringify(adminIds));
    const myMap = readJSON(LS.myBoloes, {});
    delete myMap[id];
    localStorage.setItem(LS.myBoloes, JSON.stringify(myMap));
    if (currentBoloId === id) {
      setCurrentBoloId(null);
      localStorage.removeItem(LS.activeId);
    }
  }, [currentBoloId]);

  const activateBolao = useCallback((id) => {
    setCurrentBoloId(id);
    localStorage.setItem(LS.activeId, id);
  }, []);

  const exitBolao = useCallback(() => {
    setCurrentBoloId(null);
    localStorage.removeItem(LS.activeId);
  }, []);

  // admin ownership ------------------------------------------------------
  const getAdminUnlockedIds = useCallback(() => readJSON(LS.adminUnlocked, []), []);
  const grantAdminAccess = useCallback((id) => {
    const ids = readJSON(LS.adminUnlocked, []);
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(LS.adminUnlocked, JSON.stringify(ids));
    }
  }, []);
  const isAdminOf = useCallback((id) => readJSON(LS.adminUnlocked, []).includes(id), []);

  // private-bolao unlock ---------------------------------------------------
  const getUnlockedIds = useCallback(() => readJSON(LS.unlocked, []), []);
  const grantUnlock = useCallback((id) => {
    const ids = readJSON(LS.unlocked, []);
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(LS.unlocked, JSON.stringify(ids));
    }
  }, []);

  // "meus boloes" tracking -------------------------------------------------
  const getMyBoloesMap = useCallback(() => readJSON(LS.myBoloes, {}), []);
  const rememberMyBolao = useCallback((boloId, name) => {
    if (!boloId) return;
    const map = readJSON(LS.myBoloes, {});
    map[boloId] = name;
    localStorage.setItem(LS.myBoloes, JSON.stringify(map));
  }, []);

  const [lastName, setLastNameState] = useState(() => localStorage.getItem(LS.lastName) || '');
  const setLastName = useCallback((name) => {
    localStorage.setItem(LS.lastName, name);
    setLastNameState(name);
  }, []);

  const value = {
    allBoloes,
    connStatus,
    currentBoloId,
    currentBolao,
    toast,
    showToast,
    createBolao,
    updateBolaoById,
    deleteBolaoById,
    activateBolao,
    exitBolao,
    getAdminUnlockedIds,
    grantAdminAccess,
    isAdminOf,
    getUnlockedIds,
    grantUnlock,
    getMyBoloesMap,
    rememberMyBolao,
    lastName,
    setLastName,
    autoNavigateSignal,
    LS,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
