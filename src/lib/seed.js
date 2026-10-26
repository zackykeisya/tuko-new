const mk = (id, name, price, cat, badge) => ({ id, name, price, hpp: 0, cat, badge, active: true });

export const seedMenu = () => [
  mk(1, 'Tuko Original (1 Teko)', 13000, 'Teh/Teko', true),
  mk(2, 'Tuko Leci (1 Teko)', 16000, 'Teh/Teko', true),
  mk(3, 'Tuko Lemon (1 Teko)', 16000, 'Teh/Teko', true),
  mk(4, 'Tuko Beer (1 Teko)', 18000, 'Teh/Teko', true),
  mk(5, 'Sate Telur Puyuh', 4000, 'Sate-satean', false),
  mk(6, 'Sate Ati Ampela', 3000, 'Sate-satean', false),
  mk(7, 'Kopi Tubruk', 12000, 'Kopi', false),
  mk(8, 'Aneka Gorengan (5pcs)', 15000, 'Gorengan', false),
];

export const seedData = () => ({
  pin: '1234', kasirPin: '8888', shift: null, shiftHistory: [], cashierName: 'Kasir 1',
  dividendPct: 30, qrisImage: '', menu: seedMenu(), cart: [], tableNote: '', discount: 0,
  tabs: [], expenses: [], trans: [], log: [], tables: [],
});
