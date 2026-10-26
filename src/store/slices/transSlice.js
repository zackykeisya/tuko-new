import { cartTotal, iso, now } from '../../lib/helpers';

export const createTransSlice = (set, get) => ({
  trans: [],
  cart: [],
  discount: 0,
  tableNote: '',

  addToCart: (id) => {
    const s = get();
    if (!s.shift) return false;
    const m = s.menu.find((x) => x.id === id);
    if (!m) return false;
    set((st) => ({
      cart: st.cart.find((c) => c.id === id)
        ? st.cart.map((c) => (c.id === id ? { ...c, qty: c.qty + 1 } : c))
        : [...st.cart, { ...m, qty: 1 }],
    }));
    return true;
  },
  changeQty: (id, d) => set((s) => ({
    cart: s.cart.map((c) => (c.id === id ? { ...c, qty: c.qty + d } : c)).filter((c) => c.qty > 0),
  })),
  setDiscount: (v) => set({ discount: Math.max(0, +v || 0) }),
  setTableNote: (v) => set({ tableNote: v }),

  saveTab: () => {
    const s = get();
    if (!s.cart.length) return;
    s.addTab({
      id: Date.now(), items: s.cart.map((i) => ({ ...i })), table: s.tableNote || 'Meja',
      total: cartTotal(s.cart, s.discount), ts: now(), tsRaw: iso(), source: 'kasir', status: 'Belum Dibayar',
    });
    set({ cart: [], discount: 0, tableNote: '' });
  },
  resumeTab: (id) => {
    const s = get();
    const t = s.tabs.find((x) => x.id === id);
    if (!t || !s.shift) return false;
    set({ cart: t.items.map((i) => ({ ...i })), tableNote: t.table });
    s.removeTab(id);
    return true;
  },
  checkout: (method, cash) => {
    const s = get();
    const total = cartTotal(s.cart, s.discount);
    const t = {
      id: Date.now(), items: s.cart.map((i) => ({ ...i })), total, discount: s.discount, method,
      cash: cash || total, ts: now(), tsRaw: iso(), table: s.tableNote, cashier: s.cashierName,
      shiftId: s.shift.id, shiftName: s.shift.name,
    };
    set((st) => ({ trans: [...st.trans, t], cart: [], discount: 0, tableNote: '' }));
    get().addLog(`Order ${total} (${method})`);
    return t;
  },
});
