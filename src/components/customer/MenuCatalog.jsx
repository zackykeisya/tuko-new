import { rp, shortName } from '../../lib/helpers';
import { Badge, Card, Chip } from '../ui';

export default function MenuCatalog({ menu, category, onCategory, onAdd }) {
  const cats = ['Semua', ...new Set(menu.map((m) => m.cat))];
  const items = menu.filter((m) => category === 'Semua' || m.cat === category);
  return (
    <div className="wrap" id="menu">
      <h2 style={{ marginBottom: 10 }}>Menu</h2>
      <div className="chips">
        {cats.map((c) => <Chip key={c} active={category === c} onClick={() => onCategory(c)}>{c}</Chip>)}
      </div>
      <div className="grid">
        {items.map((m) => (
          <Card key={m.id} hover className="pc" onClick={() => onAdd(m)}>
            {m.badge && <Badge variant="accent">1 Teko</Badge>}
            <div className="lab">{shortName(m.name)}</div>
            <div className="nm">{m.name}</div>
            <div className="row"><b>{rp(m.price)}</b><span className="pl">+</span></div>
          </Card>
        ))}
        {!items.length && <p className="mu">Belum ada menu.</p>}
      </div>
    </div>
  );
}
