import { useMemo, useState } from 'react';
import CartPanel from '../../components/kasir/CartPanel';
import PaymentModal from '../../components/kasir/PaymentModal';
import POSGrid from '../../components/kasir/POSGrid';
import ReceiptModal from '../../components/kasir/ReceiptModal';
import { OpenShiftModal } from '../../components/kasir/ShiftPanel';
import { Button, Chip } from '../../components/ui';
import { useShift } from '../../hooks/useShift';
import { useToast } from '../../hooks/useToast';
import { cartCount, cartTotal, rp } from '../../lib/helpers';
import { useStore } from '../../store/useStore';

export default function POSView() {
  const toast = useToast();
  const menu = useStore((s) => s.menu);
  const cart = useStore((s) => s.cart);
  const discount = useStore((s) => s.discount);
  const addToCart = useStore((s) => s.addToCart);
  const checkout = useStore((s) => s.checkout);
  const { active } = useShift();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('Semua');
  const [paying, setPaying] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [opening, setOpening] = useState(false);

  const available = useMemo(() => menu.filter((m) => m.active !== false), [menu]);
  const cats = ['Semua', ...new Set(available.map((m) => m.cat))];
  const items = available.filter((m) => (cat === 'Semua' || m.cat === cat) && m.name.toLowerCase().includes(q.toLowerCase()));
  const total = cartTotal(cart, discount);
  const n = cartCount(cart);

  const add = (id) => { if (!addToCart(id)) toast('Buka shift dulu'); };
  const pay = (method, cash) => { setReceipt(checkout(method, cash)); setPaying(false); };

  return (
    <>
      {!active && (
        <div className="warn"><span>⚠️ Shift belum dibuka. Buka shift untuk mulai transaksi.</span><Button onClick={() => setOpening(true)}>Buka Shift</Button></div>
      )}
      <div className="lay">
        <div>
          <input placeholder="🔍 Cari menu..." value={q} onChange={(e) => setQ(e.target.value)} style={{ marginBottom: 10 }} />
          <div className="chips">{cats.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}</div>
          <POSGrid items={items} onAdd={add} />
        </div>
        <CartPanel shiftOn={active} onPay={() => setPaying(true)} />
      </div>
      {n > 0 && (
        <button type="button" className="bar" onClick={() => document.getElementById('cart')?.scrollIntoView({ behavior: 'smooth' })}>
          <span>🛒 {n} item</span><span>{rp(total)}</span>
        </button>
      )}
      {paying && <PaymentModal total={total} onClose={() => setPaying(false)} onConfirm={pay} />}
      {receipt && <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />}
      {opening && <OpenShiftModal onClose={() => setOpening(false)} />}
    </>
  );
}
