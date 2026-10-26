import { rp } from '../../lib/helpers';
import { Button, Modal } from '../ui';

const hr = <hr style={{ margin: '8px 0', borderTop: '1px dashed #999' }} />;

export default function ReceiptModal({ receipt: r, onClose }) {
  return (
    <Modal onClose={onClose}>
      <div id="rc" className="rc-box">
        <div style={{ textAlign: 'center' }}>
          <b style={{ fontSize: 16 }}>TUKO</b><br />Tuangin · Puterin · Nikmatin<br />{r.ts}<br />
          Kasir: {r.cashier || '-'} · {r.table || '-'}
        </div>
        {hr}
        {r.items.map((i, k) => <div key={k} className="row"><span>{i.qty}x {i.name}</span><span>{rp(i.price * i.qty)}</span></div>)}
        {hr}
        {r.discount ? <div className="row"><span>Diskon</span><span>−{rp(r.discount)}</span></div> : null}
        <div className="row"><b>TOTAL</b><b>{rp(r.total)}</b></div>
        <div className="row"><span>Bayar ({r.method})</span><span>{rp(r.cash)}</span></div>
        <div className="row"><span>Kembali</span><span>{rp(r.cash - r.total)}</span></div>
        <p style={{ textAlign: 'center', marginTop: 10 }}>Terima kasih! 🙏</p>
      </div>
      <div className="row" style={{ marginTop: 14 }}>
        <Button variant="secondary" style={{ flex: 1 }} onClick={onClose}>Tutup</Button>
        <Button style={{ flex: 1 }} onClick={() => window.print()}>🖨 Cetak</Button>
      </div>
    </Modal>
  );
}
