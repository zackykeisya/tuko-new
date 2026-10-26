export const STORAGE_KEY = 'tuko_v5';
export const SESSION_KEY = 'tuko_session_table';
export const ROLE_KEY = 'tuko_role';
export const BASE_URL = 'https://tuko-inky.vercel.app';
export const tableUrl = (no) => `${BASE_URL}/pemesanan/meja/${encodeURIComponent(no)}`;

export const EXPENSE_CATS = { bahan: 'Bahan Baku', ops: 'Operasional', lainnya: 'Lainnya' };
export const HERO_BG = ['#EEF3EF', '#FDF3D6', '#F8EBD3', '#EAF0EC'];

// Field yang disimpan ke localStorage (key tunggal `tuko_v5`)
export const DATA_KEYS = [
  'pin', 'kasirPin', 'shift', 'shiftHistory', 'cashierName', 'dividendPct', 'qrisImage',
  'menu', 'cart', 'tableNote', 'discount', 'tabs', 'expenses', 'trans', 'log', 'tables',
];
export const ARRAY_KEYS = ['shiftHistory', 'tabs', 'expenses', 'trans', 'log', 'cart', 'tables'];
