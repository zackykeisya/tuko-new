import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import PinModal from '../components/customer/PinModal';
import { OpenShiftModal } from '../components/kasir/ShiftPanel';
import { useShift } from '../hooks/useShift';
import { useStore } from '../store/useStore';
import '../styles/kasir.css';
import '../styles/admin.css';

const NAV = [
  ['/kasir/pos', '🛍️', 'POS'],
  ['/kasir/tabs', '📋', 'Open Tab'],
  ['/kasir/expenses', '💼', 'Pengeluaran'],
  ['/admin', '🛡️', 'Admin'],
  ['/kasir/shift', '🕐', 'Shift'],
];

/** Layout staff: sidebar + guard PIN (Kasir 8888 / Admin 1234). */
export default function KasirView() {
  const navigate = useNavigate();
  const role = useStore((s) => s.role);
  const setRole = useStore((s) => s.setRole);
  const { active, shift } = useShift();
  const [opening, setOpening] = useState(false);

  if (!role) return <PinModal mode="staff" onSuccess={() => {}} onClose={() => navigate('/')} />;

  const leave = () => { setRole(null); navigate('/'); };

  return (
    <div className="k">
      <nav className="side">
        <div className="logo">TUKO</div>
        <button type="button" className={`sb ${active ? 'on' : ''}`} onClick={() => (active ? navigate('/kasir/shift') : setOpening(true))}>
          {active ? <>{shift.name}<br /><span style={{ fontWeight: 500 }}>Kasir: {shift.cashierName}</span></> : 'Belum buka shift — klik untuk mulai'}
        </button>
        {NAV.map(([to, icon, label]) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nv ${isActive ? 'on' : ''}`}><span>{icon}</span><span>{label}</span></NavLink>
        ))}
        <button type="button" className="nv xt" style={{ marginTop: 'auto' }} onClick={leave}>↗ Mode Pembeli</button>
      </nav>
      <main className="k-main">
        <div className="mh">
          <b style={{ color: 'var(--primary)', fontSize: 20 }}>TUKO</b>
          <span className="mu">{active ? shift.name : 'Shift belum dibuka'}</span>
          <button type="button" className="b2" aria-label="Mode pembeli" onClick={leave}>↗</button>
        </div>
        <Outlet />
      </main>
      {opening && <OpenShiftModal onClose={() => setOpening(false)} />}
    </div>
  );
}
