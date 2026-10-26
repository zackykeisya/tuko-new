import { dayOf, rp, sum } from '../../lib/helpers';
import { Card, Table } from '../ui';

export default function DailyBreakdownTable({ days, trans, expenses }) {
  return (
    <Card scroll>
      <b>Rincian Per Tanggal</b>
      <Table head={['Tanggal', { label: 'Omzet', right: true }, { label: 'Cash', right: true }, { label: 'QRIS', right: true }, { label: 'Pengeluaran', right: true }, { label: 'Laba', right: true }]}>
        {days.map((d) => {
          const t = trans.filter((x) => dayOf(x) === d);
          const o = sum(t, (x) => x.total);
          const x = sum(expenses.filter((e) => dayOf(e) === d), (e) => e.amount);
          return (
            <tr key={d}>
              <td>{d}</td><td className="r">{rp(o)}</td>
              <td className="r">{rp(sum(t.filter((z) => z.method === 'cash'), (z) => z.total))}</td>
              <td className="r">{rp(sum(t.filter((z) => z.method === 'qris'), (z) => z.total))}</td>
              <td className="r rd">{rp(x)}</td><td className="r"><b>{rp(o - x)}</b></td>
            </tr>
          );
        })}
        {!days.length && <tr><td colSpan={6} className="mu">Belum ada data</td></tr>}
      </Table>
    </Card>
  );
}
