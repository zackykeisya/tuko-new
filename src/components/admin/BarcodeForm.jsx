import { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { useStore } from '../../store/useStore';
import { Button, Card, Input } from '../ui';

export default function BarcodeForm() {
  const toast = useToast();
  const addTable = useStore((s) => s.addTable);
  const [no, setNo] = useState('');
  const [label, setLabel] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!/^[A-Za-z0-9]{1,6}$/.test(no.trim())) return toast('Nomor meja 1–6 huruf/angka');
    const r = addTable({ no: no.trim(), label });
    if (r === 'duplicate') return toast('Nomor meja sudah ada');
    setNo(''); setLabel('');
    return toast('Meja ditambahkan');
  };

  return (
    <Card>
      <form className="row wr" style={{ alignItems: 'flex-end' }} onSubmit={submit}>
        <div style={{ flex: '1 1 120px' }}><Input label="Nomor Meja" placeholder="3" maxLength={6} value={no} onChange={(e) => setNo(e.target.value)} /></div>
        <div style={{ flex: '2 1 180px' }}><Input label="Label Meja" placeholder="Teras depan" maxLength={30} value={label} onChange={(e) => setLabel(e.target.value)} /></div>
        <div className="fg"><Button type="submit">+ Tambah Meja</Button></div>
      </form>
    </Card>
  );
}
