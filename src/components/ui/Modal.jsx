import { useEffect } from 'react';

/** Modal tengah, atau bottom sheet bila `sheet`. Klik latar / Esc menutup bila `dismissable`. */
export default function Modal({ children, onClose, sheet = false, dismissable = true }) {
  useEffect(() => {
    if (!dismissable || !onClose) return undefined;
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [dismissable, onClose]);

  return (
    <div className={`ov ${sheet ? 'sh' : ''}`} onClick={(e) => e.target === e.currentTarget && dismissable && onClose?.()}>
      <div className="md" role="dialog" aria-modal="true">{children}</div>
    </div>
  );
}

export function ModalActions({ onCancel, onOk, okText, okDisabled, cancelText = 'Batal' }) {
  return (
    <div className="row" style={{ marginTop: 16 }}>
      <button type="button" className="b2" style={{ flex: 1 }} onClick={onCancel}>{cancelText}</button>
      <button type="button" className="b" style={{ flex: 1 }} onClick={onOk} disabled={okDisabled}>{okText}</button>
    </div>
  );
}
