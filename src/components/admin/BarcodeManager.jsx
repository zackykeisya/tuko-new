import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { EmptyState, Modal, ModalActions } from '../ui';
import BarcodeForm from './BarcodeForm';
import BarcodeRow from './BarcodeRow';

export default function BarcodeManager() {
  const tables = useStore((s) => s.tables);
  const removeTable = useStore((s) => s.removeTable);
  const [del, setDel] = useState(null);

  return (
    <>
      <BarcodeForm />
      {tables.length ? (
        <div className="qr-grid">
          {tables.map((t) => <BarcodeRow key={t.id} table={t} onDelete={setDel} />)}
        </div>
      ) : (
        <EmptyState icon="🔳" title="Belum ada meja">Tambahkan meja untuk membuat QR pemesanan.</EmptyState>
      )}
      {del && (
        <Modal onClose={() => setDel(null)}>
          <h3>Hapus Meja {del.no}?</h3>
          <p className="mu">QR yang sudah dicetak untuk meja ini tetap bisa discan, tetapi tidak tercatat lagi di daftar.</p>
          <ModalActions onCancel={() => setDel(null)} okText="Hapus" onOk={() => { removeTable(del.id); setDel(null); }} />
        </Modal>
      )}
    </>
  );
}
