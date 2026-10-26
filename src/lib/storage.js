import { ARRAY_KEYS, DATA_KEYS } from './constants';
import { seedData } from './seed';

/**
 * Storage adapter untuk zustand `persist`.
 * Data di localStorage[tuko_v5] disimpan sebagai objek state mentah (format sama dengan
 * TUKO POS v6), sehingga data lama otomatis terbaca tanpa migrasi manual.
 */
export const tukoStorage = {
  getItem(name) {
    try {
      const raw = localStorage.getItem(name);
      if (!raw) return null;
      const p = JSON.parse(raw);
      const state = p && p.state && typeof p.version === 'number' ? p.state : p;
      return JSON.stringify({ state, version: 0 });
    } catch {
      return null;
    }
  },
  setItem(name, value) {
    try {
      localStorage.setItem(name, JSON.stringify(JSON.parse(value).state));
    } catch {
      window.dispatchEvent(new CustomEvent('tuko:storage-full'));
    }
  },
  removeItem: (name) => localStorage.removeItem(name),
};

export const pickData = (state) => Object.fromEntries(DATA_KEYS.map((k) => [k, state[k]]));

/** Pastikan bentuk data valid & isi nilai bawaan yang hilang. */
export function normalize(data) {
  const base = seedData();
  if (!data || !Array.isArray(data.menu)) return base;
  const out = { ...base, ...pickData({ ...base, ...data }) };
  ARRAY_KEYS.forEach((k) => { if (!Array.isArray(out[k])) out[k] = []; });
  if (out.dividendPct == null) out.dividendPct = 30;
  if (!out.kasirPin) out.kasirPin = '8888';
  if (!out.pin) out.pin = '1234';
  if (out.qrisImage == null) out.qrisImage = '';
  if (out.shift === undefined) out.shift = null;
  return out;
}
