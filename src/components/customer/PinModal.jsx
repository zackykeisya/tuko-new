import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { useToast } from '../../hooks/useToast';
import { Modal, ModalActions } from '../ui';

/** mode 'staff' menerima PIN Kasir atau Admin; mode 'admin' hanya PIN Admin. */
export default function PinModal({ mode = 'staff', onSuccess, onClose }) {
  const login = useStore((s) => s.login);
  const toast = useToast();
  const [value, setValue] = useState('');
  const ref = useRef(null);
  useEffect(() => ref.current?.focus(), []);

  const submit = () => {
    const role = login(value, mode === 'staff');
    if (role) return onSuccess(role);
    toast('PIN salah');
    setValue('');
    ref.current?.focus();
    return undefined;
  };

  return (
    <Modal onClose={onClose}>
      <h3 style={{ textAlign: 'center' }}>🔒 {mode === 'staff' ? 'Akses Staff' : 'PIN Admin'}</h3>
      <input
        ref={ref} className="pin" type="password" inputMode="numeric" maxLength={4}
        aria-label="PIN" value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
      />
      <ModalActions onCancel={onClose} onOk={submit} okText="Buka" />
    </Modal>
  );
}
