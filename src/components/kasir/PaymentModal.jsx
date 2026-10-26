import { useState } from 'react';
import { rp } from '../../lib/helpers';
import { useStore } from '../../store/useStore';
import { Chip, Modal, ModalActions } from '../ui';

export default function PaymentModal({ total, onClose, onConfirm }) {
  const qrisImage = useStore((s) => s.qrisImage);
  const [method, setMethod] = useState('cash');
  const [cash, setCash] = useState(0);
  const ok = method === 'qris' || cash >= total;
  const quick = [total, 20000, 50000, 100000].filter((v, i, a) => a.indexOf(v) === i && v >= total);

  return (
    <Modal onClose={onClose}>
      <h3>💳 Pembayaran</h3>
      <div style={{ background: 'var(--primary)', color: '#fff', borderRadius: 14, padding: 16, textAlign: 'center', marginBottom: 12 }}>
        <div className="mu" style={{ color: '#fff' }}>Total Tagihan</div>
        <div style={{ fontSize: 30, fontWeight: 800 }}>{rp(total)}</div>
      </div>
      <div className="row" style={{ marginBottom: 12 }}>
        <Chip active={method === 'cash'} style={{ flex: 1 }} onClick={() => setMethod('cash')}>💵 Tunai</Chip>
        <Chip active={method === 'qris'} style={{ flex: 1 }} onClick={() => setMethod('qris')}>📱 QRIS</Chip>
      </div>
      {method === 'cash' ? (
        <>
          <input type="number" min="0" placeholder="Uang diterima" value={cash || ''} onChange={(e) => setCash(+e.target.value || 0)} />
          <div className="chips" style={{ paddingTop: 10 }}>
            {quick.map((v) => <Chip key={v} onClick={() => setCash(v)}>{rp(v)}</Chip>)}
          </div>
          <div className={ok ? 'gr' : 'rd'} style={{ textAlign: 'center', fontSize: 20, fontWeight: 800, marginTop: 6 }}>
            {ok ? 'Kembalian ' : 'Kurang '}{rp(Math.abs(cash - total))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          {qrisImage
            ? <img src={qrisImage} alt="QRIS" style={{ maxHeight: 280, margin: '0 auto 8px', borderRadius: 12 }} />
            : <p className="mu">Gambar QRIS belum diunggah (Admin → Pengaturan).</p>}
          <p>Nominal: <b>{rp(total)}</b></p>
        </div>
      )}
      <ModalActions onCancel={onClose} okText="Konfirmasi" okDisabled={!ok} onOk={() => onConfirm(method, method === 'cash' ? cash : total)} />
    </Modal>
  );
}
