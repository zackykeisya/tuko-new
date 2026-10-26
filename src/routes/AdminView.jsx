import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import PinModal from '../components/customer/PinModal';
import { Button } from '../components/ui';
import { useStore } from '../store/useStore';

const TABS = [['/admin', 'Laporan', true], ['/admin/barcode', 'Barcode Meja'], ['/admin/settings', 'Pengaturan']];

/** Guard Admin (PIN 1234) + sub-navigasi. */
export default function AdminView() {
  const navigate = useNavigate();
  const role = useStore((s) => s.role);
  const setRole = useStore((s) => s.setRole);

  if (role !== 'admin') {
    return <PinModal mode="admin" onSuccess={() => {}} onClose={() => navigate(role ? '/kasir/pos' : '/')} />;
  }
  return (
    <>
      <div className="row wr" style={{ marginBottom: 12 }}>
        <b style={{ fontSize: 18 }}>Admin &amp; Laporan</b>
        <Button variant="secondary" onClick={() => { setRole('kasir'); navigate('/kasir/pos'); }}>Kunci</Button>
      </div>
      <div className="subnav">
        {TABS.map(([to, label, end]) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `chip ${isActive ? 'on' : ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>{label}</NavLink>
        ))}
      </div>
      <Outlet />
    </>
  );
}
