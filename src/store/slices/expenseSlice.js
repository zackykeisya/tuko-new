import { iso, now } from '../../lib/helpers';

export const createExpenseSlice = (set, get) => ({
  expenses: [],
  /** Hanya bisa dicatat saat shift aktif. */
  addExpense: ({ desc, amount, cat }) => {
    const { shift } = get();
    if (!shift) return false;
    set((s) => ({
      expenses: [...s.expenses, { id: Date.now(), desc, amount, cat, ts: now(), tsRaw: iso(), shiftId: shift.id, shiftName: shift.name }],
    }));
    get().addLog('Pengeluaran ' + desc);
    return true;
  },
  updateExpense: (id, patch) => set((s) => ({ expenses: s.expenses.map((e) => (e.id === id ? { ...e, ...patch } : e)) })),
  deleteExpense: (id) => set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),
});
