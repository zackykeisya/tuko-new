export const rp = (n) => 'Rp' + Math.round(n || 0).toLocaleString('id-ID');
export const now = () => new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
export const iso = () => new Date().toISOString();
export const sum = (a, f) => a.reduce((x, y) => x + f(y), 0);
export const dayOf = (t) => (t.tsRaw || '').slice(0, 10);
export const shortName = (n) => {
  const t = String(n).replace(/\(.*?\)/g, '').trim();
  return t.length <= 10 ? t : t.split(' ').slice(0, 2).join(' ');
};

export const padTable = (v) => {
  const s = String(v).trim();
  return /^\d+$/.test(s) ? s.padStart(2, '0') : s;
};

/** Parser input meja manual: "3 - Ciki", "3-Ciki", "3 Ciki", "3" */
export function parseTableInput(input) {
  const m = String(input || '').match(/^\s*([A-Za-z0-9]+)\s*(?:[-–]\s*)?(.*)$/);
  if (!m) return null;
  return { tableNo: padTable(m[1]), customerName: m[2].trim() };
}

export const tableLabel = (s) => (s ? `Meja ${s.tableNo}${s.customerName ? ' - ' + s.customerName : ''}` : '');

export const cartSubtotal = (cart) => sum(cart, (i) => i.price * i.qty);
export const cartTotal = (cart, discount) => Math.max(0, cartSubtotal(cart) - (discount || 0));
export const cartCount = (cart) => sum(cart, (i) => i.qty);

/** Ringkasan keuangan untuk shift yang sedang aktif. */
export function calcShift({ shift, trans, expenses }) {
  const active = !!shift && shift.status === 'active';
  const t = active ? trans.filter((x) => x.shiftId === shift.id) : [];
  const e = active ? expenses.filter((x) => x.shiftId === shift.id) : [];
  const cash = sum(t.filter((x) => x.method === 'cash'), (x) => x.total);
  const qris = sum(t.filter((x) => x.method === 'qris'), (x) => x.total);
  const exp = sum(e, (x) => x.amount);
  return {
    active, trans: t, expenses: e, cash, qris, exp,
    gross: sum(t, (x) => x.total),
    expected: active ? shift.openingCash + cash - exp : 0,
  };
}

export function soldItems(trans) {
  const a = {};
  trans.forEach((t) => t.items.forEach((i) => {
    const o = a[i.id] || (a[i.id] = { id: i.id, name: i.name, qty: 0, rev: 0 });
    o.qty += i.qty;
    o.rev += i.qty * i.price;
  }));
  return Object.values(a).sort((x, y) => y.qty - x.qty);
}
