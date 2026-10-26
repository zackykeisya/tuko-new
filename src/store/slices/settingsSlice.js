import { ROLE_KEY } from '../../lib/constants';
import { seedMenu } from '../../lib/seed';
import { normalize, pickData } from '../../lib/storage';

const readRole = () => {
  try { return sessionStorage.getItem(ROLE_KEY) || null; } catch { return null; }
};

const RESETTABLE = ['trans', 'expenses', 'shiftHistory', 'tabs', 'log', 'tables'];

export const createSettingsSlice = (set, get) => ({
  pin: '1234',
  kasirPin: '8888',
  dividendPct: 30,
  qrisImage: '',
  role: readRole(), // 'kasir' | 'admin' | null  (tidak dipersist ke tuko_v5)

  /** @returns {'admin'|'kasir'|null} */
  login: (value, staffMode) => {
    const s = get();
    let role = null;
    if (value === s.pin) role = 'admin';
    else if (staffMode && value === s.kasirPin) role = 'kasir';
    if (role) {
      try { sessionStorage.setItem(ROLE_KEY, role); } catch { /* abaikan */ }
      set({ role });
      get().addLog('Login ' + (role === 'admin' ? 'Admin' : 'Kasir'));
    }
    return role;
  },
  setRole: (role) => {
    try { role ? sessionStorage.setItem(ROLE_KEY, role) : sessionStorage.removeItem(ROLE_KEY); } catch { /* abaikan */ }
    set({ role });
  },
  setDividend: (v) => set({ dividendPct: v }),
  setQris: (img) => set({ qrisImage: img }),
  setPins: ({ pin, kasirPin }) => set({ pin, kasirPin }),

  replaceData: (data) => set(normalize({ ...pickData(get()), ...data })),
  resetSelective: (keys, resetMenu) => {
    const patch = {};
    keys.forEach((k) => { if (RESETTABLE.includes(k)) patch[k] = []; });
    if (resetMenu) patch.menu = seedMenu();
    set(patch);
  },
});
