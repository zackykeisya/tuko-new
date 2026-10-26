import { useState } from 'react';
import { rp } from '../../lib/helpers';
import { useStore } from '../../store/useStore';
import ReceiptModal from '../kasir/ReceiptModal';
import { Button, Card } from '../ui';

/** Riwayat transaksi terakhir + log aktivitas. */
export default function ActivityLog() {
  const trans = useStore((s) => s.trans);
  const log = useStore((s) => s.log);
  const [receipt, setReceipt] = useState(null);
  return (
    <>
      <Card>
        <b>Riwayat Transaksi</b>
        {[...trans].reverse().slice(0, 15).map((t) => (
          <div key={t.id} className="row" style={{ padding: '7px 0', borderBottom: '1px dashed var(--line)' }}>
            <span className="mu">{t.ts} · {t.table || '-'} · {t.method}</span>
            <span><b>{rp(t.total)}</b> <Button variant="secondary" onClick={() => setReceipt(t)}>Struk</Button></span>
          </div>
        ))}
        {!trans.length && <p className="mu">Belum ada transaksi.</p>}
      </Card>
      <Card>
        <b>Log Aktivitas</b>
        {log.slice(0, 12).map((l, i) => <div key={i} className="mu">{l.ts} — {l.a}</div>)}
        {!log.length && <p className="mu">Kosong</p>}
      </Card>
      {receipt && <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />}
    </>
  );
}
