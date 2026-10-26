import { rp, sum } from '../../lib/helpers';
import { useStore } from '../../store/useStore';
import { Card, Slider, StatCard } from '../ui';

export default function MonthlySummary({ months, month, onMonth, trans, expenses }) {
  const dividendPct = useStore((s) => s.dividendPct);
  const setDividend = useStore((s) => s.setDividend);
  const omzet = sum(trans, (t) => t.total);
  const by = (k) => sum(expenses.filter((e) => e.cat === k), (e) => e.amount);
  const laba = omzet - sum(expenses, (e) => e.amount);

  return (
    <Card>
      <div className="row wr">
        <b>Ringkasan Bulanan</b>
        <select style={{ width: 'auto' }} value={month} onChange={(e) => onMonth(e.target.value)}>
          {months.map((m) => <option key={m} value={m}>{m}</option>)}
          {!months.length && <option>-</option>}
        </select>
      </div>
      <div className="stats" style={{ marginTop: 10 }}>
        <StatCard label="Omzet" value={rp(omzet)} />
        <StatCard label="Bahan Baku" value={rp(by('bahan'))} tone="o" />
        <StatCard label="Operasional" value={rp(by('ops'))} tone="bl" />
        <StatCard label="Lainnya" value={rp(by('lainnya'))} tone="pu" />
        <StatCard label="Laba" value={rp(laba)} tone={laba >= 0 ? 'gr' : 'rd'} />
      </div>
      <div className="mu">Dividen: <b>{dividendPct}%</b> = <b>{rp(Math.max(0, laba) * dividendPct / 100)}</b></div>
      <Slider value={dividendPct} onChange={setDividend} aria-label="Persentase dividen" />
    </Card>
  );
}
