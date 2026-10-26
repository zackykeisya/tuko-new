import { rp, soldItems } from '../../lib/helpers';
import { Card, Pager, Table, usePager } from '../ui';

export default function SoldItemsTable({ trans }) {
  const { rows, pagerProps } = usePager(soldItems(trans));
  return (
    <Card scroll>
      <b>Item Terjual</b>
      <Table head={['Menu', { label: 'Qty', right: true }, { label: 'Omzet', right: true }]}>
        {rows.map((s) => <tr key={s.id}><td>{s.name}</td><td className="r">{s.qty}</td><td className="r">{rp(s.rev)}</td></tr>)}
        {!rows.length && <tr><td colSpan={3} className="mu">Belum ada</td></tr>}
      </Table>
      <Pager {...pagerProps} />
    </Card>
  );
}
