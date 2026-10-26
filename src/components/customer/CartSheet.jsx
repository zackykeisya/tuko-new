import { cartSubtotal, rp } from '../../lib/helpers';
import { Button, Modal } from '../ui';

export default function CartSheet({ cart, tableText, onQty, onNote, onSend, onClose }) {
  return (
    <Modal sheet onClose={onClose}>
      <div className="row" style={{ marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Keranjang · {tableText || 'Meja ?'}</h3>
        <Button variant="secondary" onClick={onClose} aria-label="Tutup">✕</Button>
      </div>
      {cart.map((i) => (
        <div key={i.id} className="card row" style={{ alignItems: 'flex-start', padding: 12, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <b>{i.name}</b>
            <div className="mu">{rp(i.price)} × {i.qty} = {rp(i.price * i.qty)}</div>
            <input style={{ marginTop: 6, fontSize: 12 }} placeholder="Catatan (mis. es sedikit)" value={i.note} onChange={(e) => onNote(i.id, e.target.value)} />
          </div>
          <div className="row" style={{ flexDirection: 'column' }}>
            <Button variant="secondary" onClick={() => onQty(i.id, 1)}>+</Button>
            <b>{i.qty}</b>
            <Button variant="secondary" onClick={() => onQty(i.id, -1)}>−</Button>
          </div>
        </div>
      ))}
      {!cart.length && <p className="mu">Keranjang kosong</p>}
      <div className="row" style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)', margin: '10px 0' }}>
        <span>Total</span><span>{rp(cartSubtotal(cart))}</span>
      </div>
      <Button style={{ width: '100%', padding: 14 }} onClick={onSend} disabled={!cart.length}>Kirim Pesanan ke Kasir</Button>
    </Modal>
  );
}
