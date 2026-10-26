import { useEffect, useRef, useState } from 'react';
import { parseTableInput, tableLabel } from '../../lib/helpers';
import { useToast } from '../../hooks/useToast';
import { Chip, Modal } from '../ui';

export default function TableChip({ session, onClick }) {
  if (!session) return null;
  return <Chip active onClick={onClick}>{tableLabel(session)} ✎</Chip>;
}

/** Fallback tanpa scan QR. Format: "3 - Ciki" (nama opsional). */
export function TableModal({ initial, required, onSubmit, onClose }) {
  const toast = useToast();
  const [value, setValue] = useState(initial ? `${initial.tableNo}${initial.customerName ? ' - ' + initial.customerName : ''}` : '');
  const ref = useRef(null);
  useEffect(() => ref.current?.focus(), []);

  const submit = () => {
    const parsed = parseTableInput(value);
    if (!parsed) return toast('Isi nomor meja, contoh: 3 - Ciki');
    return onSubmit(parsed);
  };

  return (
    <Modal dismissable={!required} onClose={onClose}>
      <h3>🍽️ Nomor Meja</h3>
      <p className="mu" style={{ marginBottom: 12 }}>Tulis nomor meja dan nama Anda, contoh: <b>3 - Ciki</b></p>
      <input
        ref={ref} placeholder="3 - Ciki" maxLength={30} value={value} aria-label="Nomor meja dan nama"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
      />
      <div className="row" style={{ marginTop: 16 }}>
        <button type="button" className="b" style={{ width: '100%' }} onClick={submit}>Mulai Pesan</button>
      </div>
    </Modal>
  );
}
