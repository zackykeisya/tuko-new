import { calcShift, iso, now } from '../../lib/helpers';

export const createShiftSlice = (set, get) => ({
  shift: null,
  shiftHistory: [],
  cashierName: 'Kasir 1',
  openShift: ({ name, cashierName, openingCash }) => {
    set({
      shift: { id: 'SH-' + Date.now(), name, cashierName, startedAt: iso(), startedAtLabel: now(), openingCash, status: 'active' },
      cashierName,
    });
    get().addLog(`Shift dibuka ${name}`);
  },
  closeShift: ({ actualCash, note }) => {
    const s = get();
    if (!s.shift) return null;
    const c = calcShift(s);
    const r = {
      id: s.shift.id, name: s.shift.name, cashierName: s.shift.cashierName,
      startedAt: s.shift.startedAt, startedAtLabel: s.shift.startedAtLabel,
      closedAt: iso(), closedAtLabel: now(), openingCash: s.shift.openingCash,
      cashSales: c.cash, qrisSales: c.qris, expenseTotal: c.exp,
      grossRevenue: c.gross, netProfit: c.gross - c.exp, expectedCash: c.expected,
      actualCash, variance: actualCash - c.expected, note, transCount: c.trans.length,
    };
    set((st) => ({ shiftHistory: [r, ...st.shiftHistory], shift: null, cart: [], discount: 0, tableNote: '' }));
    get().addLog('Shift ditutup');
    return r;
  },
});
