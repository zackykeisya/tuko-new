import { useState } from 'react';
import { rp, sum } from '../../lib/helpers';
import { useStore } from '../../store/useStore';
import { ShiftDetailModal } from '../kasir/ShiftPanel';
import { Button, Card, StatCard } from '../ui';

export default function ShiftHistory() {
  const history = useStore((s) => s.shiftHistory);
  const [date, setDate] = useState('');
  const [kasir, setKasir] = useState('');
  const [detail, setDetail] = useState(null);
  const names = [...new Set(history.map((s) => s.cashierName))];
  const rows = history.filter((s) => (!date || (s.startedAt || '').slice(0, 10) === date) && (!kasir || s.cashierName === kasir));
  const variance = sum(rows, (s) => s.variance);

  return (
    <Card>
      <div className="row wr">
        <b>Riwayat Shift</b>
        <span className="row">
          <input type="date" style={{ width: 'auto' }} value={date} onChange={(e) => setDate(e.target.value)} />
          <select style={{ width: 'auto' }} value={kasir} onChange={(e) => setKasir(e.target.value)}>
            <option value="">Semua kasir</option>
            {names.map((k) => <option key={k}>{k}</option>)}
          </select>
        </span>
      </div>
      <div className="stats" style={{ marginTop: 10 }}>
        <StatCard label="Jumlah Shift" value={rows.length} />
        <StatCard label="Omzet" value={rp(sum(rows, (s) => s.grossRevenue))} />
        <StatCard label="Laba" value={rp(sum(rows, (s) => s.netProfit))} />
        <StatCard label="Total Selisih" value={rp(variance)} tone={variance < 0 ? 'rd' : 'gr'} />
      </div>
      {rows.map((s) => (
        <Card key={s.id} style={{ margin: '8px 0' }}>
          <div className="row"><b>{s.name}</b><Button variant="secondary" onClick={() => setDetail(s)}>Detail</Button></div>
          <div className="mu">{s.cashierName} · {s.startedAtLabel} → {s.closedAtLabel}</div>
          <div className="row wr mu" style={{ marginTop: 6 }}>
            <span>Modal {rp(s.openingCash)}</span><span>Cash {rp(s.cashSales)}</span><span>QRIS {rp(s.qrisSales)}</span>
            <span>Keluar {rp(s.expenseTotal)}</span><span>Setor {rp(s.actualCash)}</span>
            <span className={s.variance ? 'rd' : 'gr'}>Selisih {rp(s.variance)}</span>
          </div>
          {s.note && <div className="nt">{s.note}</div>}
        </Card>
      ))}
      {!rows.length && <p className="mu">Belum ada riwayat shift.</p>}
      {detail && <ShiftDetailModal record={detail} onClose={() => setDetail(null)} />}
    </Card>
  );
}
