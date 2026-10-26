import { rp } from '../../lib/helpers';
import { Badge, Button, Card, EmptyState } from '../ui';

export default function TabList({ tabs, onResume }) {
  if (!tabs.length) {
    return <EmptyState icon="📋" title="Belum ada tab">Pesanan self-order pembeli muncul di sini.</EmptyState>;
  }
  return tabs.map((t) => {
    const notes = t.items.filter((i) => i.note);
    return (
      <Card key={t.id} className="row wr" style={t.source === 'self-order' ? { borderLeft: '4px solid var(--blue)' } : undefined}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <b>{t.table}</b> {t.source === 'self-order' && <Badge variant="self">⚡ SELF-ORDER</Badge>}
          <div className="mu">{t.items.reduce((a, i) => a + i.qty, 0)} item · {t.ts}</div>
          <div className="mu">{t.items.map((i) => `${i.qty}x ${i.name}`).join(', ')}</div>
          {notes.map((i, k) => <div key={k} className="nt">📝 {i.name}: {i.note}</div>)}
        </div>
        <div style={{ textAlign: 'right' }}>
          <b style={{ fontSize: 17, color: 'var(--primary)' }}>{rp(t.total)}</b><br />
          <Button style={{ marginTop: 6 }} onClick={() => onResume(t.id)}>Lanjutkan</Button>
        </div>
      </Card>
    );
  });
}
