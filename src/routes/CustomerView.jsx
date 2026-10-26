import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartSheet from '../components/customer/CartSheet';
import HeroShowcase from '../components/customer/HeroShowcase';
import MenuCatalog from '../components/customer/MenuCatalog';
import PinModal from '../components/customer/PinModal';
import TableChip, { TableModal } from '../components/customer/TableChip';
import { Button } from '../components/ui';
import { useSessionTable } from '../hooks/useSessionTable';
import { useToast } from '../hooks/useToast';
import { cartCount, cartSubtotal, iso, now, rp, tableLabel } from '../lib/helpers';
import { useStore } from '../store/useStore';
import '../styles/customer.css';

export default function CustomerView() {
  const navigate = useNavigate();
  const toast = useToast();
  const menu = useStore((s) => s.menu);
  const addTab = useStore((s) => s.addTab);
  const addLog = useStore((s) => s.addLog);
  const { session, setSession } = useSessionTable();

  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState('Semua');
  const [cartOpen, setCartOpen] = useState(false);
  const [editTable, setEditTable] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [done, setDone] = useState(null);

  const active = useMemo(() => menu.filter((m) => m.active !== false), [menu]);
  const showcase = useMemo(() => {
    const b = active.filter((m) => m.badge);
    return (b.length ? b : active).slice(0, 4);
  }, [active]);

  const add = (m) => {
    setCart((c) => (c.find((x) => x.id === m.id)
      ? c.map((x) => (x.id === m.id ? { ...x, qty: x.qty + 1 } : x))
      : [...c, { id: m.id, name: m.name, price: m.price, cat: m.cat, hpp: 0, badge: m.badge, active: true, qty: 1, note: '' }]));
    toast('+ ' + m.name);
  };
  const qty = (id, d) => setCart((c) => c.map((x) => (x.id === id ? { ...x, qty: x.qty + d } : x)).filter((x) => x.qty > 0));
  const note = (id, v) => setCart((c) => c.map((x) => (x.id === id ? { ...x, note: v } : x)));

  const send = () => {
    if (!cart.length) return;
    if (!session) { setCartOpen(false); return; }
    const items = cart.map((i) => ({ ...i, note: i.note.trim() }));
    const tab = {
      id: Date.now(), items, table: tableLabel(session), tableNo: session.tableNo, customerName: session.customerName,
      total: cartSubtotal(items), ts: now(), tsRaw: iso(), source: 'self-order', status: 'Belum Dibayar',
    };
    addTab(tab);
    addLog(`Self-order ${tab.table} ${rp(tab.total)}`);
    setDone(tab);
    setCart([]);
    setCartOpen(false);
  };

  const onStaff = (role) => navigate(role === 'admin' ? '/admin' : '/kasir/pos');

  if (done) {
    return (
      <div className="wrap done">
        <div style={{ fontSize: 60 }}>✅</div>
        <h2 style={{ margin: '10px 0' }}>Pesanan terkirim!</h2>
        <p className="mu" style={{ marginBottom: 18 }}>{done.table} · {rp(done.total)} · Menunggu pembayaran di kasir.</p>
        <Button onClick={() => setDone(null)}>Pesan lagi</Button>
      </div>
    );
  }

  const n = cartCount(cart);
  return (
    <>
      <header className="hd">
        <b style={{ fontSize: 20, color: 'var(--primary)' }}>
          TUKO <span className="mu" style={{ fontWeight: 500 }}>Tuangin · Puterin · Nikmatin</span>
        </b>
        <span className="row">
          <TableChip session={session} onClick={() => setEditTable(true)} />
          <Button variant="secondary" title="Staff" aria-label="Akses staff" onClick={() => setPinOpen(true)}>🔒</Button>
        </span>
      </header>

      <HeroShowcase items={showcase} />
      <MenuCatalog menu={active} category={category} onCategory={setCategory} onAdd={add} />

      {n > 0 && <button type="button" className="fab" onClick={() => setCartOpen(true)}>🛒 {n} · {rp(cartSubtotal(cart))}</button>}

      {cartOpen && (
        <CartSheet cart={cart} tableText={tableLabel(session)} onQty={qty} onNote={note} onSend={send} onClose={() => setCartOpen(false)} />
      )}
      {(!session || editTable) && (
        <TableModal
          initial={session} required={!session}
          onSubmit={(s) => { setSession(s); setEditTable(false); }}
          onClose={() => setEditTable(false)}
        />
      )}
      {pinOpen && <PinModal mode="staff" onSuccess={onStaff} onClose={() => setPinOpen(false)} />}
    </>
  );
}
