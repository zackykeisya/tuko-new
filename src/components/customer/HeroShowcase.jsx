import { useEffect, useState } from 'react';
import { HERO_BG } from '../../lib/constants';
import { rp, shortName } from '../../lib/helpers';
import { Badge } from '../ui';

export default function HeroShowcase({ items }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => i + 1), 4000);
    return () => clearInterval(t);
  }, []);

  const i = items.length ? idx % items.length : 0;
  const m = items[i] || { name: 'TUKO', price: 0 };

  return (
    <section className="hero" style={{ background: HERO_BG[i % HERO_BG.length] }}>
      <div>
        <h1>Teh teko &amp; sate hangat, langsung dari meja Anda.</h1>
        <p className="mu" style={{ marginBottom: 14 }}>Pilih menu, tulis catatan, kirim ke kasir.</p>
        <a className="b lnk" href="#menu">Lihat menu</a>
      </div>
      <div>
        <div className="hc">
          <Badge variant="accent">⭐ Best Seller</Badge>
          <div className="lab" style={{ margin: '16px 0', fontSize: 20, padding: '34px 8px' }}>{shortName(m.name)}</div>
          <b>{m.name}</b>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{rp(m.price)}</div>
        </div>
        <div className="dots">
          {items.map((x, j) => (
            <button key={x.id} type="button" aria-label={`Menu ${j + 1}`} className={`dot ${j === i ? 'on' : ''}`} onClick={() => setIdx(j)} />
          ))}
        </div>
      </div>
    </section>
  );
}
