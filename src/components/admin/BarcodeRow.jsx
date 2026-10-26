import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { tableUrl } from '../../lib/constants';
import { Button, Card } from '../ui';

/** Kartu satu meja: preview QR (dibuat di client), unduh PNG, hapus. */
export default function BarcodeRow({ table, onDelete }) {
  const url = tableUrl(table.no);
  const [src, setSrc] = useState('');

  useEffect(() => {
    let live = true;
    QRCode.toDataURL(url, { width: 600, margin: 2, errorCorrectionLevel: 'M' })
      .then((d) => live && setSrc(d))
      .catch(() => live && setSrc(''));
    return () => { live = false; };
  }, [url]);

  const download = () => {
    const a = document.createElement('a');
    a.href = src;
    a.download = `qr-meja-${table.no}.png`;
    a.click();
  };

  return (
    <Card className="qr-card">
      <b>Meja {table.no}</b>
      {table.label && <div className="mu">{table.label}</div>}
      {src ? <img className="qr-img" src={src} alt={`QR Meja ${table.no}`} /> : <div className="qr-img" />}
      <div className="mu qr-url">{url}</div>
      <div className="row">
        <Button style={{ flex: 1 }} onClick={download} disabled={!src}>Unduh QR</Button>
        <Button variant="danger" onClick={() => onDelete(table)}>Hapus</Button>
      </div>
    </Card>
  );
}
