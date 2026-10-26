import { cartCount, cartSubtotal, cartTotal, rp } from '../../lib/helpers';
import { useStore } from '../../store/useStore';
import { Button, Card } from '../ui';

export default function CartPanel({ shiftOn, onPay }) {
  const cart = useStore((s) => s.cart);
  const discount = useStore((s) => s.discount);
  const tableNote = useStore((s) => s.tableNote);
  const changeQty = useStore((s) => s.changeQty);
  const setDiscount = useStore((s) => s.setDiscount);
  const setTableNote = useStore((s) => s.setTableNote);
  const saveTab = useStore((s) => s.saveTab);
  const can = cart.length > 0 && shiftOn;

  return (
    <Card className="cp" id="cart">
      <div className="row" style={{ marginBottom: 10 }}><b>Keranjang</b><span className="mu">{cartCount(cart)} item</span></div>
      {cart.map((i) => (
        <div key={i.id} className="row" style={{ padding: '7px 0', borderBottom: '1px dashed var(--line)' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{i.name}</div>
            <div className="mu">{rp(i.price)}</div>
            {i.note && <div className="nt">“{i.note}”</div>}
          </div>
          <span className="row">
            <Button variant="secondary" onClick={() => changeQty(i.id, -1)}>−</Button>
            <b>{i.qty}</b>
            <Button variant="secondary" onClick={() => changeQty(i.id, 1)}>+</Button>
          </span>
        </div>
      ))}
      {!cart.length && <p className="mu" style={{ padding: 20, textAlign: 'center' }}>Keranjang kosong</p>}
      <div className="g" style={{ marginTop: 12 }}>
        <input placeholder="Nama / Meja" value={tableNote} onChange={(e) => setTableNote(e.target.value)} />
        <input type="number" min="0" placeholder="Diskon (Rp)" value={discount || ''} onChange={(e) => setDiscount(e.target.value)} />
        <div className="row"><span className="mu">Subtotal</span><span>{rp(cartSubtotal(cart))}</span></div>
        <div className="row" style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}><span>Total</span><span>{rp(cartTotal(cart, discount))}</span></div>
        <div className="row">
          <Button variant="secondary" style={{ flex: 1 }} onClick={saveTab} disabled={!can}>Simpan Tab</Button>
          <Button style={{ flex: 1 }} onClick={onPay} disabled={!can}>Bayar Sekarang</Button>
        </div>
      </div>
    </Card>
  );
}
