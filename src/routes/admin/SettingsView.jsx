import { useState } from 'react';
import { Button, Card, Input, Modal, ModalActions } from '../../components/ui';
import { useToast } from '../../hooks/useToast';
import { useStore } from '../../store/useStore';

const RESET_OPTS = [['trans', 'Transaksi'], ['expenses', 'Pengeluaran'], ['shiftHistory', 'Riwayat shift'], ['tabs', 'Open tab'], ['log', 'Log aktivitas'], ['tables', 'Daftar meja & QR'], ['menu', 'Menu (kembali ke bawaan)']];

export default function SettingsView() {
  const toast = useToast();
  const { qrisImage, setQris, pin, kasirPin, setPins, resetSelective } = useStore();
  const [pins, setP] = useState({ pin, kasirPin });
  const [resetOpen, setResetOpen] = useState(false);
  const [checked, setChecked] = useState({});
  const [word, setWord] = useState('');

  const upload = (e) => {
    const f = e.target.files[0];
    e.target.value = '';
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) return toast('Maks 2MB');
    const r = new FileReader();
    r.onload = (ev) => { setQris(ev.target.result); toast('QRIS tersimpan'); };
    return r.readAsDataURL(f);
  };

  const savePins = () => {
    if (!/^\d{4}$/.test(pins.pin) || !/^\d{4}$/.test(pins.kasirPin)) return toast('PIN harus 4 digit angka');
    if (pins.pin === pins.kasirPin) return toast('PIN Admin dan Kasir harus berbeda');
    setPins(pins);
    return toast('PIN diperbarui');
  };

  const doReset = () => {
    if (word !== 'RESET') return toast('Ketik RESET');
    resetSelective(Object.keys(checked).filter((k) => checked[k] && k !== 'menu'), !!checked.menu);
    setResetOpen(false); setChecked({}); setWord('');
    return toast('Data direset');
  };

  return (
    <>
      <Card>
        <b>Gambar QRIS</b>
        <p className="mu" style={{ margin: '4px 0 10px' }}>Maks 2MB. Ditampilkan saat kasir memilih pembayaran QRIS.</p>
        <input type="file" accept="image/*" onChange={upload} />
        {qrisImage && (
          <div style={{ marginTop: 10, textAlign: 'center' }}>
            <img src={qrisImage} alt="QRIS" style={{ maxHeight: 200, margin: '8px auto', borderRadius: 10 }} />
            <Button variant="danger" onClick={() => setQris('')}>Hapus QRIS</Button>
          </div>
        )}
      </Card>
      <Card>
        <b>PIN Akses</b>
        <div className="row wr" style={{ alignItems: 'flex-end', marginTop: 10 }}>
          <div style={{ flex: 1 }}><Input label="PIN Admin" inputMode="numeric" maxLength={4} value={pins.pin} onChange={(e) => setP({ ...pins, pin: e.target.value })} /></div>
          <div style={{ flex: 1 }}><Input label="PIN Kasir" inputMode="numeric" maxLength={4} value={pins.kasirPin} onChange={(e) => setP({ ...pins, kasirPin: e.target.value })} /></div>
          <div className="fg"><Button onClick={savePins}>Simpan PIN</Button></div>
        </div>
      </Card>
      <Card className="danger">
        <b className="rd">⚠️ Danger Zone</b>
        <p className="mu" style={{ margin: '6px 0 10px' }}>Hapus data tertentu secara permanen.</p>
        <Button variant="danger" onClick={() => setResetOpen(true)}>Reset Data Selektif</Button>
      </Card>
      {resetOpen && (
        <Modal onClose={() => setResetOpen(false)}>
          <h3 className="rd">Reset Data Selektif</h3>
          {RESET_OPTS.map(([k, l]) => (
            <label key={k} className="row" style={{ justifyContent: 'flex-start', marginBottom: 6 }}>
              <input type="checkbox" style={{ width: 'auto' }} checked={!!checked[k]} onChange={(e) => setChecked({ ...checked, [k]: e.target.checked })} /> {l}
            </label>
          ))}
          <Input label="Ketik RESET untuk konfirmasi" placeholder="RESET" value={word} onChange={(e) => setWord(e.target.value)} />
          <ModalActions onCancel={() => setResetOpen(false)} onOk={doReset} okText="Reset" />
        </Modal>
      )}
    </>
  );
}
