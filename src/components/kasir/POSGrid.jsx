import { rp, shortName } from '../../lib/helpers';
import { Badge, Card } from '../ui';

export default function POSGrid({ items, onAdd }) {
  return (
    <div className="grid">
      {items.map((m) => (
        <Card key={m.id} hover className="pc" onClick={() => onAdd(m.id)}>
          {m.badge && <Badge variant="accent">1 Teko</Badge>}
          <div className="lab">{shortName(m.name)}</div>
          <div className="nm">{m.name}</div>
          <div className="row"><b>{rp(m.price)}</b><span className="pl">+</span></div>
        </Card>
      ))}
      {!items.length && <p className="mu">Tidak ada menu.</p>}
    </div>
  );
}
