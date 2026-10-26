import { useState } from 'react';
import { rp } from '../../lib/helpers';
import { useShift } from '../../hooks/useShift';
import { useToast } from '../../hooks/useToast';
import { useStore } from '../../store/useStore';
import { Button, Card, Input, Modal, ModalActions, StatCard } from '../ui';

export function OpenShiftModal({ onClose }) {
  const toast = useToast();
  const openShift = useStore((s) => s.openShift);
  const cashierName = useStore((s) => s.cashierName);
  const [name, setName] = useState('Shift - ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
  const [kasir, setKasir] = useState(cashierName || '');
  const [modal, setModal] = useState('');

  const submit = () => {
    if (!name.trim() || !kasir.trim() || !(+modal > 0)) return toast('Lengkapi nama, kasir & modal awal');
    openShift({ name: name.trim(), cashierName: kasir.trim(), openingCash: +modal });
    toast('Shift dibuka');
    return onClose();
  };
  return (
    <Modal onClose={onClose}>
      <h3>🕐 Buka Shift Baru</h3>
      <Input label="Nama shift" value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="Nama kasir" value={kasir} onChange={(e) => setKasir(e.target.value)} />
      <Input label="Modal awal laci (Rp)" type="number" min="0" value={modal} onChange={(e) => setModal(e.target.value)} />
      <ModalActions onCancel={onClose} onOk={submit} okText="Mulai Shift" />
    </Modal>
  );
}

export function CloseShiftModal({ onClose, onClosed }) {
  const toast = useToast();
  const closeShift = useStore((s) => s.closeShift);
  const { shift, cash, exp, expected } = useShift();
  const [actual, setActual] = useState('');
  const [note, setNote] = useState('');
  const variance = (+actual || 0) - expected;

  const submit = () => {
    if (variance && !note.trim()) return toast('Isi catatan selisih');
    const r = closeShift({ actualCash: +actual || 0, note: note.trim() });
    return r && onClosed(r);
  };
  if (!shift) return null;
  return (
    <Modal onClose={onClose}>
      <h3>🔒 Tutup Shift</h3>
      <Card style={{ padding: 12 }}>
        <div className="row"><span>Modal</span><span>{rp(shift.openingCash)}</span></div>
        <div className="row"><span>Cash sales</span><span>+{rp(cash)}</span></div>
        <div className="row"><span>Pengeluaran</span><span>−{rp(exp)}</span></div>
        <div className="row"><b>Kas diharapkan</b><b>{rp(expected)}</b></div>
      </Card>
      <Input label="Uang fisik setoran (Rp)" type="number" min="0" value={actual} onChange={(e) => setActual(e.target.value)} />
      <div className="row"><span>Selisih</span><b className={variance ? 'rd' : 'gr'}>{variance > 0 ? '+' : ''}{rp(variance)}</b></div>
      {variance !== 0 && <Input label="Catatan selisih" as="textarea" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />}
      <ModalActions onCancel={onClose} onOk={submit} okText="Konfirmasi" />
    </Modal>
  );
}

export function ShiftDetailModal({ record: r, onClose }) {
  const rows = [['Modal Awal', r.openingCash], ['Cash Sales', r.cashSales], ['QRIS Sales', r.qrisSales], ['Pengeluaran', r.expenseTotal],
    ['Kas Diharapkan', r.expectedCash], ['Uang Setoran', r.actualCash], ['Selisih', r.variance], ['Laba Bersih', r.netProfit]];
  return (
    <Modal onClose={onClose}>
      <h3>Detail Shift</h3>
      <b>{r.name}</b>
      <div className="mu" style={{ marginBottom: 10 }}>{r.cashierName} · {r.startedAtLabel} → {r.closedAtLabel}</div>
      <div className="g">{rows.map(([l, v]) => <div key={l} className="row"><span>{l}</span><b>{rp(v)}</b></div>)}</div>
      {r.note && <p className="nt" style={{ marginTop: 8 }}>{r.note}</p>}
      <div className="row" style={{ marginTop: 16 }}><Button style={{ width: '100%' }} onClick={onClose}>Selesai</Button></div>
    </Modal>
  );
}

export default function ShiftPanel() {
  const { shift, trans, cash, qris, exp, gross, expected } = useShift();
  const [closing, setClosing] = useState(false);
  const [detail, setDetail] = useState(null);
  if (!shift) return null;
  const mn = Math.floor((Date.now() - new Date(shift.startedAt)) / 60000);
  return (
    <>
      <Card style={{ borderLeft: '4px solid var(--primary)' }}>
        <span className="tag gr">● AKTIF</span>
        <h3 style={{ margin: '6px 0' }}>{shift.name}</h3>
        <div className="mu">Kasir: {shift.cashierName} · Durasi {Math.floor(mn / 60)}j {mn % 60}m</div>
        <div className="g" style={{ marginTop: 12 }}>
          <div className="row"><span>Modal Awal</span><span>{rp(shift.openingCash)}</span></div>
          <div className="row"><span>Penjualan Tunai</span><span>+{rp(cash)}</span></div>
          <div className="row"><span>Penjualan QRIS</span><span>{rp(qris)}</span></div>
          <div className="row"><span>Pengeluaran</span><span>−{rp(exp)}</span></div>
          <div className="row" style={{ fontWeight: 800, fontSize: 16, color: 'var(--primary)', borderTop: '2px dashed var(--line)', paddingTop: 8 }}>
            <span>Kas Diharapkan</span><span>{rp(expected)}</span>
          </div>
        </div>
      </Card>
      <div className="stats">
        <StatCard label="Transaksi" value={trans.length} />
        <StatCard label="Pengeluaran" value={rp(exp)} tone="rd" />
        <StatCard label="Omzet Shift" value={rp(gross)} />
        <StatCard label="Laba Bersih" value={rp(gross - exp)} tone="gr" />
      </div>
      <Button style={{ width: '100%', padding: 15 }} onClick={() => setClosing(true)}>🔒 Tutup Shift &amp; Setor Uang</Button>
      {closing && <CloseShiftModal onClose={() => setClosing(false)} onClosed={(r) => { setClosing(false); setDetail(r); }} />}
      {detail && <ShiftDetailModal record={detail} onClose={() => setDetail(null)} />}
    </>
  );
}
