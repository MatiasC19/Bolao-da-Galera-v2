import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, update, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBmLCPfNsgBSleNupMBuD_5N79rd-HatJE',
  authDomain: 'bolao-da-galera-9b949.firebaseapp.com',
  databaseURL: 'https://bolao-da-galera-9b949-default-rtdb.firebaseio.com',
  projectId: 'bolao-da-galera-9b949',
  storageBucket: 'bolao-da-galera-9b949.firebasestorage.app',
  messagingSenderId: '775781086844',
  appId: '1:775781086844:web:21828f96fd7a5623353bf9',
};

let app, db, boloesRef;

export function initFirebase(onUpdate, onError) {
  try {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    boloesRef = ref(db, 'boloes');
    onValue(
      boloesRef,
      (snap) => onUpdate(snap.val() || {}),
      (err) => onError?.(err)
    );
  } catch (e) {
    onError?.(e);
  }
}

export function createBolao(id, data) {
  if (!db) return Promise.reject(new Error('no connection'));
  return set(ref(db, `boloes/${id}`), data);
}

export function updateBolao(id, partial) {
  if (!db) return Promise.reject(new Error('no connection'));
  return update(ref(db, `boloes/${id}`), partial);
}

export function deleteBolao(id) {
  if (!db) return Promise.reject(new Error('no connection'));
  return remove(ref(db, `boloes/${id}`));
}
